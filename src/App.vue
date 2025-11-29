<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useDeviceStore } from './stores/device'
import DebugFloatTool from './components/DebugFloatTool.vue'

const deviceStore = useDeviceStore()
const route = useRoute()

// 初始化设备检测
onMounted(() => {
  deviceStore.init()
})
</script>

<template>
  <div id="app">
    <!-- 浮动Debug工具 -->
    <DebugFloatTool />

    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 全局路由过渡动画 */
.fade-enter-active {
  transition: opacity 0.2s ease;
}

.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
