<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { useDevice } from '../composables/useDevice'

const { isMobile } = useDevice()
const router = useRouter()

// Sidebar状态在布局层级持久化
const sidebarVisible = ref(!isMobile.value)

// H5模式下完全不显示侧边栏
const shouldShowSidebar = computed(() => {
  return !isMobile.value
})

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
    <!-- 左侧菜单栏 - H5模式下完全不显示 -->
    <Sidebar
      v-if="shouldShowSidebar"
      v-model:visible="sidebarVisible"
      :sidebar-visible="sidebarVisible"
      @toggle-sidebar="sidebarVisible = !sidebarVisible"
    />

    <!-- 右侧内容区域 - 路由视图 -->
    <div class="layout-content">
      <router-view v-slot="{ Component, route }">
        <transition
          :name="isMobile ? 'slide-fade' : 'fade'"
          mode="out-in"
          :appear="!isMobile"
        >
          <keep-alive :include="isMobile ? ['HomeMobile', 'WikiView'] : []">
            <component
              :is="Component"
              :key="route.path"
              :sidebar-visible="sidebarVisible"
              @toggle-sidebar="sidebarVisible = !sidebarVisible"
              class="route-view"
            />
          </keep-alive>
        </transition>
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

/* H5模式路由过渡动画 - 优化性能 */
@media (max-width: 768px) {
  /* 确保路由视图容器有相对定位 */
  .layout-content {
    position: relative;
    overflow: hidden;
  }

  /* 滑动淡入淡出效果 - 优化动画时长提升性能 */
  .slide-fade-enter-active {
    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, opacity;
  }

  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(0.55, 0.06, 0.68, 0.19);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    will-change: transform, opacity;
  }

  .slide-fade-enter-active {
    position: relative;
    z-index: 2;
  }

  .slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }

  .slide-fade-enter-to,
  .slide-fade-leave-from {
    transform: translateX(0);
    opacity: 1;
  }

  /* 路由视图样式 */
  .route-view {
    width: 100%;
    min-height: 100%;
  }
}

/* 桌面端淡入淡出效果 */
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
