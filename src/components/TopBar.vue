<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin, Icon } from 'tdesign-vue-next'

const props = defineProps<{
  sidebarVisible?: boolean
  searchPlaceholder?: string
  searchResults?: any[]
  showCreateButton?: boolean
  pageTitle?: string
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
  'search-focus': []
  'search-blur': []
  'search-update': [value: string]
  'result-click': [item: any]
}>()

const router = useRouter()
const searchKeyword = ref('')
const showSearchPanel = ref(false)
const searchExpanded = ref(false)

// 用户信息
const username = computed(() => localStorage.getItem('username') || '用户')

// 搜索框展开/收起
const toggleSearchExpanded = () => {
  searchExpanded.value = !searchExpanded.value
  if (searchExpanded.value) {
    // 展开后自动聚焦
    setTimeout(() => {
      const input = document.querySelector('.search-bar input') as HTMLInputElement
      input?.focus()
    }, 100)
  } else {
    // 收起时清空搜索关键词和面板
    searchKeyword.value = ''
    showSearchPanel.value = false
  }
}

// 搜索面板控制
const handleSearchFocus = () => {
  showSearchPanel.value = true
  emit('search-focus')
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchPanel.value = false
    emit('search-blur')
    // 如果输入框为空，则收起搜索框
    if (!searchKeyword.value.trim()) {
      searchExpanded.value = false
    }
  }, 200)
}

const handleSearchUpdate = (value: string) => {
  searchKeyword.value = value
  emit('search-update', value)
}

const handleResultClick = (item: any) => {
  emit('result-click', item)
  showSearchPanel.value = false
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  MessagePlugin.success('已退出登录')
  router.push('/login')
}

// 基本设置
const handleSettingsClick = () => {
  MessagePlugin.info('基本设置功能开发中...')
}

