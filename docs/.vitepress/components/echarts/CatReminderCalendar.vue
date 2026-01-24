<template>
  <ClientOnly>
    <!-- 全局今日提醒浮层 -->
    <transition name="global-reminder-slide">
      <div v-if="shouldShowGlobalReminder" class="global-reminder-container">
        <div class="global-reminder-card" :class="{ 'expanded': isReminderExpanded }">
          <!-- 折叠状态 -->
          <div class="reminder-compact">
            <div class="reminder-compact-left" @click="toggleReminderExpand">
              <div class="reminder-icon-bell">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <div class="reminder-compact-info">
                <span class="reminder-compact-title">今日提醒</span>
                <span class="reminder-compact-count">{{ todayReminders.length }} 项待办</span>
              </div>
            </div>
            <div class="reminder-compact-actions">
              <button class="reminder-toggle-btn" @click="toggleReminderExpand">
                <svg viewBox="0 0 24 24" width="18" height="18" :class="{ 'rotated': isReminderExpanded }">
                  <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
              <button class="reminder-dismiss-btn" @click="dismissGlobalReminder" title="忽略">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 展开内容 -->
          <transition name="reminder-expand">
            <div v-show="isReminderExpanded" class="reminder-expanded-content">
              <div class="reminder-expanded-list">
                <div
                  v-for="reminder in todayReminders"
                  :key="reminder.id"
                  class="global-reminder-item"
                  @click.stop="completeReminder(reminder)"
                >
                  <span class="global-reminder-icon">{{ getEventIcon(reminder.type) }}</span>
                  <span class="global-reminder-text">{{ reminder.content }}</span>
                  <button class="global-reminder-complete">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>

    <div class="cat-calendar-container">
      <div class="header">
        <h2>菠萝包日历提醒</h2>
        <div class="header-controls">
          <div class="view-switcher">
            <button
              @click="currentView = 'calendar'"
              :class="['btn-view', { active: currentView === 'calendar' }]"
            >
              📅 日历
            </button>
            <button
              @click="currentView = 'list'"
              :class="['btn-view', { active: currentView === 'list' }]"
            >
              📋 列表
            </button>
          </div>
          <button @click="showAddModal = true" class="btn-primary">添加提醒</button>
          <button @click="showSettingsModal = true" class="btn-secondary">周期设置</button>
        </div>
      </div>

      <!-- 今日提醒 -->
      <div class="today-reminders" v-if="todayReminders.length > 0">
        <h3>📅 今日提醒</h3>
        <div class="reminder-list">
          <div v-for="reminder in todayReminders" :key="reminder.id" class="reminder-item today">
            <span class="reminder-icon">{{ getEventIcon(reminder.type) }}</span>
            <span class="reminder-text">{{ reminder.content }}</span>
            <button @click="completeReminder(reminder)" class="btn-complete">完成</button>
          </div>
        </div>
      </div>

      <!-- 日历视图 -->
      <div class="calendar" v-show="currentView === 'calendar'">
        <div class="calendar-header">
          <button @click="prevMonth" class="btn-nav">&lt;</button>
          <h3>{{ currentYear }}年{{ currentMonth + 1 }}月</h3>
          <button @click="nextMonth" class="btn-nav">&gt;</button>
        </div>
        
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          
          <div class="calendar-days">
            <div 
              v-for="day in calendarDays" 
              :key="`${day.date}-${day.isCurrentMonth}`"
              :class="['calendar-day', {
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'has-reminders': day.reminders.length > 0
              }]"
              @click="selectDate(day)"
            >
              <span class="day-number">{{ day.day }}</span>
              <div class="day-reminders">
                <span 
                  v-for="reminder in day.reminders.slice(0, 3)" 
                  :key="reminder.id" 
                  class="reminder-dot"
                  :title="reminder.content"
                >{{ getEventIcon(reminder.type) }}</span>
                <span v-if="day.reminders.length > 3" class="more-indicator">+{{ day.reminders.length - 3 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div class="list-view" v-show="currentView === 'list'">
        <div class="list-header">
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索日期、内容或类型..."
              class="search-input"
            >
            <select v-model="filterType" class="filter-select">
              <option value="">全部类型</option>
              <option value="water">换水 💧</option>
              <option value="litter">清理猫砂盆 🧹</option>
              <option value="food">囤猫粮 🍽️</option>
              <option value="bath">洗澡 🛁</option>
              <option value="nail">剪指甲 ✂️</option>
              <option value="birthday">猫咪生日 🎂</option>
              <option value="medicine">喂药 💊</option>
              <option value="vet">看兽医 🏥</option>
              <option value="other">其他 📝</option>
            </select>
          </div>
          <div class="list-stats">
            共 {{ filteredReminderGroups.length }} 个记录日，{{ totalReminderCount }} 条提醒
          </div>
        </div>

        <div class="reminder-list-container">
          <div v-if="filteredReminderGroups.length === 0" class="no-results">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">
              {{ searchQuery || filterType ? '没有找到匹配的记录' : '暂无提醒记录' }}
            </div>
          </div>
          <div v-else class="reminder-groups">
            <template v-for="yearGroup in groupedByYear" :key="yearGroup.year">
              <div class="year-header">{{ yearGroup.year }}年</div>
              <div
                v-for="group in yearGroup.groups"
                :key="group.date"
                class="reminder-group"
              >
                <div class="reminder-group-header" @click="toggleGroup(group.date)">
                  <div class="group-date">
                    <span class="date-icon">📅</span>
                    <span class="date-text">{{ formatDisplayDate(group.date) }}</span>
                    <span v-if="isToday(group.date)" class="today-badge">今天</span>
                  </div>
                  <div class="group-icons">
                    <span
                      v-for="(icon, idx) in getUniqueIcons(group.reminders)"
                      :key="idx"
                      class="group-icon"
                    >{{ icon }}</span>
                  </div>
                  <div class="group-count">{{ group.reminders.length }} 条</div>
                  <span class="toggle-icon" :class="{ expanded: expandedGroups.includes(group.date) }">
                    ▼
                  </span>
                </div>
                <div
                  v-show="expandedGroups.includes(group.date)"
                  class="reminder-group-items"
                >
                  <div
                    v-for="reminder in group.reminders"
                    :key="reminder.id"
                    class="reminder-list-item"
                    @click="viewReminderDetail(reminder, group.date)"
                  >
                    <span class="reminder-item-icon">{{ getEventIcon(reminder.type) }}</span>
                    <div class="reminder-item-content">
                      <div class="reminder-item-text">{{ reminder.content }}</div>
                      <div class="reminder-item-type">{{ getEventTypeName(reminder.type) }}</div>
                    </div>
                    <div class="reminder-item-actions">
                      <button
                        @click.stop="completeReminder(reminder)"
                        class="btn-item-complete"
                        title="完成"
                      >✓</button>
                      <button
                        @click.stop="deleteReminder(reminder.id)"
                        class="btn-item-delete"
                        title="删除"
                      >×</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 添加提醒模态框 -->
      <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>添加提醒事项</h3>
            <button @click="closeModal" class="btn-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>事件类型：</label>
              <select v-model="newReminder.type">
                <option value="water">换水 💧</option>
                <option value="litter">清理猫砂盆 🧹</option>
                <option value="food">囤猫粮 🍽️</option>
                <option value="bath">洗澡 🛁</option>
                <option value="nail">剪指甲 ✂️</option>
                <option value="birthday">猫咪生日 🎂</option>
                <option value="medicine">喂药 💊</option>
                <option value="vet">看兽医 🏥</option>
                <option value="other">其他 📝</option>
              </select>
            </div>
            <div class="form-group">
              <label>提醒内容：</label>
              <input v-model="newReminder.content" type="text" placeholder="输入提醒内容">
            </div>
            <div class="form-group">
              <label>提醒日期：</label>
              <input v-model="newReminder.date" type="date">
            </div>
            <div class="form-group">
              <label>
                <input v-model="newReminder.isRecurring" type="checkbox">
                设置为周期性提醒
              </label>
            </div>
            <div v-if="newReminder.isRecurring" class="form-group">
              <label>重复间隔（天）：</label>
              <input v-model.number="newReminder.intervalDays" type="number" min="1" placeholder="例如：3">
            </div>
          </div>
          <div class="modal-footer">
            <button @click="addReminder" class="btn-primary" :disabled="loading">
              {{ loading ? '添加中...' : '添加' }}
            </button>
            <button @click="closeModal" class="btn-secondary">取消</button>
          </div>
        </div>
      </div>

      <!-- 周期设置模态框 -->
      <div v-if="showSettingsModal" class="modal-overlay" @click="closeSettingsModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>周期性提醒设置</h3>
            <button @click="closeSettingsModal" class="btn-close">&times;</button>
          </div>
          <div class="modal-body">
            <div v-for="(interval, type) in defaultIntervals" :key="type" class="form-group">
              <label>{{ getEventTypeName(type) }}：</label>
              <input v-model.number="defaultIntervals[type]" type="number" min="1"> 天
            </div>
          </div>
          <div class="modal-footer">
            <button @click="saveSettings" class="btn-primary" :disabled="loading">
              {{ loading ? '保存中...' : '保存' }}
            </button>
            <button @click="closeSettingsModal" class="btn-secondary">取消</button>
          </div>
        </div>
      </div>

      <!-- 日期详情模态框 -->
      <div v-if="showDateModal" class="modal-overlay" @click="closeDateModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedDateStr }} 的提醒</h3>
            <button @click="closeDateModal" class="btn-close">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="selectedDateReminders.length === 0" class="no-reminders">
              这一天没有提醒事项
            </div>
            <div v-else class="reminder-list">
              <div v-for="reminder in selectedDateReminders" :key="reminder.id" class="reminder-item">
                <span class="reminder-icon">{{ getEventIcon(reminder.type) }}</span>
                <span class="reminder-text">{{ reminder.content }}</span>
                <button @click="deleteReminder(reminder.id)" class="btn-delete">删除</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeDateModal" class="btn-secondary">关闭</button>
          </div>
        </div>
      </div>

      <!-- 加载提示 -->
      <div v-if="initialLoading" class="loading-overlay">
        <div class="loading-spinner">加载中...</div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// API 基础地址
// const apiBaseUrl = ref('http://localhost:8091/pet')
const apiBaseUrl = ref('https://api.blazing3service.site/pet')

// 日历相关
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 视图切换
const currentView = ref('calendar')

// 数据
const reminders = ref([])
const defaultIntervals = ref({
  water: 3,
  litter: 2,
  food: 7,
  bath: 30,
  nail: 14,
  medicine: 1
})

// 列表视图相关
const searchQuery = ref('')
const filterType = ref('')
const expandedGroups = ref([])

// 全局提醒状态
const showGlobalReminder = ref(true)
const isReminderExpanded = ref(false)

// 模态框状态
const showAddModal = ref(false)
const showSettingsModal = ref(false)
const showDateModal = ref(false)
const selectedDate = ref(null)

// 新提醒表单
const newReminder = ref({
  type: 'water',
  content: '',
  date: formatDate(new Date()),
  isRecurring: false,
  intervalDays: 3
})

// 加载状态
const loading = ref(false)
const initialLoading = ref(true)

// 计算属性
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dateStr = formatDate(date)
    const dayReminders = reminders.value.filter(r => r.date === dateStr)
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.value,
      isToday: isSameDay(date, today),
      reminders: dayReminders
    })
  }
  
  return days
})

