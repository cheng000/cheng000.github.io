        <script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 指定起始时间（请修改为你的起始时间）
const startTime = new Date('2025-02-2T11:09:00').getTime();

const timeElapsed = ref('');

const updateTimer = () => {
  const now = new Date().getTime();
  let diff = Math.floor((now - startTime) / 1000); // 计算秒数差

  const days = Math.floor(diff / (24 * 3600));
  diff %= 24 * 3600;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  timeElapsed.value = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
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
    <p style="font-size: 1.2em; font-weight: bold;">👨 ❤️ 👩 {{ timeElapsed }}</p>
  </div>
</template>
