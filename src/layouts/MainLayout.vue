<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { useDevice } from '../composables/useDevice'

const { isMobile } = useDevice()
const router = useRouter()

// Sidebar状态在布局层级持久化
const sidebarVisible = ref(!isMobile.value)

// 提供给子组件使用
defineExpose({
  sidebarVisible,
  toggleSidebar: () => {
    sidebarVisible.value = !sidebarVisible.value
  }
})
</script>

<template>
  <div class="main-layout" :class="{ 'sidebar-collapsed': !sidebarVisible }">
    <!-- 左侧菜单栏 - 在所有路由间持久化 -->
    <Sidebar
      v-model:visible="sidebarVisible"
      :sidebar-visible="sidebarVisible"
      @toggle-sidebar="sidebarVisible = !sidebarVisible"
    />

    <!-- 右侧内容区域 - 路由视图 -->
    <div class="layout-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" :sidebar-visible="sidebarVisible" @toggle-sidebar="sidebarVisible = !sidebarVisible" />
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar-collapsed .layout-content {
  margin-left: 0;
}

/* 移动端不需要margin */
@media (max-width: 768px) {
  .layout-content {
    margin-left: 0 !important;
  }
}
</style>
