<!-- WeightChart.vue - 专门处理体重数据的图表组件 -->
<template>
  <ClientOnly>
    <div :id="chartId" :style="{ width, height }"></div>
    <template #fallback>
      <div class="chart-loading">
        <div class="loading-text">体重数据加载中...</div>
      </div>
    </template>
  </ClientOnly>
</template>

<script>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'

export default {
  name: 'WeightChart',
  props: {
    // JSON格式的体重数据: { "2024-01-01": 2500, "2024-01-02": 2520, ... }
    weightData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    // 图表标题
    title: {
      type: String,
      default: '体重变化趋势'
    },
    // 体重单位显示 (g/kg)
    unit: {
      type: String,
      default: 'g',
      validator: value => ['g', 'kg'].includes(value)
    },
    // 是否显示数据点
    showSymbol: {
      type: Boolean,
      default: true
    },
    // 线条颜色
    lineColor: {
      type: String,
      default: '#5470c6'
    },
    // 是否显示区域填充
    showArea: {
      type: Boolean,
      default: false
    },
    // 图表尺寸
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    // 自定义配置选项
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartId = `weight-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    let chart = null
    
    onMounted(async () => {
      await nextTick()
      await initChart()
    })
    
    const initChart = async () => {
      try {
        const echarts = await import('echarts')
        const echartsLib = echarts.default || echarts
        
        const dom = document.getElementById(chartId)
        if (dom) {
          chart = echartsLib.init(dom)
          updateChart()
          
          // 监听窗口大小变化
          window.addEventListener('resize', handleResize)
        }
      } catch (error) {
        console.error('ECharts加载失败:', error)
      }
    }
    
    const processWeightData = () => {
      // 将JSON格式转换为ECharts需要的格式
      const dates = Object.keys(props.weightData).sort() // 按日期排序
      const weights = dates.map(date => {
        const weight = props.weightData[date]
        // 根据单位转换数据
        return props.unit === 'kg' ? (weight / 1000) : weight
      })
      
      return { dates, weights }
    }
    
    const formatDate = (dateStr) => {
      try {
        const date = new Date(dateStr)
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${month}/${day}`
      } catch (error) {
        return dateStr
      }
    }
    
    const updateChart = () => {
      if (!chart) return
      
      const { dates, weights } = processWeightData()
      
      if (dates.length === 0) {
        console.warn('没有体重数据')
        return
      }
      
      // 格式化日期显示
      const formattedDates = dates.map(formatDate)
      
      // 计算统计信息
      const maxWeight = Math.max(...weights)
      const minWeight = Math.min(...weights)
      const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length
      const weightChange = weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0
      
      const defaultOptions = {
        title: {
          text: props.title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          },
          subtext: `变化: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}${props.unit}`,
          subtextStyle: {
            color: weightChange > 0 ? '#67C23A' : weightChange < 0 ? '#F56C6C' : '#909399'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false
          },
          formatter: function(params) {
            const param = params[0]
            const originalDate = dates[param.dataIndex]
            const weight = param.value
            const change = param.dataIndex > 0 ? 
              (weight - weights[param.dataIndex - 1]).toFixed(1) : 0
            
            return `
              <div style="font-size: 14px;">
                <div><strong>${originalDate}</strong></div>
                <div>体重: <strong>${weight}${props.unit}</strong></div>
                ${param.dataIndex > 0 ? 
                  `<div>变化: <span style="color: ${change > 0 ? '#67C23A' : '#F56C6C'}">${change > 0 ? '+' : ''}${change}${props.unit}</span></div>` 
                  : ''}
              </div>
            `
          }
        },
        legend: {
          data: ['体重'],
          top: 35
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: formattedDates,
          axisLabel: {
            rotate: dates.length > 10 ? 45 : 0,
            fontSize: 12
          },
          axisLine: {
            lineStyle: { color: '#E4E7ED' }
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: `体重 (${props.unit})`,
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontSize: 12
          },
          axisLabel: {
            formatter: value => `${value}${props.unit}`
          },
          axisLine: {
            lineStyle: { color: '#E4E7ED' }
          },
          splitLine: {
            lineStyle: { 
              color: '#F5F7FA',
              type: 'dashed'
            }
          },
          // 设置y轴范围，留出一些边距
          min: function(value) {
            return Math.max(0, value.min - (value.max - value.min) * 0.1)
          },
          max: function(value) {
            return value.max + (value.max - value.min) * 0.1
          }
        },
        series: [
          {
            name: '体重',
            type: 'line',
            data: weights,
            smooth: true,
            symbol: props.showSymbol ? 'circle' : 'none',
            symbolSize: 6,
            lineStyle: {
              color: props.lineColor,
              width: 2
            },
            itemStyle: {
              color: props.lineColor,
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: props.showArea ? {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: `${props.lineColor}30` },
                  { offset: 1, color: `${props.lineColor}05` }
                ]
              }
            } : null,
            markLine: weights.length > 1 ? {
              silent: true,
              lineStyle: {
                color: '#909399',
                type: 'dashed',
                width: 1
              },
              data: [
                { type: 'average', name: '平均值' }
              ],
              label: {
                formatter: `平均: {c}${props.unit}`
              }
            } : null,
            markPoint: {
              data: [
                { type: 'max', name: '最高', itemStyle: { color: '#67C23A' } },
                { type: 'min', name: '最低', itemStyle: { color: '#F56C6C' } }
              ]
            }
          }
        ],
        // 添加数据概览
        graphic: [
          {
            type: 'group',
            right: 20,
            top: 60,
            children: [
              {
                type: 'rect',
                shape: { width: 120, height: 80 },
                style: {
                  fill: 'rgba(255,255,255,0.9)',
                  stroke: '#E4E7ED',
                  lineWidth: 1
                }
              },
              {
                type: 'text',
                style: {
                  text: '数据统计',
                  x: 60,
                  y: 15,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 'bold'
                }
              },
              {
                type: 'text',
                style: {
                  text: `最高: ${maxWeight.toFixed(1)}${props.unit}`,
                  x: 10,
                  y: 30,
                  fontSize: 10,
                  fill: '#67C23A'
                }
              },
              {
                type: 'text',
                style: {
                  text: `最低: ${minWeight.toFixed(1)}${props.unit}`,
                  x: 10,
                  y: 45,
                  fontSize: 10,
                  fill: '#F56C6C'
                }
              },
              {
                type: 'text',
                style: {
                  text: `平均: ${avgWeight.toFixed(1)}${props.unit}`,
                  x: 10,
                  y: 60,
                  fontSize: 10,
                  fill: '#909399'
                }
              },
              {
                type: 'text',
                style: {
                  text: `记录: ${dates.length}次`,
                  x: 10,
                  y: 75,
                  fontSize: 10,
                  fill: '#606266'
                }
              }
            ]
          }
        ]
      }
      
      // 合并用户自定义配置
      const finalOptions = mergeDeep(defaultOptions, props.options)
      chart.setOption(finalOptions, true)
    }
    
    const mergeDeep = (target, source) => {
      const result = { ...target }
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = mergeDeep(result[key] || {}, source[key])
        } else {
          result[key] = source[key]
        }
      }
      return result
    }
    
    const handleResize = () => {
      if (chart) {
        chart.resize()
      }
    }
    
    // 监听数据变化
    watch(() => [props.weightData, props.unit], () => {
      updateChart()
    }, { deep: true })
    
    onUnmounted(() => {
      if (chart) {
        chart.dispose()
      }
      window.removeEventListener('resize', handleResize)
    })
    
    return { chartId }
  }
}
</script>

<style scoped>
.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  background-color: #fafafa;
}

.loading-text {
  color: #666;
  font-size: 14px;
}
</style>