// 用户下拉菜单
const handleUserMenuClick = (data: any) => {
  const action = typeof data === 'string' ? data : data.value
  switch (action) {
    case 'profile':
      MessagePlugin.info('个人中心功能开发中...')
      break
    case 'settings':
      handleSettingsClick()
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 新建菜单选项
const createMenuOptions = [
  { content: '文档', value: 'document', prefixIcon: () => h(Icon, { name: 'file-text' }) },
  { content: '表格', value: 'spreadsheet', prefixIcon: () => h(Icon, { name: 'table' }) },
  { content: '思维导图', value: 'mindmap', prefixIcon: () => h(Icon, { name: 'chart-bubble' }) },
  { content: '幻灯片', value: 'slide', prefixIcon: () => h(Icon, { name: 'play-circle' }) },
  { content: '流程图', value: 'flowchart', prefixIcon: () => h(Icon, { name: 'chart-pie' }) },
  { content: '白板', value: 'whiteboard', prefixIcon: () => h(Icon, { name: 'edit' }) },
  { content: '文件夹', value: 'folder', prefixIcon: () => h(Icon, { name: 'folder' }) }
]

// 新建菜单点击处理
const handleCreateMenuClick = (data: any) => {
  const type = typeof data === 'string' ? data : data.value

  const typeNames: Record<string, string> = {
    folder: '文件夹',
    document: '文档',
    spreadsheet: '表格',
    slide: '幻灯片',
    flowchart: '流程图',
    mindmap: '思维导图',
    whiteboard: '白板'
  }

  MessagePlugin.info(`${typeNames[type]}功能开发中...`)
}
</script>

<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <!-- 折叠按钮 -->
      <t-button
        v-if="!props.sidebarVisible"
        variant="text"
        shape="square"
        class="menu-toggle-btn"
        @click="toggleSidebar"
      >
        <t-icon name="menu-unfold" />
      </t-button>

      <!-- 页面标题 -->
      <h2 v-if="props.pageTitle" class="page-title-topbar">{{ props.pageTitle }}</h2>
    </div>

    <div class="top-bar-center">
    </div>

    <div class="top-bar-right">
      <!-- 搜索框 -->
      <div class="search-bar">
        <!-- 搜索 icon 按钮 -->
        <t-button
          variant="text"
          shape="square"
          class="search-icon-btn icon-button"
          @click="toggleSearchExpanded"
        >
          <t-icon name="search" />
        </t-button>

        <!-- 搜索输入框 - 绝对定位，从右往左展开 -->
        <div v-if="searchExpanded" class="search-input-wrapper">
          <t-input
            :model-value="searchKeyword"
            :placeholder="props.searchPlaceholder || '搜索...'"
            clearable
            size="large"
            @update:model-value="handleSearchUpdate"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
          >
            <template #prefix-icon>
              <t-icon name="search" />
            </template>
            <template #suffix>
              <span class="keyboard-hint">⌘K</span>
            </template>
          </t-input>

          <!-- 搜索面板遮罩 -->
          <div v-if="showSearchPanel" class="search-overlay" @click="showSearchPanel = false"></div>

          <!-- 搜索面板弹窗 -->
          <div v-if="showSearchPanel && props.searchResults" class="search-panel" @mousedown.prevent>
            <div class="search-panel-section">
              <div class="search-section-title">
                <slot name="search-title">
                  {{ searchKeyword.trim() ? `搜索结果 (${props.searchResults.length})` : '最近访问' }}
                </slot>
              </div>
              <div class="search-results">
                <div
                  v-for="item in props.searchResults.slice(0, 8)"
                  :key="item.id"
                  class="search-result-item"
                  @click="handleResultClick(item)"
                >
                  <slot name="search-result-item" :item="item">
                    <div class="result-icon">
                      <t-icon name="file-text" />
                    </div>
                    <div class="result-content">
                      <div class="result-title">{{ item.title }}</div>
                      <div class="result-meta">
                        <span>{{ item.folder }}</span>
                      </div>
                    </div>
                    <div class="result-action">
                      <t-icon name="chevron-right" />
                    </div>
                  </slot>
                </div>

                <div v-if="props.searchResults.length === 0" class="search-empty">
                  <t-icon name="search" size="32px" />
                  <p>{{ searchKeyword.trim() ? '没有找到相关内容' : '暂无内容' }}</p>
                </div>
              </div>
            </div>

            <div class="search-panel-footer">
              <div class="search-tips">
                <span><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
                <span><kbd>Enter</kbd> 打开</span>
                <span><kbd>Esc</kbd> 关闭</span>
              </div>
            </div>
          </div>
      </div>

      <t-button variant="text" shape="square" class="icon-button">
        <t-icon name="notification" />
      </t-button>

      <t-button variant="text" shape="square" class="icon-button">
        <t-icon name="help-circle" />
      </t-button>

      <div class="divider-vertical"></div>

      <!-- 新建下拉菜单 -->
      <t-dropdown
        v-if="props.showCreateButton !== false"
        :options="createMenuOptions"
        @click="handleCreateMenuClick"
        trigger="hover"
      >
        <t-button theme="primary" class="create-btn">
          <template #icon><t-icon name="add" /></template>
          新建
          <template #suffix><t-icon name="chevron-down" size="16px" /></template>
        </t-button>
      </t-dropdown>

      <div class="divider-vertical"></div>

      <!-- 用户信息 -->
      <t-dropdown
        :options="[
          { content: '个人中心', value: 'profile', prefixIcon: () => h(Icon, { name: 'user' }) },
          { content: '个人设置', value: 'settings', prefixIcon: () => h(Icon, { name: 'setting' }) },
          { content: '退出登录', value: 'logout', theme: 'error', prefixIcon: () => h(Icon, { name: 'logout' }) }
        ]"
        @click="handleUserMenuClick"
      >
        <div class="user-info-trigger">
          <t-avatar size="36px" class="user-avatar">{{ username.charAt(0).toUpperCase() }}</t-avatar>
          <div class="user-info-text">
            <span class="username">{{ username }}</span>
            <span class="user-role">管理员</span>
          </div>
          <t-icon name="chevron-down" size="16px" class="dropdown-icon" />
        </div>
      </t-dropdown>
    </div>
    </div></div>
</template>

<style scoped>
/* 顶部栏样式 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #ffffff;
  position: relative;
  z-index: 100;
  overflow: visible;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.top-bar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.menu-toggle-btn {
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
}

.page-title-topbar {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding: 0 16px;
  white-space: nowrap;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon-btn {
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
  transition: all 0.2s ease !important;
  position: relative;
  z-index: 1001;
}

.search-input-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  width: 600px;
  z-index: 1000;
  animation: search-expand 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: right center;
}

@keyframes search-expand {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.search-input-wrapper :deep(.t-input) {
  background: var(--bg-white);
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input-wrapper :deep(.t-input:focus .t-input__prefix) {
  color: var(--primary-color);
}

.keyboard-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 3px 7px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  font-weight: 600;
  font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  letter-spacing: 0.5px;
}

/* 搜索面板遮罩 */
.search-input-wrapper .search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
  animation: overlay-appear 0.2s ease;
}