const todayReminders = computed(() => {
  const today = formatDate(new Date())
  const filtered = reminders.value.filter(r => r.date === today)
  console.log('[CatReminder] Today:', today, 'Today reminders:', filtered.length, 'All reminders:', reminders.value.length)
  return filtered
})

// 是否显示全局提醒
const shouldShowGlobalReminder = computed(() => {
  const result = showGlobalReminder.value && todayReminders.value.length > 0
  console.log('[CatReminder] shouldShowGlobalReminder:', result, {
    showGlobalReminder: showGlobalReminder.value,
    todayRemindersCount: todayReminders.value.length
  })
  return result
})

const selectedDateStr = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value + 'T00:00:00')
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const selectedDateReminders = computed(() => {
  if (!selectedDate.value) return []
  return reminders.value.filter(r => r.date === selectedDate.value)
})

// 列表视图相关计算属性
const reminderGroups = computed(() => {
  const groups = {}
  reminders.value.forEach(reminder => {
    if (!groups[reminder.date]) {
      groups[reminder.date] = []
    }
    groups[reminder.date].push(reminder)
  })

  return Object.entries(groups)
    .map(([date, reminders]) => ({ date, reminders }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredReminderGroups = computed(() => {
  let groups = reminderGroups.value

  // 按类型筛选
  if (filterType.value) {
    groups = groups.map(group => ({
      ...group,
      reminders: group.reminders.filter(r => r.type === filterType.value)
    })).filter(group => group.reminders.length > 0)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    groups = groups.map(group => ({
      ...group,
      reminders: group.reminders.filter(r => {
        const contentMatch = r.content.toLowerCase().includes(query)
        const typeMatch = getEventTypeName(r.type).toLowerCase().includes(query)
        const dateMatch = group.date.includes(query)
        return contentMatch || typeMatch || dateMatch
      })
    })).filter(group => group.reminders.length > 0)
  }

  return groups
})

const totalReminderCount = computed(() => {
  return filteredReminderGroups.value.reduce((sum, group) => sum + group.reminders.length, 0)
})

// 按年份分组
const groupedByYear = computed(() => {
  const yearMap = {}

  filteredReminderGroups.value.forEach(group => {
    const year = new Date(group.date).getFullYear()
    if (!yearMap[year]) {
      yearMap[year] = []
    }
    yearMap[year].push(group)
  })

  return Object.entries(yearMap)
    .map(([year, groups]) => ({ year: parseInt(year), groups }))
    .sort((a, b) => b.year - a.year)
})

// 工具函数
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

// API 调用方法
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${apiBaseUrl.value}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || '操作失败')
    }
    
    return data
  } catch (error) {
    console.error('API 调用失败:', error)
    alert(error.message || '网络错误，请检查后端服务是否启动')
    throw error
  }
}

