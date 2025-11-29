<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  onRefresh: () => Promise<void>
  disabled?: boolean
}>()

// 下拉状态
const isPulling = ref(false)
const isRefreshing = ref(false)
const pullDistance = ref(0)
const startY = ref(0)
const containerRef = ref<HTMLElement | null>(null)

// 触发刷新的阈值（像素）
const TRIGGER_THRESHOLD = 80
// 最大下拉距离
const MAX_PULL_DISTANCE = 120

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  if (isRefreshing.value || props.disabled) return

  const scrollTop = containerRef.value?.scrollTop || 0
  // 只有在顶部时才允许下拉
  if (scrollTop <= 0) {
    startY.value = e.touches[0].clientY
    isPulling.value = true
  }
}

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!isPulling.value || isRefreshing.value) return

  const currentY = e.touches[0].clientY
  const distance = currentY - startY.value

  // 只处理向下拉的情况
  if (distance > 0) {
    // 阻止页面滚动
    e.preventDefault()

    // 计算实际的下拉距离（使用阻尼效果）
    const dampingFactor = 0.5
    pullDistance.value = Math.min(distance * dampingFactor, MAX_PULL_DISTANCE)
  }
}

// 触摸结束
const handleTouchEnd = async () => {
  if (!isPulling.value || isRefreshing.value) return

  isPulling.value = false

  // 如果下拉距离超过阈值，触发刷新
  if (pullDistance.value >= TRIGGER_THRESHOLD) {
    isRefreshing.value = true
    pullDistance.value = TRIGGER_THRESHOLD // 保持在刷新位置

    try {
      await props.onRefresh()
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      // 延迟收回，让用户看到刷新完成的状态
      setTimeout(() => {
        isRefreshing.value = false
        pullDistance.value = 0
      }, 300)
    }
  } else {
    // 没有超过阈值，回弹
    pullDistance.value = 0
  }
}

// 获取状态文本
const getStatusText = () => {
  if (isRefreshing.value) return '正在刷新...'
  if (pullDistance.value >= TRIGGER_THRESHOLD) return '释放即可刷新'
  if (pullDistance.value > 0) return '下拉刷新'
  return ''
}

// 获取状态图标旋转角度
const getIconRotation = () => {
  if (isRefreshing.value) return 0
  return (pullDistance.value / TRIGGER_THRESHOLD) * 180
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)
  }
})

onUnmounted(() => {
  const container = containerRef.value
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<template>
  <div ref="containerRef" class="pull-to-refresh">
    <!-- 下拉指示器 -->
    <div
      class="pull-indicator"
      :style="{ height: pullDistance + 'px' }"
    >
      <div class="indicator-content">
        <div
          class="indicator-icon"
          :class="{ spinning: isRefreshing }"
          :style="{ transform: `rotate(${getIconRotation()}deg)` }"
        >
          <t-icon :name="isRefreshing ? 'loading' : 'refresh'" />
        </div>
        <span class="indicator-text">{{ getStatusText() }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div
      class="pull-content"
      :style="{ transform: `translateY(${pullDistance}px)` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.pull-to-refresh {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.pull-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), transparent);
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.indicator-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: #666;
  font-size: 14px;
}

.indicator-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-icon.spinning {
  animation: spin 1s linear infinite;
}

.indicator-icon :deep(.t-icon) {
  font-size: 20px;
  color: #0052D9;
}

.indicator-text {
  font-weight: 500;
  white-space: nowrap;
}

.pull-content {
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
