<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  remember: false
})

const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  if (!formData.value.username) {
    MessagePlugin.warning('请输入用户名')
    return
  }
  if (!formData.value.password) {
    MessagePlugin.warning('请输入密码')
    return
  }

  loading.value = true

  // 模拟登录请求
  setTimeout(() => {
    // 这里可以添加真实的登录逻辑
    if (formData.value.username && formData.value.password) {
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', formData.value.username)

      MessagePlugin.success('登录成功')

      // 跳转到首页
      router.push('/home')
    } else {
      MessagePlugin.error('用户名或密码错误')
    }
    loading.value = false
  }, 800)
}

// 快速登录（演示用）
const quickLogin = () => {
  formData.value.username = 'demo'
  formData.value.password = '123456'
  handleLogin()
}
</script>

<template>
  <div class="login-page">
    <!-- 背景装饰元素 - 飞书风格 -->
    <div class="bg-decoration decoration-1"></div>
    <div class="bg-decoration decoration-2"></div>
    <div class="bg-decoration decoration-3"></div>
    <div class="bg-decoration decoration-4"></div>
    <div class="bg-decoration decoration-5"></div>

    <div class="login-container">
      <div class="login-left">
        <div class="brand-section">
          <Logo size="large" :showText="false" />
          <h1 class="brand-title">Sophia</h1>
          <p class="brand-subtitle">智能协作文档平台</p>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <t-icon name="file-text" size="24px" />
            <span>富文本编辑</span>
          </div>
          <div class="feature-item">
            <t-icon name="view-module" size="24px" />
            <span>在线表格</span>
          </div>
          <div class="feature-item">
            <t-icon name="chart-bubble" size="24px" />
            <span>思维导图</span>
          </div>
          <div class="feature-item">
            <t-icon name="usergroup" size="24px" />
            <span>实时协作</span>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="login-box">
          <div class="brand-section">
            <Logo size="large" :showText="false" />
            <h1 class="brand-title">Sophia</h1>
            <p class="brand-subtitle">智能协作文档平台</p>
          </div>

          <t-form
            :data="formData"
            :colon="false"
            label-width="0"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <t-form-item name="username">
              <t-input
                v-model="formData.username"
                size="large"
                placeholder="请输入用户名"
                clearable
              >
                <template #prefix-icon>
                  <t-icon name="user" />
                </template>
              </t-input>
            </t-form-item>

            <t-form-item name="password">
              <t-input
                v-model="formData.password"
                type="password"
                size="large"
                placeholder="请输入密码"
                clearable
                @keyup.enter="handleLogin"
              >
                <template #prefix-icon>
                  <t-icon name="lock-on" />
                </template>
              </t-input>
            </t-form-item>

            <t-form-item>
              <div class="form-footer">
                <t-checkbox v-model="formData.remember">记住我</t-checkbox>
                <t-link theme="primary" hover="color">忘记密码？</t-link>
              </div>
            </t-form-item>

            <t-form-item>
              <t-button
                theme="primary"
                size="large"
                block
                :loading="loading"
                @click="handleLogin"
              >
                登录
              </t-button>
            </t-form-item>

            <t-form-item>
              <t-button
                variant="outline"
                size="large"
                block
                @click="quickLogin"
              >
                快速登录（演示）
              </t-button>
            </t-form-item>
          </t-form>

          <div class="register-tip">
            还没有账号？<t-link theme="primary" hover="color">立即注册</t-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Apple & 飞书风格登录页面 - 带插画 */
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F5F7FA 0%, #FAFBFC 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 - 飞书风格的几何图形 */
/* 右上角大圆 */
.login-page::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, rgba(0, 122, 255, 0.02) 50%, transparent 70%);
  border-radius: 50%;
  animation: float-slow 30s infinite ease-in-out;
}

/* 左下角中圆 */
.login-page::after {
  content: '';
  position: absolute;
  bottom: -8%;
  left: -5%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(52, 199, 89, 0.06) 0%, rgba(52, 199, 89, 0.01) 50%, transparent 70%);
  border-radius: 50%;
  animation: float-slow 35s infinite ease-in-out reverse;
}

/* 动画 */
@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-15px, 15px) scale(1.05);
  }
}

