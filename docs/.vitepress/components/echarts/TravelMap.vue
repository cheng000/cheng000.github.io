<template>
  <div class="travel-map-container">
    <div class="legend">
      <div class="legend-item">
        <span class="legend-color visited"></span>
        <span class="legend-text">已访问</span>
      </div>
      <div class="legend-item">
        <span class="legend-color unvisited"></span>
        <span class="legend-text">未访问</span>
      </div>
    </div>
    <p class="tip">💡 提示：点击或悬停在已访问的省份上查看详细旅游记录</p>
    
    <div ref="chartContainer" class="chart-container"></div>

    <div v-if="selectedProvince" class="detail-card">
      <div class="detail-header">
        <span class="icon">📍</span>
        <h3>{{ selectedProvince.name }}</h3>
      </div>
      
      <div class="trips-list">
        <div 
          v-for="(trip, index) in selectedProvince.data.trips" 
          :key="index"
          class="trip-item"
        >
          <div class="trip-date">
            📅 {{ trip.date }}
          </div>
          <div class="trip-content">
            📷 {{ trip.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TravelMap',
  props: {
    travelData: {
      type: [Object, String],
      default: () => ({
        '北京': {
          visited: true,
          trips: [
            { date: '2023-05', content: '游览了故宫、长城、颐和园' },
            { date: '2024-03', content: '参观了国家博物馆、天坛' }
          ]
        },
        '上海': {
          visited: true,
          trips: [
            { date: '2023-08', content: '外滩、东方明珠、南京路步行街' }
          ]
        }
      })
    }
  },
  computed: {
    parsedTravelData() {
      // 如果传入的是字符串，尝试解析为JSON
      let data = this.travelData
      if (typeof this.travelData === 'string') {
        try {
          data = JSON.parse(this.travelData)
        } catch (e) {
          console.error('解析旅游数据失败:', e)
          return {}
        }
      }
      
      // 标准化省份名称：将用户输入的名称映射到地图标准名称
      const normalizedData = {}
      const provinceMap = {
        '北京': '北京市',
        '天津': '天津市',
        '上海': '上海市',
        '重庆': '重庆市',
        '河北': '河北省',
        '山西': '山西省',
        '辽宁': '辽宁省',
        '吉林': '吉林省',
        '黑龙江': '黑龙江省',
        '江苏': '江苏省',
        '浙江': '浙江省',
        '安徽': '安徽省',
        '福建': '福建省',
        '江西': '江西省',
        '山东': '山东省',
        '河南': '河南省',
        '湖北': '湖北省',
        '湖南': '湖南省',
        '广东': '广东省',
        '海南': '海南省',
        '四川': '四川省',
        '贵州': '贵州省',
        '云南': '云南省',
        '陕西': '陕西省',
        '甘肃': '甘肃省',
        '青海': '青海省',
        '台湾': '台湾省',
        '内蒙古': '内蒙古自治区',
        '广西': '广西壮族自治区',
        '西藏': '西藏自治区',
        '宁夏': '宁夏回族自治区',
        '新疆': '新疆维吾尔自治区',
        '香港': '香港特别行政区',
        '澳门': '澳门特别行政区'
      }
      
      Object.keys(data || {}).forEach(key => {
        // 如果用户输入的是简称，转换为全称
        const standardName = provinceMap[key] || key
        normalizedData[standardName] = data[key]
      })
      
      console.log('标准化后的数据:', normalizedData)
      return normalizedData
    }
  },
  data() {
    return {
      chart: null,
      selectedProvince: null
    }
  },
  mounted() {
    this.loadECharts()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    loadECharts() {
      // 检查是否已加载ECharts
      if (window.echarts) {
        this.initChart()
        return
      }

      // 动态加载ECharts
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js'
      script.onload = () => {
        this.initChart()
      }
      document.head.appendChild(script)
    },

    async initChart() {
      try {
        // 加载中国地图数据
        const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
        const chinaJson = await response.json()

        // 初始化图表
        this.chart = window.echarts.init(this.$refs.chartContainer)
        
        // 注册地图
        window.echarts.registerMap('china', chinaJson)

        // 调试：打印接收到的数据
        console.log('接收到的旅游数据:', this.parsedTravelData)
        console.log('数据类型:', typeof this.parsedTravelData)
        console.log('数据键值:', Object.keys(this.parsedTravelData))

        // 准备数据
        const mapData = Object.keys(this.parsedTravelData).map(province => ({
          name: province,
          value: this.parsedTravelData[province].trips ? this.parsedTravelData[province].trips.length : 1,
          visited: this.parsedTravelData[province].visited
        }))

        console.log('处理后的地图数据:', mapData)

        // 获取所有省份名称用于完整数据
        const allProvinces = chinaJson.features.map(f => f.properties.name)
        console.log('地图包含的所有省份:', allProvinces)
        
        // 为所有省份创建完整数据
        const completeMapData = allProvinces.map(provinceName => {
          const provinceData = this.parsedTravelData[provinceName]
          const isVisited = provinceData && provinceData.visited
          
          return {
            name: provinceName,
            value: isVisited ? (provinceData.trips ? provinceData.trips.length : 1) : 0,
            visited: isVisited,
            itemStyle: isVisited ? {
              areaColor: '#91d5ff',
              borderColor: '#1890ff',
              borderWidth: 2
            } : {
              areaColor: '#f5f5f5',
              borderColor: '#d9d9d9',
              borderWidth: 0.5
            }
          }
        })
        
        console.log('完整地图数据:', completeMapData.filter(d => d.visited))

        const option = {
          title: {
            text: '我的旅游足迹',
            left: 'center',
            top: 20,
            textStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              if (this.parsedTravelData[params.name]) {
                const province = this.parsedTravelData[params.name]
                let tooltip = `<div style="padding: 10px;">
                  <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1890ff;">
                    ${params.name}
                  </div>`
                
                if (province.trips && province.trips.length > 0) {
                  province.trips.forEach((trip) => {
                    tooltip += `
                      <div style="margin: 6px 0; padding: 6px; background: #f5f5f5; border-radius: 4px;">
                        <div style="color: #666; font-size: 12px; margin-bottom: 4px;">📅 ${trip.date}</div>
                        <div style="color: #333;">${trip.content}</div>
                      </div>`
                  })
                }
                
                tooltip += `</div>`
                return tooltip
              }
              return params.name
            }
          },
          series: [
            {
              name: '旅游足迹',
              type: 'map',
              map: 'china',
              roam: true,
              selectedMode: false,
              label: {
                show: false
              },
              itemStyle: {
                areaColor: '#f5f5f5',
                borderColor: '#d9d9d9',
                borderWidth: 0.5
              },
              emphasis: {
                label: {
                  show: true,
                  color: '#fff'
                },
                itemStyle: {
                  areaColor: '#ffa940',
                  borderColor: '#ff7a45',
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: 'rgba(255, 138, 0, 0.5)'
                }
              },
              data: completeMapData
            }
          ]
        }

        this.chart.setOption(option)

        // 点击事件
        this.chart.on('click', (params) => {
          console.log('点击的省份:', params.name)
          console.log('该省份数据:', this.parsedTravelData[params.name])
          
          if (this.parsedTravelData[params.name]) {
            this.selectedProvince = {
              name: params.name,
              data: this.parsedTravelData[params.name]
            }
          }
        })

        // 响应式
        window.addEventListener('resize', this.handleResize)

      } catch (error) {
        console.error('加载地图数据失败:', error)
      }
    },

    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.travel-map-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-color.visited {
  background-color: #91d5ff;
}

.legend-color.unvisited {
  background-color: #f0f0f0;
}

.legend-text {
  font-size: 14px;
  color: #666;
}

.tip {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.chart-container {
  width: 100%;
  height: 600px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.detail-card {
  margin-top: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
  border-radius: 8px;
  border: 1px solid #91d5ff;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-header .icon {
  font-size: 24px;
}

.detail-header h3 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.trips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trip-item {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #d9f0ff;
}

.trip-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.trip-content {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
}
</style>