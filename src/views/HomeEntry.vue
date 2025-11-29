<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useDeviceStore } from '../stores/device'
import { useMenuStore } from '../stores/menu'

const deviceStore = useDeviceStore()
const menuStore = useMenuStore()
const route = useRoute()

// 初始化设备检测
onMounted(() => {
  deviceStore.init()

  // 根据路由设置活动菜单
  if (route.path === '/cloud') {
    menuStore.setActiveMenu('cloud')
  } else if (route.path === '/rbac') {
    menuStore.setActiveMenu('permission')
  } else if (route.path === '/trash') {
    menuStore.setActiveMenu('trash')
  } else if (route.path === '/home' || route.path === '/') {
    menuStore.setActiveMenu('home')
  }
})

// 动态加载对应的组件
const HomeWeb = defineAsyncComponent(() => import('./web/HomeWeb.vue'))
const HomeMobile = defineAsyncComponent(() => import('./mobile/HomeMobile.vue'))

// 根据设备类型选择组件
const CurrentComponent = computed(() => {
  return deviceStore.isMobile ? HomeMobile : HomeWeb
})
</script>

<template>
  <component :is="CurrentComponent" />
</template>

<style scoped>
/* 入口组件不需要额外样式 */
</style>