@keyframes overlay-appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 搜索面板弹窗样式 - Apple/Vercel 风格 */
.search-input-wrapper .search-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
              0 4px 6px rgba(0, 0, 0, 0.05),
              0 12px 24px rgba(0, 0, 0, 0.08),
              0 24px 48px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 10001;
  animation: search-panel-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes search-panel-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.search-panel-section {
  padding: 8px;
}

.search-section-title {
  padding: 8px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  color: #000;
}

.search-result-item:hover {
  background: rgba(0, 0, 0, 0.06);
  transform: translateX(2px);
}

.result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
}

.search-result-item:hover .result-icon {
  background: rgba(0, 0, 0, 0.08);
}

.result-icon .t-icon {
  font-size: 18px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 13px;
  font-weight: 500;
  color: #000;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.result-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-dot {
  opacity: 0.5;
}

.result-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #999;
  opacity: 0;
  transition: all 0.15s ease;
}

.search-result-item:hover .result-action {
  opacity: 1;
  color: #000;
}

.result-action .t-icon {
  font-size: 14px;
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
}

.search-empty .t-icon {
  opacity: 0.3;
  margin-bottom: 12px;
}

.search-empty p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.search-panel-footer {
  padding: 8px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.02);
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 11px;
  color: #999;
}

.search-tips span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-tips kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 600;
  color: #666;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: -apple-system, 'SF Mono', 'Monaco', monospace;
  letter-spacing: 0.5px;
}

.top-bar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.icon-button {
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
}

.divider-vertical {
  width: 1px;
  height: 20px;
  background: #e7e7e7;
  margin: 0 8px;
}

/* Apple 风格新建按钮 */
.create-btn {
  background: var(--primary-color) !important;
  border: none !important;
  box-shadow: var(--shadow-1) !important;
  border-radius: var(--radius-medium) !important;
  font-weight: 600 !important;
  height: 32px !important;
  padding: 0 14px !important;
  transition: all var(--transition-fast) !important;
  font-size: 13px !important;
  letter-spacing: -0.2px !important;
}

.create-btn:hover {
  background: var(--primary-hover) !important;
  box-shadow: var(--shadow-2) !important;
}

/* Apple 风格用户信息区域 */
.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 3px 10px 3px 3px;
  border-radius: 18px;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.user-info-trigger:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
}

.user-avatar {
  background: var(--primary-color) !important;
  font-weight: 600;
  font-size: 14px;
}

.user-info-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1.3;
}

.username {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: -0.2px;
}

.user-role {
  font-size: 10px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.dropdown-icon {
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.user-info-trigger:hover .dropdown-icon {
  transform: rotate(180deg);
}
</style>
