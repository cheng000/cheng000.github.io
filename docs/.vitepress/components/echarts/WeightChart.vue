<!-- WeightChart.vue - 支持备注的体重图表组件 -->
<template>
  <ClientOnly>
    <div :id="chartId" :style="{ width, height }" class="weight-chart-container"></div>
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
    // 支持两种数据格式:
    // 格式1: { "2024-01-01": 2500, "2024-01-02": 2520 }
    // 格式2: { "2024-01-01": { weight: 2500, note: "第一次称重" } }
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
    let resizeTimer = null
    
    // 检测是否为移动设备
    const isMobile = () => {
      return window.innerWidth <= 768
    }
    
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
          
          // 监听窗口大小变化，使用防抖
          window.addEventListener('resize', handleResize)
        }
      } catch (error) {
        console.error('ECharts加载失败:', error)
      }
    }
    
    const processWeightData = () => {
      // 处理两种数据格式
      const sortedEntries = Object.entries(props.weightData).sort(([a], [b]) => a.localeCompare(b))
      
      const dates = []
      const weights = []
      const notes = []
      
      sortedEntries.forEach(([date, value]) => {
        dates.push(date)
        
        if (typeof value === 'object' && value !== null) {
          // 格式2: { weight: 2500, note: "备注" }
          const weight = props.unit === 'kg' ? (value.weight / 1000) : value.weight
          weights.push(weight)
          notes.push(value.note || '')
        } else {
          // 格式1: 直接是数值
          const weight = props.unit === 'kg' ? (value / 1000) : value
          weights.push(weight)
          notes.push('')
        }
      })
      
      return { dates, weights, notes }
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
      
      const { dates, weights, notes } = processWeightData()
      
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
      
      // 为每个数据点创建带有备注信息的对象
      const seriesData = weights.map((weight, index) => ({
        value: weight,
        note: notes[index],
        originalDate: dates[index],
        formattedDate: formattedDates[index]
      }))
      
      // 根据设备类型调整配置
      const mobile = isMobile()
      
      const defaultOptions = {
        title: {
          text: props.title,
          left: 'center',
          textStyle: {
            fontSize: mobile ? 14 : 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false
          },
          confine: true, // 限制tooltip在图表区域内
          formatter: function(params) {
            const param = params[0]
            const dataItem = param.data
            const weight = dataItem.value
            const note = dataItem.note
            const originalDate = dataItem.originalDate
            
            // 计算与前一天的变化
            const prevIndex = param.dataIndex - 1
            let changeText = ''
            if (prevIndex >= 0) {
              const prevWeight = seriesData[prevIndex].value
              const change = (weight - prevWeight).toFixed(1)
              const changeColor = change > 0 ? '#67C23A' : change < 0 ? '#F56C6C' : '#909399'
              changeText = `<div style="margin-top: 8px;">变化: <span style="color: ${changeColor}; font-weight: bold;">${change > 0 ? '+' : ''}${change}${props.unit}</span></div>`
            }
            
            // 备注信息
            const noteText = note ? `<div style="margin-top: 8px; padding: 6px; background: rgba(0,0,0,0.05); border-radius: 4px; font-style: italic; color: #666; word-wrap: break-word; word-break: break-word; white-space: pre-wrap; max-width: ${mobile ? '200px' : '300px'};">📝 ${note}</div>` : '';
            
            return `
              <div style="font-size: ${mobile ? '12px' : '14px'}; line-height: 1.5;">
                <div style="font-weight: bold; margin-bottom: 8px;">${originalDate}</div>
                <div>体重: <span style="color: ${props.lineColor}; font-weight: bold; font-size: ${mobile ? '14px' : '16px'};">${weight}${props.unit}</span></div>
                ${changeText}
                ${noteText}
              </div>
            `
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: props.lineColor,
          borderWidth: 1,
          textStyle: {
            color: '#333'
          },
          extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; padding: 12px;'
        },
        legend: {
          data: ['体重'],
          top: mobile ? 30 : 35,
          show: !mobile // 移动端隐藏图例以节省空间
        },
        grid: {
          left: mobile ? '8%' : '3%',
          right: mobile ? '8%' : '4%', // 移动端减少右侧边距，确保内容显示完整
          bottom: mobile ? '12%' : '8%',
          top: mobile ? '12%' : '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: formattedDates,
          axisLabel: {
            rotate: mobile ? (dates.length > 5 ? 45 : 0) : (dates.length > 10 ? 45 : 0),
            fontSize: mobile ? 10 : 12,
            interval: mobile && dates.length > 10 ? 'auto' : 0, // 移动端自动间隔显示
            showMaxLabel: true,
            showMinLabel: true
          },
          axisLine: {
            lineStyle: { color: '#E4E7ED' }
          },
          axisTick: {
            alignWithLabel: true
          },
          // 确保最后一个标签显示
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          name: mobile ? props.unit : `体重 (${props.unit})`,
          nameLocation: 'middle',
          nameGap: mobile ? 30 : 50,
          nameTextStyle: {
            fontSize: mobile ? 10 : 12
          },
          axisLabel: {
            formatter: value => mobile ? `${value}` : `${value}${props.unit}`,
            fontSize: mobile ? 10 : 12
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
            data: seriesData,
            smooth: true,
            symbol: props.showSymbol ? 'circle' : 'none',
            symbolSize: function(value, params) {
              // 如果有备注，显示更大的符号
              const baseSize = mobile ? 4 : 6
              return params.data.note ? baseSize + 4 : baseSize
            },
            lineStyle: {
              color: props.lineColor,
              width: mobile ? 1.5 : 2
            },
            itemStyle: {
              color: function(params) {
                // 有备注的点使用不同颜色
                return params.data.note ? '#FF6B6B' : props.lineColor
              },
              borderColor: '#fff',
              borderWidth: mobile ? 1 : 2
            },
            // 为有备注的点添加特殊标记
            markPoint: mobile ? null : { // 移动端隐藏标记点以简化界面
              symbol: 'pin',
              symbolSize: [20, 20],
              data: seriesData.map((item, index) => {
                if (item.note) {
                  return {
                    name: '备注',
                    coord: [index, item.value],
                    itemStyle: {
                      color: '#FF6B6B',
                      borderColor: '#fff',
                      borderWidth: 2
                    },
                    label: {
                      show: false
                    }
                  }
                }
                return null
              }).filter(Boolean)
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
            markLine: (weights.length > 1 && !mobile) ? { // 移动端隐藏平均线
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
            } : null
          }
        ],
        // 移动端隐藏数据统计面板
        graphic: mobile ? [] : [
          {
            type: 'group',
            right: 400,
            top: 60,
            children: [
              {
                type: 'rect',
                shape: { width: 140, height: notes.some(n => n) ? 80 : 50 },
                style: {
                  fill: 'rgba(255,255,255,0.95)',
                  stroke: '#E4E7ED',
                  lineWidth: 1,
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowBlur: 4
                }
              },
              {
                type: 'text',
                style: {
                  text: '数据统计',
                  x: 70,
                  y: 5,
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
                  y: 22,
                  fontSize: 10,
                  fill: '#67C23A'
                }
              },
              {
                type: 'text',
                style: {
                  text: `最低: ${minWeight.toFixed(1)}${props.unit}`,
                  x: 10,
                  y: 37,
                  fontSize: 10,
                  fill: '#F56C6C'
                }
              },
              {
                type: 'text',
                style: {
                  text: `记录: ${dates.length}天`,
                  x: 10,
                  y: 52,
                  fontSize: 10,
                  fill: '#909399'
                }
              }
            ]
          }
        ],
        // 添加数据缩放组件，支持手势缩放
        dataZoom: mobile && dates.length > 10 ? [
          {
            type: 'inside',
            start: Math.max(0, ((dates.length - 10) / dates.length) * 100),
            end: 100,
            zoomOnMouseWheel: 'ctrl',
            moveOnMouseMove: true
          }
        ] : []
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
      // 使用防抖避免频繁resize
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        if (chart) {
          chart.resize()
          // 重新更新图表配置以适应新的屏幕尺寸
          updateChart()
        }
      }, 100)
    }
    
    // 监听数据变化
    watch(() => [props.weightData, props.unit], () => {
      updateChart()
    }, { deep: true })
    
    onUnmounted(() => {
      if (chart) {
        chart.dispose()
      }
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      window.removeEventListener('resize', handleResize)
    })
    
    return { chartId }
  }
}
</script>

<style scoped>
.weight-chart-container {
  position: relative;
  overflow: hidden;
}

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

/* 移动端样式优化 */
@media (max-width: 768px) {
  .weight-chart-container {
    touch-action: pan-x pan-y;
  }
}
</style>