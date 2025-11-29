<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { getWikisDB } from '../mock/data'
import type { Wiki } from '../types/wiki'
import TopBar from '../components/TopBar.vue'
import BottomTabBar from '../components/BottomTabBar.vue'
import PullToRefresh from '../components/PullToRefresh.vue'
import { useDevice } from '../composables/useDevice'

// 组件名称，用于keep-alive
defineOptions({
  name: 'Wiki'
})

const router = useRouter()
const { isMobile } = useDevice()
const wikis = ref<Wiki[]>(getWikisDB())
const searchKeyword = ref('')
const activeTab = ref('all')
const refreshing = ref(false)
const showCreateMenu = ref(false)

// 侧边栏折叠状态
const props = defineProps<{
  sidebarVisible?: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// 搜索更新
const handleSearchUpdate = (value: string) => {
  searchKeyword.value = value
}

// 搜索过滤
const filteredWikis = computed(() => {
  if (!searchKeyword.value.trim()) {
    return wikis.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return wikis.value.filter(wiki =>
    wiki.title.toLowerCase().includes(keyword) ||
    wiki.description.toLowerCase().includes(keyword) ||
    wiki.tags?.some(tag => tag.toLowerCase().includes(keyword))
  )
})

// 格式化时间
const formatTime = (timestamp: string | number) => {
  if (!timestamp) return '-'

  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < month) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

// 打开知识库
const openWiki = (wiki: Wiki) => {
  MessagePlugin.info(`打开知识库: ${wiki.title}`)
  // TODO: 跳转到知识库详情页
}

// 点击搜索结果
const handleResultClick = (wiki: Wiki) => {
  openWiki(wiki)
}

// 创建知识库
const handleCreateWiki = () => {
  MessagePlugin.info('创建知识库功能开发中...')
}

// 新建文档
const handleCreateDocument = () => {
  MessagePlugin.info('新建文档功能开发中...')
}

// 模版库
const handleTemplates = () => {
  MessagePlugin.info('模版库功能开发中...')
}

// 下拉刷新
const handleRefresh = async () => {
  refreshing.value = true
  // 模拟刷新数据
  await new Promise(resolve => setTimeout(resolve, 1000))
  wikis.value = getWikisDB()
  refreshing.value = false
  // H5模式下不显示刷新成功提示
}

// 切换创建菜单
const toggleCreateMenu = () => {
  showCreateMenu.value = !showCreateMenu.value
}

// 关闭创建菜单
const closeCreateMenu = () => {
  showCreateMenu.value = false
}

// 处理创建菜单项点击
const handleCreateItemClick = (handler: () => void) => {
  handler()
  closeCreateMenu()
}

// 初始化
onMounted(() => {
  // 可以在这里加载数据
})
</script>

<template>
  <div class="wiki-view">
    <!-- 顶部栏 - 使用公用TopBar组件 -->
    <TopBar
      :sidebar-visible="props.sidebarVisible"
      page-title="知识库"
      :show-create-button="false"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- 主内容区域 -->
    <PullToRefresh @refresh="handleRefresh" :refreshing="refreshing">
      <div class="main-content" :class="{ 'mobile-content': isMobile }">
        <!-- 桌面端功能卡片 -->
        <div v-if="!isMobile" class="feature-cards">
          <div class="feature-card" @click="handleCreateDocument">
            <div class="feature-card-icon">
              <t-icon name="add" size="20px" />
            </div>
            <div class="feature-card-content">
              <div class="feature-card-title">新建</div>
              <div class="feature-card-desc">创建新文档</div>
            </div>
          </div>
          <div class="feature-card" @click="handleTemplates">
            <div class="feature-card-icon">
              <t-icon name="folder-open" size="20px" />
            </div>
            <div class="feature-card-content">
              <div class="feature-card-title">模版库</div>
              <div class="feature-card-desc">使用文档模版</div>
            </div>
          </div>
          <div class="feature-card" @click="handleCreateWiki">
            <div class="feature-card-icon">
              <t-icon name="book" size="20px" />
            </div>
            <div class="feature-card-content">
              <div class="feature-card-title">新建知识库</div>
              <div class="feature-card-desc">创建新知识库</div>
            </div>
          </div>
        </div>

        <!-- 移动端统计信息 -->
        <div v-if="isMobile" class="mobile-stats">
          <div class="stat-item">
            <div class="stat-value">{{ filteredWikis.length }}</div>
            <div class="stat-label">知识库</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ filteredWikis.reduce((sum, w) => sum + w.documentCount, 0) }}</div>
            <div class="stat-label">文档</div>
          </div>
        </div>

        <!-- Tab 导航 -->
        <div class="wiki-tabs" :class="{ 'mobile-tabs': isMobile }">
          <div
            class="wiki-tab"
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            全部知识库
          </div>
        </div>

        <!-- 知识库卡片网格 -->
        <div class="wiki-grid" :class="{ 'mobile-grid': isMobile }">
          <div
            v-for="wiki in filteredWikis"
            :key="wiki.id"
            class="wiki-card"
            :class="{ 'mobile-card': isMobile }"
            @click="openWiki(wiki)"
          >
            <div class="wiki-card-inner" :style="{
              background: isMobile 
                ? `linear-gradient(135deg, ${wiki.color}15 0%, ${wiki.color}08 100%)`
                : `linear-gradient(135deg, ${wiki.color} 0%, ${wiki.color}dd 70%, ${wiki.color}bb 100%)`
            }">
              <!-- 移动端卡片头部 -->
              <div v-if="isMobile" class="wiki-card-header-mobile">
                <div class="wiki-icon-mobile" :style="{ background: wiki.color || '#0052D9' }">
                  <t-icon name="book" />
                </div>
                <div class="wiki-header-content">
                  <h3 class="wiki-title-mobile">{{ wiki.title }}</h3>
                  <p class="wiki-description-mobile">{{ wiki.description }}</p>
                </div>
                <t-dropdown
                  :options="[
                    { content: '编辑', value: 'edit' },
                    { content: '分享', value: 'share' },
                    { content: '删除', value: 'delete' }
                  ]"
                  @click.stop
                >
                  <t-button variant="text" shape="square" size="small" class="wiki-more-btn">
                    <t-icon name="more" />
                  </t-button>
                </t-dropdown>
              </div>

              <!-- 桌面端卡片头部 -->
              <div v-else class="wiki-card-header">
                <div class="wiki-actions">
                  <t-dropdown
                    :options="[
                      { content: '编辑', value: 'edit' },
                      { content: '分享', value: 'share' },
                      { content: '删除', value: 'delete' }
                    ]"
                    @click.stop
                  >
                    <t-button variant="text" shape="square" size="small">
                      <t-icon name="more" />
                    </t-button>
                  </t-dropdown>
                </div>
              </div>

              <!-- 桌面端卡片主体 -->
              <div v-if="!isMobile" class="wiki-card-body">
                <h3 class="wiki-title">{{ wiki.title }}</h3>
                <p class="wiki-description">{{ wiki.description }}</p>

                <div class="wiki-tags">
                  <t-tag
                    v-for="tag in wiki.tags?.slice(0, 3)"
                    :key="tag"
                    size="small"
                    variant="light"
                  >
                    {{ tag }}
                  </t-tag>
                </div>
              </div>

              <!-- 移动端卡片底部 -->
              <div v-if="isMobile" class="wiki-card-footer-mobile">
                <div class="wiki-tags-mobile">
                  <t-tag
                    v-for="tag in wiki.tags?.slice(0, 2)"
                    :key="tag"
                    size="small"
                    variant="light"
                    :style="{ background: wiki.color + '20', color: wiki.color, borderColor: wiki.color + '40' }"
                  >
                    {{ tag }}
                  </t-tag>
                </div>
                <div class="wiki-meta-mobile">
                  <div class="wiki-meta-item">
                    <t-icon name="file-copy" size="14px" />
                    <span>{{ wiki.documentCount }} 篇</span>
                  </div>
                  <div class="wiki-meta-item">
                    <t-icon name="time" size="14px" />
                    <span>{{ formatTime(wiki.updatedAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- 桌面端卡片底部 -->
              <div v-else class="wiki-card-footer">
                <div class="wiki-meta">
                  <t-icon name="file-copy" size="14px" />
                  <span>{{ wiki.documentCount }} 篇</span>
                </div>
                <div class="wiki-meta">
                  <t-icon name="time" size="14px" />
                  <span>{{ formatTime(wiki.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredWikis.length === 0" class="empty-state" :class="{ 'mobile-empty': isMobile }">
          <t-icon name="folder-open" :size="isMobile ? '48px' : '64px'" />
          <p class="empty-text">{{ searchKeyword ? '没有找到相关知识库' : '还没有创建任何知识库' }}</p>
          <t-button v-if="!searchKeyword" theme="primary" @click="handleCreateWiki">
            <t-icon name="add" />
            创建第一个知识库
          </t-button>
        </div>
      </div>
    </PullToRefresh>

    <!-- 移动端浮动创建按钮 -->
    <transition name="fade">
      <div v-if="isMobile && !showCreateMenu" class="mobile-fab" @click="toggleCreateMenu">
        <t-icon name="add" />
      </div>
    </transition>

    <!-- 移动端创建菜单 -->
    <transition name="slide-up">
      <div v-if="isMobile && showCreateMenu" class="mobile-create-menu" @click.self="closeCreateMenu">
        <div class="create-menu-content">
          <div class="create-menu-header">
            <span class="create-menu-title">创建</span>
            <t-button variant="text" shape="square" @click="closeCreateMenu">
              <t-icon name="close" />
            </t-button>
          </div>
          <div class="create-menu-items">
            <div class="create-menu-item" @click="handleCreateItemClick(handleCreateDocument)">
              <div class="create-menu-item-icon" style="background: rgba(0, 82, 217, 0.1);">
                <t-icon name="add" style="color: #0052D9; font-size: 24px;" />
              </div>
              <div class="create-menu-item-text">
                <div class="create-menu-item-title">新建文档</div>
                <div class="create-menu-item-desc">创建新文档</div>
              </div>
            </div>
            <div class="create-menu-item" @click="handleCreateItemClick(handleTemplates)">
              <div class="create-menu-item-icon" style="background: rgba(0, 168, 112, 0.1);">
                <t-icon name="folder-open" style="color: #00A870; font-size: 24px;" />
              </div>
              <div class="create-menu-item-text">
                <div class="create-menu-item-title">模版库</div>
                <div class="create-menu-item-desc">使用文档模版</div>
              </div>
            </div>
            <div class="create-menu-item" @click="handleCreateItemClick(handleCreateWiki)">
              <div class="create-menu-item-icon" style="background: rgba(250, 173, 20, 0.1);">
                <t-icon name="book" style="color: #FAAD14; font-size: 24px;" />
              </div>
              <div class="create-menu-item-text">
                <div class="create-menu-item-title">新建知识库</div>
                <div class="create-menu-item-desc">创建新知识库</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 移动端底部Tab栏 -->
    <BottomTabBar v-if="isMobile" />
  </div>
</template>

<style scoped>
.wiki-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* 移动端主内容区域 */
.main-content.mobile-content {
  padding: 16px;
  padding-bottom: calc(56px + 16px); /* 为底部Tab栏留出空间 */
}

/* 页面头部 */
.page-header {
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
}

/* Tab 导航 */
.wiki-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e7e7e7;
}

.wiki-tab {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #8a8a8a;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.wiki-tab:hover {
  color: #1f1f1f;
}

.wiki-tab.active {
  color: #0052D9;
}

.wiki-tab.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #0052D9;
  border-radius: 1px;
}

/* 功能卡片 */
.feature-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-shrink: 0;
  max-width: 50%;
}

.feature-card {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border: 2px solid #e7e7e7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  gap: 12px;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 82, 217, 0.05) 0%, rgba(0, 82, 217, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #0052D9;
  box-shadow: 0 8px 24px rgba(0, 82, 217, 0.15);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:active {
  transform: translateY(-2px);
}

.feature-card-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.feature-card:hover .feature-card-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(0, 82, 217, 0.3);
}

.feature-card-icon :deep(.t-icon) {
  color: white;
  font-size: 20px;
}

.feature-card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.feature-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feature-card-desc {
  font-size: 11px;
  color: #8a8a8a;
  position: relative;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 知识库卡片网格 */
.wiki-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

@media (max-width: 1600px) {
  .wiki-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1400px) {
  .wiki-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .wiki-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.wiki-card {
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08),
              0 2px 4px rgba(0, 0, 0, 0.04);
  position: relative;
}

.wiki-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.wiki-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15),
              0 8px 16px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transform: translateY(-6px) scale(1.02);
}

.wiki-card:hover::before {
  opacity: 1;
}

.wiki-card-inner {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  position: relative;
  overflow: hidden;
}

/* 添加光点装饰 */
.wiki-card-inner .sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  pointer-events: none;
  animation: sparkle 3s ease-in-out infinite;
}

.wiki-card-inner .sparkle:nth-child(1) {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.wiki-card-inner .sparkle:nth-child(2) {
  top: 60%;
  right: 20%;
  animation-delay: 1s;
}

.wiki-card-inner .sparkle:nth-child(3) {
  bottom: 30%;
  left: 25%;
  animation-delay: 2s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.wiki-card-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    /* 主光源 - 左上角 */
    radial-gradient(ellipse 180px 140px at 10% 15%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
    /* 次光源 - 右上角 */
    radial-gradient(ellipse 140px 120px at 90% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    /* 底部光晕 */
    radial-gradient(ellipse 160px 100px at 50% 95%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
    /* 中央高光 */
    radial-gradient(ellipse 120px 120px at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
    /* 左侧阴影 */
    radial-gradient(ellipse 100px 150px at 5% 60%, rgba(0, 0, 0, 0.1) 0%, transparent 50%),
    /* 右下角阴影 */
    radial-gradient(ellipse 100px 100px at 95% 85%, rgba(0, 0, 0, 0.08) 0%, transparent 50%),
    /* 整体渐变遮罩 */
    linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 40%, rgba(0, 0, 0, 0.05) 100%),
    /* 细微纹理 */
    repeating-linear-gradient(
      60deg,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.015) 8px,
      rgba(255, 255, 255, 0.015) 16px
    );
  pointer-events: none;
  animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.9;
  }
}

.wiki-card-inner::after {
  content: '';
  position: absolute;
  top: -30%;
  right: -15%;
  width: 140px;
  height: 140px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(30px);
  pointer-events: none;
}

.wiki-card-body {
  position: relative;
}

.wiki-card-body::before {
  content: '';
  position: absolute;
  bottom: -25px;
  left: -25px;
  width: 120px;
  height: 120px;
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.08) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
}

.wiki-card-body::after {
  content: '';
  position: absolute;
  top: 15%;
  right: 8%;
  width: 80px;
  height: 80px;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  pointer-events: none;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.wiki-card-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 8px;
  z-index: 1;
}

.wiki-card-header::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  width: 100px;
  height: 100px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.wiki-card-header::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transform: rotate(15deg);
  pointer-events: none;
}

.wiki-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.wiki-actions :deep(.t-button) {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.wiki-actions :deep(.t-button .t-icon) {
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.wiki-actions :deep(.t-button:hover) {
  background: rgba(255, 255, 255, 0.45);
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.wiki-card:hover .wiki-actions {
  opacity: 1;
}

.wiki-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  position: relative;
  z-index: 1;
}

.wiki-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 39px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2),
               0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
}

.wiki-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.2px;
}