// 加载数据
async function loadData() {
  initialLoading.value = true
  try {
    // 加载提醒列表
    const remindersData = await apiCall('/reminders')
    reminders.value = remindersData.data || []
    console.log('[CatReminder] Data loaded:', reminders.value.length, 'reminders')

    // 加载周期设置
    const intervalsData = await apiCall('/intervals')
    defaultIntervals.value = intervalsData.data || defaultIntervals.value
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    initialLoading.value = false
  }
}

// 添加提醒
async function addReminder() {
  if (!newReminder.value.content || !newReminder.value.date) {
    alert('请填写完整信息')
    return
  }
  
  loading.value = true
  try {
    const data = await apiCall('/createReminder', {
      method: 'POST',
      body: JSON.stringify({
        type: newReminder.value.type,
        content: newReminder.value.content,
        date: newReminder.value.date,
        isRecurring: newReminder.value.isRecurring,
        intervalDays: newReminder.value.isRecurring 
          ? newReminder.value.intervalDays 
          : null
      })
    })
    
    reminders.value.push(data.data)
    closeModal()
  } catch (error) {
    // 错误已在 apiCall 中处理
  } finally {
    loading.value = false
  }
}

// 完成提醒
async function completeReminder(reminder) {
  loading.value = true
  try {
    const data = await apiCall(`/reminders/${reminder.id}/complete`, {
      method: 'POST'
    })
    
    // 删除当前提醒
    reminders.value = reminders.value.filter(r => r.id !== reminder.id)
    
    // 如果返回了新提醒（周期性提醒），添加到列表
    if (data.data) {
      reminders.value.push(data.data)
    }
  } catch (error) {
    // 错误已在 apiCall 中处理
  } finally {
    loading.value = false
  }
}