@keyframes float-fast {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, -10px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

/* 飞书风格背景装饰图形 */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

/* 装饰1 - 右上角小圆 */
.decoration-1 {
  top: 15%;
  right: 12%;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.03) 100%);
  animation: float-fast 20s infinite ease-in-out;
}

/* 装饰2 - 左上角方形 */
.decoration-2 {
  top: 20%;
  left: 10%;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(255, 149, 0, 0.08) 0%, rgba(255, 149, 0, 0.02) 100%);
  border-radius: 20px;
  animation: float-fast 25s infinite ease-in-out;
  animation-delay: -5s;
}

/* 装饰3 - 右下角中圆 */
.decoration-3 {
  bottom: 15%;
  right: 15%;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, rgba(88, 86, 214, 0.08) 0%, rgba(88, 86, 214, 0.02) 100%);
  animation: pulse 15s infinite ease-in-out;
}

/* 装饰4 - 左下角小方块 */
.decoration-4 {
  bottom: 25%;
  left: 8%;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(255, 59, 48, 0.06) 0%, rgba(255, 59, 48, 0.01) 100%);
  border-radius: 15px;
  animation: float-fast 18s infinite ease-in-out;
  animation-delay: -8s;
}

/* 装饰5 - 中上方小圆 */
.decoration-5 {
  top: 10%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.08) 0%, rgba(52, 199, 89, 0.02) 100%);
  animation: pulse 20s infinite ease-in-out;
  animation-delay: -10s;
}

/* Apple 风格登录容器 - 居中卡片 */
.login-container {
  width: 440px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-xlarge);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* 隐藏左侧品牌区 - Apple 风格更简洁 */
.login-left {
  display: none;
}

/* Apple 风格登录区 */
.login-right {
  padding: 56px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.login-box {
  width: 100%;
}

/* Apple 风格品牌标题 */
.brand-section {
  text-align: center;
  margin-bottom: 32px;
}

.brand-section :deep(.logo-container) {
  margin: 0 auto 16px;
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -1px;
  color: var(--text-primary);
  font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.brand-subtitle {
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0;
  font-weight: 400;
}

.feature-list {
  display: none;
}

.feature-item {
  display: none;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.8px;
  text-align: center;
  font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 32px;
  text-align: center;
  font-weight: 400;
}

.login-form {
  margin-bottom: 24px;
}

.login-form :deep(.t-form__item) {
  margin-bottom: 20px;
}

/* Apple 风格输入框 */
.login-form :deep(.t-input) {
  border-radius: var(--radius-medium);
  border: 1px solid var(--border-color-1);
  background: var(--bg-white);
  transition: all var(--transition-fast);
  height: 44px;
}

.login-form :deep(.t-input:hover) {
  border-color: var(--text-tertiary);
}

.login-form :deep(.t-input:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.login-form :deep(.t-input__prefix) {
  color: var(--text-tertiary);
}

.login-form :deep(.t-input:focus .t-input__prefix) {
  color: var(--primary-color);
}

/* Apple 风格按钮 */
.login-form :deep(.t-button--primary) {
  height: 44px;
  border-radius: var(--radius-medium);
  background: var(--primary-color);
  border: none;
  box-shadow: var(--shadow-1);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  transition: all var(--transition-fast);
}

.login-form :deep(.t-button--primary:hover) {
  background: var(--primary-hover);
  box-shadow: var(--shadow-2);
}

.login-form :deep(.t-button--outline) {
  height: 44px;
  border-radius: var(--radius-medium);
  border: 1px solid var(--border-color-1);
  color: var(--text-primary);
  font-weight: 500;
  transition: all var(--transition-fast);
  background: var(--bg-white);
}

.login-form :deep(.t-button--outline:hover) {
  background: var(--bg-gray-1);
  border-color: var(--text-tertiary);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 4px 0;
}

.form-footer :deep(.t-checkbox) {
  color: var(--text-secondary);
  font-size: 13px;
}

.form-footer :deep(.t-link) {
  font-weight: 500;
  font-size: 13px;
}

.register-tip {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  padding-top: 24px;
  border-top: 1px solid var(--border-color-2);
  margin-top: 8px;
}

.register-tip :deep(.t-link) {
  margin-left: 4px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    width: 90%;
    margin: 20px;
  }

  .login-right {
    padding: 40px 32px;
  }

  .brand-title {
    font-size: 28px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
