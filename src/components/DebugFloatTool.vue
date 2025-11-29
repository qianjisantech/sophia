<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '../stores/device'

const deviceStore = useDeviceStore()

// 展开/收起状态
const isExpanded = ref(false)

// 拖动相关状态
const isDragging = ref(false)
const hasMoved = ref(false)
const position = ref({ x: 20, y: 100 })
const dragStart = ref({ x: 0, y: 0 })
const clickStart = ref({ x: 0, y: 0 })

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 开始拖动（鼠标）
const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  hasMoved.value = false
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  clickStart.value = {
    x: e.clientX,
    y: e.clientY
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 开始拖动（触摸）
const startTouchDrag = (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]
  isDragging.value = true
  hasMoved.value = false
  dragStart.value = {
    x: touch.clientX - position.value.x,
    y: touch.clientY - position.value.y
  }
  clickStart.value = {
    x: touch.clientX,
    y: touch.clientY
  }
  document.addEventListener('touchmove', onTouchDrag)
  document.addEventListener('touchend', stopTouchDrag)
}

// 边界限制函数
const constrainPosition = (x: number, y: number) => {
  const maxX = window.innerWidth - 100 // 预留100px宽度
  const maxY = window.innerHeight - 60 // 预留60px高度

  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY))
  }
}

// 拖动中（鼠标）
const onDrag = (e: MouseEvent) => {
  if (isDragging.value) {
    const dx = Math.abs(e.clientX - clickStart.value.x)
    const dy = Math.abs(e.clientY - clickStart.value.y)

    // 移动超过5px才算是拖动
    if (dx > 5 || dy > 5) {
      hasMoved.value = true
      const newX = e.clientX - dragStart.value.x
      const newY = e.clientY - dragStart.value.y
      position.value = constrainPosition(newX, newY)
    }
  }
}

// 拖动中（触摸）
const onTouchDrag = (e: TouchEvent) => {
  if (isDragging.value) {
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - clickStart.value.x)
    const dy = Math.abs(touch.clientY - clickStart.value.y)

    // 移动超过5px才算是拖动
    if (dx > 5 || dy > 5) {
      hasMoved.value = true
      const newX = touch.clientX - dragStart.value.x
      const newY = touch.clientY - dragStart.value.y
      position.value = constrainPosition(newX, newY)
    }
  }
}

// 停止拖动（鼠标）
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)

  // 如果没有移动，则触发展开/收起
  if (!hasMoved.value) {
    toggleExpand()
  } else {
    // 保存位置到localStorage
    localStorage.setItem('debugToolPosition', JSON.stringify(position.value))
  }

  hasMoved.value = false
}

// 停止拖动（触摸）
const stopTouchDrag = () => {
  isDragging.value = false
  document.removeEventListener('touchmove', onTouchDrag)
  document.removeEventListener('touchend', stopTouchDrag)

  // 如果没有移动，则触发展开/收起
  if (!hasMoved.value) {
    toggleExpand()
  } else {
    // 保存位置到localStorage
    localStorage.setItem('debugToolPosition', JSON.stringify(position.value))
  }

  hasMoved.value = false
}

// 重置位置
const resetPosition = () => {
  position.value = { x: 20, y: 100 }
  localStorage.setItem('debugToolPosition', JSON.stringify(position.value))
}

// 切换模式
const switchMode = (mode: 'auto' | 'web' | 'mobile') => {
  deviceStore.setMode(mode)
  // 刷新页面以应用新模式
  window.location.reload()
}

// 从localStorage恢复位置
onMounted(() => {
  const savedPosition = localStorage.getItem('debugToolPosition')
  if (savedPosition) {
    const saved = JSON.parse(savedPosition)
    // 确保恢复的位置在屏幕范围内
    position.value = constrainPosition(saved.x, saved.y)
  }
})

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onTouchDrag)
  document.removeEventListener('touchend', stopTouchDrag)
})
</script>