// 删除提醒
async function deleteReminder(id) {
  if (!confirm('确定要删除这条提醒吗？')) {
    return
  }
  
  loading.value = true
  try {
    await apiCall(`/deleteReminder/${id}`, {
      method: 'DELETE'
    })
    
    reminders.value = reminders.value.filter(r => r.id !== id)
    
    // 如果在详情模态框中删除，且没有其他提醒了，关闭模态框
    if (showDateModal.value && selectedDateReminders.value.length === 0) {
      closeDateModal()
    }
  } catch (error) {
    // 错误已在 apiCall 中处理
  } finally {
    loading.value = false
  }
}

// 保存周期设置
async function saveSettings() {
  loading.value = true
  try {
    const data = await apiCall('/interval', {
      method: 'PUT',
      body: JSON.stringify({
        intervals: defaultIntervals.value
      })
    })
    
    defaultIntervals.value = data.data
    closeSettingsModal()
  } catch (error) {
    // 错误已在 apiCall 中处理
  } finally {
    loading.value = false
  }
}

// 日历导航
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// 选择日期
function selectDate(day) {
  selectedDate.value = day.date
  showDateModal.value = true
}

// 图标和名称
function getEventIcon(type) {
  const icons = {
    water: '💧',
    litter: '🧹',
    food: '🍽️',
    bath: '🛁',
    nail: '✂️',
    birthday: '🎂',
    medicine: '💊',
    vet: '🏥',
    other: '📝'
  }
  return icons[type] || '📝'
}

function getEventTypeName(type) {
  const names = {
    water: '换水',
    litter: '清理猫砂盆',
    food: '囤猫粮',
    bath: '洗澡',
    nail: '剪指甲',
    medicine: '喂药',
    vet: '看兽医',
    birthday: '生日',
    other: '其他'
  }
  return names[type] || type
}

