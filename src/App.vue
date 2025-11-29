<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useDeviceStore } from './stores/device'
import DebugFloatTool from './components/DebugFloatTool.vue'

const deviceStore = useDeviceStore()

// 初始化设备检测
onMounted(() => {
  deviceStore.init()
})
</script>

<template>
  <div id="app">
    <!-- 浮动Debug工具 -->
    <DebugFloatTool />

    <RouterView />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
