<!-- WeightChartEditable.vue - 支持编辑和API集成的体重图表组件 -->
<template>
  <div class="weight-chart-editable">
    <!-- 编辑面板 -->
    <div class="edit-panel" :class="{ show: showEditPanel }">
      <div class="panel-header">
        <h3>体重记录管理</h3>
        <button class="close-btn" @click="toggleEditPanel">×</button>
      </div>

      <div class="panel-content">
        <!-- 添加新记录表单 -->
        <form @submit.prevent="addRecord" class="add-form">
          <div class="form-row">
            <div class="form-group">
              <label>日期</label>
              <input
                type="date"
                v-model="newRecord.recordDate"
                :max="today"
                required
              />
            </div>
            <div class="form-group">
              <label>体重 ({{ unit }})</label>
              <input
                type="number"
                v-model.number="newRecord.weight"
                :min="0"
                :step="1"
                placeholder="输入体重"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label>备注</label>
            <textarea
              v-model="newRecord.note"
              placeholder="添加备注（可选）"
              rows="2"
            ></textarea>
          </div>
          <button type="submit" class="submit-btn">添加记录</button>
        </form>

        <!-- 记录列表 -->
        <div class="records-list">
          <div class="list-header">
            <h4>已有记录 ({{ records.length }})</h4>
          </div>
          <div class="list-content">
            <div
              v-for="record in sortedRecords"
              :key="record.id || record.recordDate"
              class="record-item"
            >
              <div class="record-left">
                <div class="record-date-box">
                  <span class="record-day">{{ formatDay(record.recordDate) }}</span>
                  <span class="record-month-year">{{ formatMonthYear(record.recordDate) }}</span>
                </div>
                <div class="record-weight-box">
                  <span class="record-weight-value">{{ record.weight }}</span>
                  <span class="record-weight-unit">{{ unit }}</span>
                </div>
              </div>
              <div class="record-right">
                <span class="record-note" v-if="record.note">{{ record.note }}</span>
                <div class="record-actions">
                  <button class="edit-btn" @click="editRecord(record)">✎</button>
                  <button class="delete-btn" @click="deleteRecord(record)">🗑</button>
                </div>
              </div>
            </div>
            <div v-if="records.length === 0" class="empty-state">
              暂无记录
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="chart-wrapper">
      <div class="chart-header">
        <h3>{{ title }}</h3>
        <button class="toggle-edit-btn" @click="toggleEditPanel">
          {{ showEditPanel ? '关闭编辑' : '管理记录' }}
        </button>
      </div>

      <!-- 使用原有的 WeightChart 组件 -->
      <WeightChart
        :weightData="chartData"
        :title="title"
        :unit="unit"
        :lineColor="lineColor"
        :showArea="showArea"
        :height="height"
        :showSymbol="showSymbol"
      />

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        {{ error }}
        <button @click="fetchRecords" class="retry-btn">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import WeightChart from '../../echarts/WeightChart.vue'

// Props
const props = defineProps({
  // 宠物名称（必需）
  petName: {
    type: String,
    required: true
  },
  // API 基础地址
  apiBase: {
    type: String,
    // default: 'http://localhost:8091'
    default: 'https://api.blazing3service.site'
  },
  // 图表标题
  title: {
    type: String,
    default: '体重变化趋势'
  },
  // 体重单位
  unit: {
    type: String,
    default: 'g',
    validator: value => ['g', 'kg'].includes(value)
  },
  // 线条颜色
  lineColor: {
    type: String,
    default: '#FF6B9D'
  },
  // 是否显示区域填充
  showArea: {
    type: Boolean,
    default: true
  },
  // 图表高度
  height: {
    type: String,
    default: '350px'
  },
  // 是否显示数据点
  showSymbol: {
    type: Boolean,
    default: true
  },
  // 是否在组件挂载时自动加载数据
  autoLoad: {
    type: Boolean,
    default: true
  },
  // 初始是否显示编辑面板
  showEditInitially: {
    type: Boolean,
    default: false
  }
})

// 状态
const records = ref([])
const loading = ref(false)
const error = ref(null)
const showEditPanel = ref(props.showEditInitially)
const today = computed(() => new Date().toISOString().split('T')[0])

// 新记录表单
const newRecord = ref({
  recordDate: today.value,
  weight: null,
  note: ''
})

// 编辑中的记录
const editingRecord = ref(null)

// 计算属性：排序后的记录（倒序）
const sortedRecords = computed(() => {
  return [...records.value].sort((a, b) =>
    new Date(b.recordDate) - new Date(a.recordDate)
  )
})

// 计算属性：转换为图表所需的数据格式
const chartData = computed(() => {
  const data = {}
  sortedRecords.value.forEach(record => {
    data[record.recordDate] = {
      weight: record.weight,
      note: record.note || ''
    }
  })
  return data
})

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 格式化年份
const formatYear = (dateStr) => {
  const date = new Date(dateStr)
  return date.getFullYear()
}

