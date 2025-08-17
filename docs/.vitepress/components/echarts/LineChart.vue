    <!-- LineChart.vue 组件文件 -->
<template>
  <div :id="chartId" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  props: {
    // 图表数据
    data: {
      type: Object,
      required: true,
      default: () => ({
        xAxis: [],
        series: []
      })
    },
    // 图表配置
    options: {
      type: Object,
      default: () => ({})
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
    // 图表ID，支持多个图表
    chartId: {
      type: String,
      default: () => `chart-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    },
    options: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById(this.chartId)
      if (!chartDom) return
      
      this.chart = echarts.init(chartDom)
      this.updateChart()
    },
    
    updateChart() {
      if (!this.chart) return
      
      const defaultOptions = {
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: [],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.xAxis || []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      
      // 处理series数据
      const series = (this.data.series || []).map(item => ({
        name: item.name || '',
        type: 'line',
        data: item.data || [],
        smooth: item.smooth !== false, // 默认平滑
        symbol: item.symbol || 'circle',
        symbolSize: item.symbolSize || 6,
        lineStyle: item.lineStyle || {},
        areaStyle: item.areaStyle || null, // 设置为对象启用区域填充
        ...item
      }))
      
      // 更新legend数据
      defaultOptions.legend.data = series.map(item => item.name)
      defaultOptions.series = series
      
      // 合并用户自定义配置
      const finalOptions = this.mergeOptions(defaultOptions, this.options)
      
      this.chart.setOption(finalOptions, true)
    },
    
    // 深度合并配置项
    mergeOptions(target, source) {
      const result = { ...target }
      
      for (const key in source) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.mergeOptions(result[key] || {}, source[key])
        } else {
          result[key] = source[key]
        }
      }
      
      return result
    },
    
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    
    // 导出图片
    getDataURL() {
      if (this.chart) {
        return this.chart.getDataURL({
          type: 'png',
          backgroundColor: '#fff'
        })
      }
    }
  }
}
</script>

<style scoped>
/* 如果需要特殊样式可以在这里添加 */
</style>