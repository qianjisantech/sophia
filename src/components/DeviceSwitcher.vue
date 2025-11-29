<script setup lang="ts">
import { computed, h } from 'vue'
import { useDeviceStore } from '../stores/device'

const deviceStore = useDeviceStore()

const modeLabels = {
  auto: '自动',
  web: 'Web',
  mobile: 'H5'
}

const modeIcons = {
  auto: 'refresh',
  web: 'desktop',
  mobile: 'mobile'
}

const currentModeLabel = computed(() => modeLabels[deviceStore.mode])
const currentModeIcon = computed(() => modeIcons[deviceStore.mode])

const switchMode = (mode: 'auto' | 'web' | 'mobile') => {
  deviceStore.setMode(mode)
  // 刷新页面以应用新模式
  window.location.reload()
}
</script>

<template>
  <div class="device-switcher">
    <t-dropdown
      :options="[
        { content: '自动检测', value: 'auto', prefixIcon: () => h('t-icon', { name: 'refresh' }) },
        { content: 'Web 模式', value: 'web', prefixIcon: () => h('t-icon', { name: 'desktop' }) },
        { content: 'H5 模式', value: 'mobile', prefixIcon: () => h('t-icon', { name: 'mobile' }) }
      ]"
      @click="(data: any) => switchMode(data.value)"
      trigger="hover"
    >
      <t-button variant="outline" class="device-switch-btn">
        <template #icon>
          <t-icon :name="currentModeIcon" />
        </template>
        {{ currentModeLabel }}
        <template #suffix>
          <t-icon name="chevron-down" size="16px" />
        </template>
      </t-button>
    </t-dropdown>

    <div class="device-info">
      <span class="device-badge" :class="`device-${deviceStore.currentDeviceType}`">
        {{ deviceStore.isMobile ? 'H5' : 'Web' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.device-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-switch-btn {
  border-radius: 8px !important;
  font-weight: 500 !important;
  height: 36px !important;
  padding: 0 14px !important;
  transition: all 0.2s !important;
}

.device-switch-btn:hover {
  background: rgba(0, 82, 217, 0.06) !important;
  border-color: var(--primary-color) !important;
}

.device-info {
  display: flex;
  align-items: center;
}

.device-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.device-badge.device-desktop {
  background: rgba(0, 168, 112, 0.1);
  color: #00A870;
}

.device-badge.device-mobile {
  background: rgba(0, 82, 217, 0.1);
  color: #0052D9;
}

/* 移动端隐藏切换器 */
@media (max-width: 768px) {
  .device-switcher {
    display: none;
  }
}
</style>
