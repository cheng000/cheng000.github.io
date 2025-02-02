<!-- cheng000.github.io/docs/.vitepress/components/encrypt/EncryptedContent.vue -->
<template>
  <div :class="{'encrypted-content': !unlocked, 'unlocked-content': unlocked}">
    <div v-if="unlocked" class="content">
      <slot />
    </div>
    <div v-else class="unlock-form">
      <h2>文章已加密</h2>
      <p>请输入密码查看内容：</p>
      <div class="form-group">
        <input
          v-model="password"
          type="password"
          placeholder="输入密码"
          class="password-input"
        />
        <button @click="checkPassword" class="submit-button">提交</button>
      </div>
      <p v-if="error" class="error-message">密码错误，请重试。</p>
    </div>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';

export default {
  data() {
    return {
      password: '',
      unlocked: false,
      error: false,
      storedHash: '$2a$10$MXQ5N2g4yTkRLvyXjo/dre1qxTgc/i2gi1eVEon.M91pSsFCRrh/m', // 将生成的哈希值放在这里
    };
  },
  methods: {
    checkPassword() {
      bcrypt.compare(this.password, this.storedHash, (err, result) => {
        if (result) {
          this.unlocked = true;
          this.error = false;
        } else {
          this.error = true;
        }
      });
    }
  }
};
</script>

<style scoped>
.encrypted-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.unlocked-content {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

.unlock-form {
  text-align: center;
}

.unlock-form h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #2c3e50;
}

.unlock-form p {
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.password-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}

.content {
  font-size: 16px;
  color: #333;
}
</style>