.wiki-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: auto;
}

.wiki-tags :deep(.t-tag) {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 11px;
  padding: 2px 8px;
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.wiki-tags :deep(.t-tag:hover) {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.wiki-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  z-index: 1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.wiki-meta {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
}

.wiki-meta :deep(.t-icon) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #8a8a8a;
}

.empty-state .t-icon {
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-text {
  font-size: 14px;
  margin: 0 0 24px 0;
}

/* ===== 移动端样式 ===== */
/* 移动端统计信息 */
.mobile-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e7e7e7;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #0052D9;
}

.stat-label {
  font-size: 12px;
  color: #8a8a8a;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #e7e7e7;
}

/* 移动端Tab导航 */
.mobile-tabs {
  margin-bottom: 16px;
  padding-bottom: 8px;
}

/* 移动端网格 */
.mobile-grid {
  grid-template-columns: 1fr;
  gap: 12px;
}

/* 移动端卡片 */
.mobile-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.mobile-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.wiki-card-inner {
  border-radius: 12px;
}

/* 移动端卡片头部 */
.wiki-card-header-mobile {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  padding-bottom: 12px;
}

.wiki-icon-mobile {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  font-size: 24px;
}

.wiki-header-content {
  flex: 1;
  min-width: 0;
}

.wiki-title-mobile {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 6px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.wiki-description-mobile {
  font-size: 13px;
  color: #8a8a8a;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wiki-more-btn {
  flex-shrink: 0;
}

/* 移动端卡片底部 */
.wiki-card-footer-mobile {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wiki-tags-mobile {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.wiki-meta-mobile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.wiki-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8a8a8a;
}

.wiki-meta-item :deep(.t-icon) {
  font-size: 14px;
  color: #8a8a8a;
}

/* 移动端空状态 */
.mobile-empty {
  padding: 60px 20px;
}

.mobile-empty .empty-text {
  font-size: 14px;
}

/* 移动端浮动按钮 */
.mobile-fab {
  position: fixed;
  right: 20px;
  bottom: calc(56px + 20px); /* 底部Tab栏上方 */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.4);
  cursor: pointer;
  z-index: 99;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-fab:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.3);
}

.mobile-fab :deep(.t-icon) {
  font-size: 24px;
}

/* 移动端创建菜单 */
.mobile-create-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.3s ease;
}

