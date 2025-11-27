<template>
  <div class="sophia-logo" :class="{ small: size === 'small', large: size === 'large' }">
    <svg viewBox="0 0 48 48" class="logo-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sophiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0052D9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1677FF;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
        </filter>
      </defs>

      <!-- 背景圆角矩形 -->
      <rect x="2" y="2" width="44" height="44" rx="12" ry="12"
            fill="url(#sophiaGradient)" filter="url(#shadow)"/>

      <!-- S 字母 - 现代设计 -->
      <path d="M 15 16
               Q 15 12, 19 12
               L 29 12
               Q 33 12, 33 16
               Q 33 18, 31 19
               L 20 24
               Q 15 26, 15 30
               Q 15 36, 21 36
               L 29 36
               Q 33 36, 33 32"
            stroke="white"
            stroke-width="3.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"/>

      <!-- 装饰点 -->
      <circle cx="38" cy="14" r="2.5" fill="white" opacity="0.8"/>
      <circle cx="10" cy="34" r="2" fill="white" opacity="0.6"/>
    </svg>
    <span v-if="showText" class="logo-text">Sophia</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  showText: true
})
</script>

<style scoped>
.sophia-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-svg {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Small size */
.sophia-logo.small .logo-svg {
  width: 24px;
  height: 24px;
}

.sophia-logo.small .logo-text {
  font-size: 14px;
}

/* Large size */
.sophia-logo.large .logo-svg {
  width: 48px;
  height: 48px;
}

.sophia-logo.large .logo-text {
  font-size: 24px;
}

/* Hover effect */
.sophia-logo:hover .logo-svg {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.sophia-logo:hover .logo-text {
  background: linear-gradient(135deg, #1677FF 0%, #0052D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