// 格式化日
const formatDay = (dateStr) => {
  const date = new Date(dateStr)
  return date.getDate()
}

// 格式化月年
const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr)
  const month = date.toLocaleDateString('zh-CN', { month: 'short' })
  return `${date.getFullYear()} ${month}`
}

// 获取体重记录
const fetchRecords = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `${props.apiBase}/pet/weight?petName=${encodeURIComponent(props.petName)}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      records.value = result.data
    } else {
      throw new Error(result.message || '获取数据失败')
    }
  } catch (err) {
    error.value = `加载失败: ${err.message}`
    console.error('Failed to fetch weight records:', err)
  } finally {
    loading.value = false
  }
}

// 添加记录
const addRecord = async () => {
  loading.value = true
  error.value = null

  try {
    const payload = {
      petName: props.petName,
      recordDate: newRecord.value.recordDate,
      weight: newRecord.value.weight,
      unit: props.unit,
      note: newRecord.value.note || null
    }

    const response = await fetch(`${props.apiBase}/pet/weight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      // 更新本地记录
      const existingIndex = records.value.findIndex(
        r => r.recordDate === newRecord.value.recordDate
      )

      if (existingIndex >= 0) {
        records.value[existingIndex] = result.data
      } else {
        records.value.push(result.data)
      }

      // 重置表单
      newRecord.value = {
        recordDate: today.value,
        weight: null,
        note: ''
      }
    } else {
      throw new Error(result.message || '保存失败')
    }
  } catch (err) {
    error.value = `保存失败: ${err.message}`
    console.error('Failed to add weight record:', err)
  } finally {
    loading.value = false
  }
}

// 编辑记录
const editRecord = (record) => {
  newRecord.value = {
    recordDate: record.recordDate,
    weight: record.weight,
    note: record.note || ''
  }
  editingRecord.value = record
}

// 删除记录
const deleteRecord = async (record) => {
  if (!confirm(`确定要删除 ${formatDate(record.recordDate)} 的记录吗？`)) {
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(`${props.apiBase}/pet/weight/${record.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      // 从本地记录中移除
      records.value = records.value.filter(r => r.id !== record.id)
    } else {
      throw new Error(result.message || '删除失败')
    }
  } catch (err) {
    error.value = `删除失败: ${err.message}`
    console.error('Failed to delete weight record:', err)
  } finally {
    loading.value = false
  }
}

// 切换编辑面板
const toggleEditPanel = () => {
  showEditPanel.value = !showEditPanel.value
}

// 组件挂载时加载数据
onMounted(() => {
  if (props.autoLoad) {
    fetchRecords()
  }
})

// 监听宠物名称变化，重新加载数据
watch(() => props.petName, () => {
  if (props.autoLoad) {
    fetchRecords()
  }
})
</script>

<style scoped>
.weight-chart-editable {
  position: relative;
  margin: 1rem 0;
}

/* 编辑面板样式 */
.edit-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.edit-panel.show {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #e9ecef;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* 表单样式 */
.add-form {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 0.5rem;
}

.form-group {
  flex: 1;
  margin-bottom: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #FF6B9D;
}

.submit-btn {
  width: 100%;
  padding: 0.6rem;
  background: #FF6B9D;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.submit-btn:hover {
  background: #e85a8a;
}

/* 记录列表样式 */
.records-list {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.list-header h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #666;
}

.list-content {
  max-height: 400px;
  overflow-y: auto;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: box-shadow 0.2s;
}

.record-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: #FF6B9D;
}

.record-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  min-width: 0;
}

.record-date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #FF6B9D 0%, #e85a8a 100%);
  border-radius: 10px;
  flex-shrink: 0;
  padding: 4px;
  box-sizing: border-box;
}

.record-day {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.record-month-year {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 1px;
  white-space: nowrap;
  line-height: 1.1;
}

.record-weight-box {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.record-weight-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.record-weight-unit {
  font-size: 0.75rem;
  color: #999;
  font-weight: 500;
}

.record-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.record-note {
  font-size: 0.8rem;
  color: #888;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-actions {
  display: flex;
  gap: 0.35rem;
}

.edit-btn,
.delete-btn {
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  opacity: 0.7;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #FF6B9D;
  opacity: 1;
  color: #fff;
}

.delete-btn:hover {
  background: #e74c3c;
  opacity: 1;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 1rem;
  color: #999;
  font-size: 0.875rem;
}

/* 图表包装器样式 */
.chart-wrapper {
  position: relative;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  margin: 0;
}

.toggle-edit-btn {
  padding: 0.5rem 1rem;
  background: #FF6B9D;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.toggle-edit-btn:hover {
  background: #e85a8a;
}

/* 加载和错误状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #FF6B9D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #e74c3c;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #FF6B9D;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .edit-panel {
    width: 100%;
    right: -100%;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>
