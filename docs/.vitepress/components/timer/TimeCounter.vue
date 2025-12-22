<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 定义 props
const props = defineProps({
  // 起始时间，支持多种格式
  startTime: {
    type: [String, Number, Date],
    required: true
  },
  // 显示的文字标签
  label: {
    type: String,
    default: '过去了'
  },
  // 时间单位文字（可选自定义，只显示设置了的单位）
  units: {
    type: Object,
    default: () => ({
      years: '年',
      months: '月',
      days: '天',
      hours: '小时',
      minutes: '分钟',
      seconds: '秒'
    })
  }
});

const timeElapsed = ref('');

// 解析起始时间
const startTimeValue = computed(() => {
  if (typeof props.startTime === 'number') {
    return props.startTime;
  }
  return new Date(props.startTime).getTime();
});

const updateTimer = () => {
  const now = new Date();
  const start = new Date(startTimeValue.value);
  
  // 计算年月日
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  
  // 如果天数为负，向月份借位
  if (days < 0) {
    months--;
    // 获取上个月的天数
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  // 如果月份为负，向年份借位
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // 计算当天的时分秒
  const nowTime = now.getTime();
  const startTime = start.getTime();
  let diffSeconds = Math.floor((nowTime - startTime) / 1000);
  
  // 只取当天剩余的秒数
  diffSeconds = diffSeconds % (24 * 3600);
  
  const hours = Math.floor(diffSeconds / 3600);
  diffSeconds %= 3600;
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;
  
  // 构建显示字符串（只显示 units 中定义的单位）
  const parts = [];
  
  // 按顺序检查每个单位是否在 props.units 中定义
  if ('years' in props.units && years > 0) {
    parts.push(`${years} ${props.units.years}`);
  }
  if ('months' in props.units && months > 0) {
    parts.push(`${months} ${props.units.months}`);
  }
  if ('days' in props.units && days > 0) {
    parts.push(`${days} ${props.units.days}`);
  }
  if ('hours' in props.units && hours > 0) {
    parts.push(`${hours} ${props.units.hours}`);
  }
  if ('minutes' in props.units && minutes > 0) {
    parts.push(`${minutes} ${props.units.minutes}`);
  }
  if ('seconds' in props.units) {
    parts.push(`${seconds} ${props.units.seconds}`);
  }
  
  timeElapsed.value = parts.join(' ');
};

let interval;

onMounted(() => {
  updateTimer();
  interval = setInterval(updateTimer, 1000);
});

onUnmounted(() => { 
  clearInterval(interval);
});
</script>

<template>
  <div>
    <p style="font-size: 1.2em; font-weight: bold;">{{ label }} {{ timeElapsed }}</p>
  </div>
</template>