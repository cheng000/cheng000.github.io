<template>
  <div class="cat-reminder">
    <h2>菠萝包绝育手术提醒</h2>
    <p class="subtitle">给 <strong>{{ name }}</strong>（{{ age }}个月 · {{ weight }}斤 {{ breed }}）的小本本</p>

    <section>
      <h3>🏥 手术前（重点）</h3>
      <ul>
        <li>⏰ <strong>术前禁食禁水</strong>：一般 <strong>8小时禁食、4小时禁水</strong>（以医生要求为准）</li>
        <li>🧺 准备航空箱 / 猫包，垫好尿垫或旧毛巾</li>
        <li>😺 确认精神状态正常、无流鼻涕、无腹泻</li>
        <li>📞 保存好医院电话，方便术后咨询</li>
      </ul>
    </section>

    <section>
      <h3>💉 手术当天</h3>
      <ul>
        <li>🕰 按预约时间送达，避免长时间等待</li>
        <li>💬 主动询问：是否吸入麻醉 / 是否留院观察</li>
        <li>📄 记下医生交代的 <strong>用药与注意事项</strong></li>
      </ul>
    </section>

    <section>
      <h3>🏠 术后 1–3 天（非常重要）</h3>
      <ul>
        <li>🛌 保暖、安静，避免跳高和剧烈活动</li>
        <li>😿 麻醉未完全清醒前，可能会摇晃、嗜睡（属正常）</li>
        <li>🍗 完全清醒后再少量进食，避免暴饮暴食</li>
        <li>🧴 按医嘱 <strong>喂药 / 消炎 / 止痛</strong></li>
        <li>👕 戴好 <strong>伊丽莎白圈 / 手术服</strong>，防舔伤口</li>
      </ul>
    </section>

    <section>
      <h3>🔍 伤口观察</h3>
      <ul>
        <li>👀 每天查看 1–2 次</li>
        <li>⚠️ 若出现 <strong>红肿、渗血、异味、裂开</strong> → 及时就医</li>
      </ul>
    </section>

    <section>
      <h3>💖 长期变化</h3>
      <ul>
        <li>😽 性格可能更温和</li>
        <li>🍚 食欲可能增加，注意 <strong>控制体重</strong></li>
        <li>🩺 可考虑术后体检或疫苗计划调整</li>
      </ul>
    </section>

    <footer>
      <p class="wish">{{ name }} 手术顺利！早日跑酷！</p>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: '小狸花' },
  age: { type: Number, default: 8 },
  weight: { type: Number, default: 7 },
  breed: { type: String, default: '狸花猫' }
})
</script>

<style scoped>
.cat-reminder {
  background: linear-gradient(180deg, #fff7ec, #ffffff);
  border: 2px dashed #f4b183;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

h2 {
  margin-bottom: 0.2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 1rem;
}

section {
  margin-bottom: 1.2rem;
}

h3 {
  margin-bottom: 0.4rem;
}

ul {
  padding-left: 1.2rem;
}

li {
  margin-bottom: 0.4rem;
  line-height: 1.6;
}

footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #555;
}

.wish {
  font-weight: bold;
  color: #e67e22;
}
</style>
