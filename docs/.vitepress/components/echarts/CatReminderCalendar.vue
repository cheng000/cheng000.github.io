<template>
  <div class="cat-calendar-container">
    <div class="header">
      <h2>🐱 猫咪日历提醒</h2>
      <div class="header-controls">
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

    <!-- 日历 -->
    <div class="calendar">
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
            <input v-model="newReminder.intervalDays" type="number" min="1" placeholder="例如：3">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="addReminder" class="btn-primary">添加</button>
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
            <input v-model="defaultIntervals[type]" type="number" min="1"> 天
          </div>
        </div>
        <div class="modal-footer">
          <button @click="saveSettings" class="btn-primary">保存</button>
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
  </div>
</template>

<script>
export default {
  name: 'CatCalendarReminder',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      reminders: [],
      showAddModal: false,
      showSettingsModal: false,
      showDateModal: false,
      selectedDate: null,
      newReminder: {
        type: 'water',
        content: '',
        date: '',
        isRecurring: false,
        intervalDays: 3
      },
      defaultIntervals: {
        water: 3,
        litter: 2,
        food: 7,
        bath: 30,
        nail: 14,
        medicine: 1
      }
    }
  },
  computed: {
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dateStr = this.formatDate(date);
        const dayReminders = this.reminders.filter(r => r.date === dateStr);
        
        days.push({
          date: dateStr,
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === this.currentMonth,
          isToday: this.isSameDay(date, today),
          reminders: dayReminders
        });
      }
      
      return days;
    },
    todayReminders() {
      const today = this.formatDate(new Date());
      return this.reminders.filter(r => r.date === today);
    },
    selectedDateStr() {
      if (!this.selectedDate) return '';
      const date = new Date(this.selectedDate + 'T00:00:00');
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    },
    selectedDateReminders() {
      if (!this.selectedDate) return [];
      return this.reminders.filter(r => r.date === this.selectedDate);
    }
  },
  mounted() {
    this.loadData();
    this.newReminder.date = this.formatDate(new Date());
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    selectDate(day) {
      this.selectedDate = day.date;
      this.showDateModal = true;
    },
    addReminder() {
      if (!this.newReminder.content || !this.newReminder.date) {
        alert('请填写完整信息');
        return;
      }
      
      const reminder = {
        id: Date.now(),
        type: this.newReminder.type,
        content: this.newReminder.content,
        date: this.newReminder.date,
        isRecurring: this.newReminder.isRecurring,
        intervalDays: this.newReminder.intervalDays || this.defaultIntervals[this.newReminder.type]
      };
      
      this.reminders.push(reminder);
      this.saveData();
      this.closeModal();
    },
    completeReminder(reminder) {
      if (reminder.isRecurring) {
        // 如果是周期性提醒，创建下次提醒
        const currentDate = new Date(reminder.date + 'T00:00:00');
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + reminder.intervalDays);
        
        const nextReminder = {
          ...reminder,
          id: Date.now(),
          date: this.formatDate(nextDate)
        };
        
        this.reminders.push(nextReminder);
      }
      
      // 删除当前提醒
      this.deleteReminder(reminder.id);
    },
    deleteReminder(id) {
      this.reminders = this.reminders.filter(r => r.id !== id);
      this.saveData();
    },
    getEventIcon(type) {
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
      };
      return icons[type] || '📝';
    },
    getEventTypeName(type) {
      const names = {
        water: '换水',
        litter: '清理猫砂盆',
        food: '囤猫粮',
        bath: '洗澡',
        nail: '剪指甲',
        medicine: '喂药'
      };
      return names[type] || type;
    },
    closeModal() {
      this.showAddModal = false;
      this.newReminder = {
        type: 'water',
        content: '',
        date: this.formatDate(new Date()),
        isRecurring: false,
        intervalDays: 3
      };
    },
    closeSettingsModal() {
      this.showSettingsModal = false;
    },
    closeDateModal() {
      this.showDateModal = false;
      this.selectedDate = null;
    },
    saveSettings() {
      this.saveData();
      this.closeSettingsModal();
    },
    loadData() {
      try {
        const data = localStorage.getItem('catCalendarData');
        if (data) {
          const parsed = JSON.parse(data);
          this.reminders = parsed.reminders || [];
          this.defaultIntervals = { ...this.defaultIntervals, ...parsed.defaultIntervals };
        }
      } catch (e) {
        console.error('加载数据失败:', e);
      }
    },
    saveData() {
      try {
        const data = {
          reminders: this.reminders,
          defaultIntervals: this.defaultIntervals
        };
        localStorage.setItem('catCalendarData', JSON.stringify(data));
      } catch (e) {
        console.error('保存数据失败:', e);
      }
    }
  }
}
</script>

<style scoped>
.cat-calendar-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
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

.btn-primary:hover {
  background-color: #45a049;
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

@media (max-width: 768px) {
  .cat-calendar-container {
    padding: 10px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
  }
  
  .calendar-day {
    min-height: 60px;
    font-size: 0.9em;
  }
  
  .modal {
    min-width: 90%;
    margin: 20px;
  }
}
</style>