<template>
  <div
    class="debug-float-tool"
    :class="{ expanded: isExpanded, dragging: isDragging }"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <!-- 拖动手柄 -->
    <div
      class="drag-handle"
      @mousedown="startDrag"
      @touchstart="startTouchDrag"
    >
      <t-icon name="tools" />
      <span v-if="isExpanded" class="handle-text">DEBUG</span>
    </div>

    <!-- 展开的内容 -->
    <transition name="expand">
      <div v-if="isExpanded" class="tool-content">
        <div class="tool-header">
          <span class="tool-title">设备模式切换</span>
          <t-button
            size="small"
            variant="text"
            shape="square"
            class="reset-btn"
            @click="resetPosition"
            title="重置位置"
          >
            <t-icon name="refresh" size="14px" />
          </t-button>
        </div>

        <div class="mode-info">
          <div class="info-row">
            <span class="label">当前模式:</span>
            <t-tag
              :theme="deviceStore.mode === 'auto' ? 'primary' : deviceStore.mode === 'web' ? 'success' : 'warning'"
              size="small"
            >
              {{ deviceStore.mode === 'auto' ? '自动' : deviceStore.mode === 'web' ? 'Web' : 'H5' }}
            </t-tag>
          </div>
          <div class="info-row">
            <span class="label">检测设备:</span>
            <t-tag
              :theme="deviceStore.isMobile ? 'warning' : 'success'"
              size="small"
            >
              {{ deviceStore.isMobile ? '移动端' : '桌面端' }}
            </t-tag>
          </div>
        </div>

        <div class="mode-buttons">
          <t-button
            size="small"
            :variant="deviceStore.mode === 'auto' ? 'base' : 'outline'"
            block
            @click="switchMode('auto')"
          >
            <template #icon><t-icon name="refresh" /></template>
            自动检测
          </t-button>

          <t-button
            size="small"
            :variant="deviceStore.mode === 'web' ? 'base' : 'outline'"
            block
            @click="switchMode('web')"
          >
            <template #icon><t-icon name="desktop" /></template>
            强制 Web
          </t-button>

          <t-button
            size="small"
            :variant="deviceStore.mode === 'mobile' ? 'base' : 'outline'"
            block
            @click="switchMode('mobile')"
          >
            <template #icon><t-icon name="mobile" /></template>
            强制 H5
          </t-button>
        </div>

        <div class="tool-footer">
          <t-icon name="info-circle" size="12px" />
          <span>切换后将刷新页面</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.debug-float-tool {
  position: fixed;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.debug-float-tool.dragging {
  transition: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  transform: scale(1.02);
}

.drag-handle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: move;
  user-select: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0052D9 0%, #0034A6 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  touch-action: none; /* 禁用浏览器默认的触摸操作 */
  -webkit-touch-callout: none; /* 禁用iOS长按菜单 */
}

.drag-handle:hover {
  background: linear-gradient(135deg, #0066FF 0%, #0052D9 100%);
  transform: translateY(-1px);
}

.drag-handle:active {
  transform: translateY(0);
}

.drag-handle .t-icon {
  font-size: 18px;
}

.handle-text {
  font-size: 12px;
  letter-spacing: 1px;
}

.tool-content {
  padding: 16px;
  min-width: 220px;
}

.tool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.tool-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.reset-btn {
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  color: #666 !important;
  transition: all 0.2s !important;
}

.reset-btn:hover {
  color: #0052D9 !important;
  background: rgba(0, 82, 217, 0.06) !important;
  transform: rotate(180deg);
}

.mode-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(0, 82, 217, 0.04);
  border-radius: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.info-row .label {
  color: #666;
  font-weight: 500;
}

.mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.mode-buttons .t-button {
  justify-content: flex-start !important;
  font-size: 12px !important;
  height: 32px !important;
}

.tool-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 11px;
  color: #999;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scaleY(0.5);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: scaleY(1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .debug-float-tool {
    font-size: 12px;
  }

  .tool-content {
    min-width: 200px;
  }
}
</style>