.create-menu-content {
  width: 100%;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  max-height: 70vh;
  overflow-y: auto;
  animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.create-menu-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.create-menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-menu-item:active {
  background: #f0f0f0;
  transform: scale(0.98);
}

.create-menu-item-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.create-menu-item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.create-menu-item-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f1f1f;
}

.create-menu-item-desc {
  font-size: 13px;
  color: #8a8a8a;
}

/* 动画 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}

/* 响应式 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
    padding-bottom: calc(56px + 16px);
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .wiki-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .top-bar {
    padding: 12px 16px;
  }

  /* 确保Logo在知识库页面正确显示 */
  .top-bar :deep(.mobile-logo-container) {
    display: inline-flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .top-bar :deep(.mobile-logo-container .sophia-logo) {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .top-bar :deep(.mobile-logo-container .logo-svg) {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* 隐藏桌面端功能卡片 */
  .feature-cards {
    display: none;
  }
}

/* 安全区域适配 */
@supports (padding: env(safe-area-inset-bottom)) {
  @media (max-width: 768px) {
    .mobile-fab {
      bottom: calc(56px + 20px + env(safe-area-inset-bottom));
    }

    .main-content.mobile-content {
      padding-bottom: calc(56px + 16px + env(safe-area-inset-bottom));
    }
  }
}
</style>