// 列表视图相关函数
function toggleGroup(date) {
  const index = expandedGroups.value.indexOf(date)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(date)
  }
}

function formatDisplayDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

function getUniqueIcons(reminders) {
  const icons = reminders.map(r => getEventIcon(r.type))
  return [...new Set(icons)]
}

function isToday(dateStr) {
  const today = formatDate(new Date())
  return dateStr === today
}

function viewReminderDetail(reminder, date) {
  selectedDate.value = date
  showDateModal.value = true
}

// 全局提醒相关方法
function toggleReminderExpand() {
  isReminderExpanded.value = !isReminderExpanded.value
}

// 忽略本次提醒（本次浏览期间不再显示）
function dismissGlobalReminder() {
  showGlobalReminder.value = false
}

// 关闭模态框
function closeModal() {
  showAddModal.value = false
  newReminder.value = {
    type: 'water',
    content: '',
    date: formatDate(new Date()),
    isRecurring: false,
    intervalDays: 3
  }
}

function closeSettingsModal() {
  showSettingsModal.value = false
}

function closeDateModal() {
  showDateModal.value = false
  selectedDate.value = null
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.cat-calendar-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.header h2 {
  margin: 0;
  font-size: 1.8em;
}

.header-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.view-switcher {
  display: flex;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px;
  align-items: stretch;
}

.btn-view {
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  color: white;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-height: 40px;
  height: auto;
}

.btn-view:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.btn-view.active {
  background-color: white;
  color: #667eea;
  font-weight: bold;
}

.btn-primary, .btn-secondary, .btn-nav, .btn-complete, .btn-delete, .btn-close {
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background-color: #1976D2;
}

.btn-nav {
  background-color: #f1f1f1;
  color: #333;
  padding: 5px 10px;
}

.btn-nav:hover {
  background-color: #ddd;
}

.btn-complete {
  background-color: #4CAF50;
  color: white;
  padding: 4px 8px;
  font-size: 0.8em;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  font-size: 0.8em;
}

.btn-close {
  background: none;
  color: #999;
  font-size: 1.5em;
  padding: 0;
  width: 30px;
  height: 30px;
}

.today-reminders {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.today-reminders h3 {
  margin: 0 0 10px 0;
  color: #856404;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #eee;
}

.reminder-item.today {
  border-color: #ffeaa7;
  background-color: #fffbf0;
}

.reminder-icon {
  font-size: 1.2em;
}

.reminder-text {
  flex: 1;
}

.calendar {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.calendar-header h3 {
  margin: 0;
  font-size: 1.4em;
  color: #333;
}

.calendar-grid {
  padding: 20px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 10px;
}

.weekday {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  color: #666;
  background-color: #f8f9fa;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #eee;
}

.calendar-day {
  min-height: 80px;
  padding: 8px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background-color: #f0f8ff;
}

.calendar-day.other-month {
  color: #ccc;
  background-color: #f9f9f9;
}

.calendar-day.today {
  background-color: #e3f2fd;
  border: 2px solid #2196F3;
}

.calendar-day.has-reminders {
  background-color: #fff8e1;
}

.day-number {
  font-weight: bold;
  margin-bottom: 4px;
}

.day-reminders {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  font-size: 0.8em;
}

.reminder-dot {
  display: inline-block;
  font-size: 0.9em;
}

.more-indicator {
  color: #666;
  font-size: 0.7em;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 12px;
  min-width: 400px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.no-reminders {
  text-align: center;
  color: #666;
  padding: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-spinner {
  font-size: 1.5em;
  color: #667eea;
  font-weight: bold;
}

/* 列表视图样式 */
.list-view {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.list-stats {
  font-size: 0.9em;
  color: #666;
  text-align: center;
}

.reminder-list-container {
  max-height: 600px;
  overflow-y: auto;
}

.no-results {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.no-results-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.no-results-text {
  font-size: 1.1em;
}

.reminder-groups {
  padding: 10px;
}

.year-header {
  padding: 12px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 1.1em;
  position: sticky;
  top: 0;
  z-index: 10;
}

.reminder-group {
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.reminder-group-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
}

.reminder-group-header:hover {
  background-color: #f0f0f0;
}

.group-date {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.date-icon {
  font-size: 1.2em;
}

.date-text {
  font-weight: bold;
  color: #333;
}

.today-badge {
  background-color: #4CAF50;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.group-icons {
  display: flex;
  gap: 3px;
  margin-left: auto;
  margin-right: 10px;
}

.group-icon {
  font-size: 0.9em;
}

.group-count {
  color: #666;
  font-size: 0.9em;
  margin-right: 10px;
}

.toggle-icon {
  transition: transform 0.2s ease;
  color: #999;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.reminder-group-items {
  padding: 5px 0;
  background-color: white;
}

.reminder-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-top: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reminder-list-item:first-child {
  border-top: none;
}

.reminder-list-item:hover {
  background-color: #f8f9fa;
}

.reminder-item-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.reminder-item-content {
  flex: 1;
  min-width: 0;
}

.reminder-item-text {
  font-size: 1em;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reminder-item-type {
  font-size: 0.85em;
  color: #999;
}

.reminder-item-actions {
  display: flex;
  gap: 5px;
}

.btn-item-complete,
.btn-item-delete {
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-item-complete {
  background-color: #4CAF50;
  color: white;
}

.btn-item-complete:hover {
  background-color: #45a049;
}

.btn-item-delete {
  background-color: #f44336;
  color: white;
}

.btn-item-delete:hover {
  background-color: #da190b;
}

@media (max-width: 768px) {
  .cat-calendar-container {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    gap: 15px;
  }

  .header-controls {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .view-switcher {
    flex: 0 1 auto;
    width: 100%;
    max-width: 300px;
  }

  .btn-view {
    flex: 1;
    padding: 10px 12px;
    font-size: 0.85em;
    min-height: 44px;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    min-width: 80px;
    white-space: nowrap;
  }

  .calendar-day {
    min-height: 60px;
    font-size: 0.9em;
  }

  .modal {
    min-width: 90%;
    margin: 20px;
  }

  /* 列表视图移动端样式 */
  .search-bar {
    flex-direction: column;
  }

  .list-header {
    padding: 15px;
  }

  .reminder-list-item {
    padding: 10px 12px;
  }

  .reminder-item-text {
    font-size: 0.95em;
  }
}

/* ========== 全局今日提醒浮层 ========== */
.global-reminder-container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}

.global-reminder-card {
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-radius: 16px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 4px 8px -2px rgba(0, 0, 0, 0.1),
    0 12px 24px -4px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-reminder-card.expanded {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 8px 16px -4px rgba(0, 0, 0, 0.12),
    0 24px 48px -8px rgba(0, 0, 0, 0.16);
}

/* 折叠状态 */
.reminder-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  transition: background-color 0.2s ease;
}

.reminder-compact-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
  padding: 4px;
  margin: -4px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.reminder-compact-left:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.reminder-compact-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reminder-icon-bell {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.reminder-compact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reminder-compact-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.2px;
}

.reminder-compact-count {
  font-size: 13px;
  color: #8e8e93;
}

.reminder-toggle-btn {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  color: #8e8e93;
}

.reminder-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.08);
}

.reminder-toggle-btn svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reminder-toggle-btn svg.rotated {
  transform: rotate(180deg);
}

.reminder-dismiss-btn {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  color: #8e8e93;
}

.reminder-dismiss-btn:hover {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
}

.reminder-dismiss-btn:active {
  transform: scale(0.95);
}

/* 展开内容 */
.reminder-expanded-content {
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
  background-color: rgba(255, 255, 255, 0.5);
}

.reminder-expanded-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.global-reminder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.global-reminder-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.01);
}

.global-reminder-item:active {
  transform: scale(0.98);
}

.global-reminder-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.global-reminder-text {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.global-reminder-complete {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #34C759 0%, #30B550 100%);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.global-reminder-complete:hover {
  transform: scale(1.05);
}

.global-reminder-complete:active {
  transform: scale(0.95);
}

/* 动画效果 */
.global-reminder-slide-enter-active,
.global-reminder-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-reminder-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.global-reminder-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.reminder-expand-enter-active,
.reminder-expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.reminder-expand-enter-from,
.reminder-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.reminder-expand-enter-to,
.reminder-expand-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .global-reminder-container {
    top: 12px;
    left: 12px;
    right: 12px;
    transform: none;
  }

  .global-reminder-card {
    max-width: none;
  }

  .global-reminder-slide-enter-from {
    transform: translateY(-20px);
  }

  .global-reminder-slide-leave-to {
    transform: translateY(-20px);
  }

  .reminder-compact {
    padding: 10px 14px;
  }

  .reminder-compact-title {
    font-size: 14px;
  }

  .reminder-compact-count {
    font-size: 12px;
  }

  .global-reminder-item {
    padding: 8px 10px;
  }

  .global-reminder-text {
    font-size: 13px;
  }
}
</style>