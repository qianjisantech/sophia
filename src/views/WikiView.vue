<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { getWikisDB } from '../mock/data'
import type { Wiki } from '../types/wiki'
import TopBar from '../components/TopBar.vue'

const router = useRouter()
const wikis = ref<Wiki[]>(getWikisDB())
const searchKeyword = ref('')
const activeTab = ref('all')

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
</script>

<template>
  <div class="wiki-view">
    <!-- 顶部栏 -->
    <TopBar
      :sidebar-visible="props.sidebarVisible"
      page-title="知识库"
      search-placeholder="搜索知识库..."
      :search-results="filteredWikis"
      @toggle-sidebar="toggleSidebar"
      @search-update="handleSearchUpdate"
      @result-click="handleResultClick"
    >
      <template #search-title>
        {{ searchKeyword.trim() ? `搜索结果 (${filteredWikis.length})` : '所有知识库' }}
      </template>
      <template #search-result-item="{ item }">
        <div class="result-icon" :style="{ background: item.color || '#0052D9' }">
          <t-icon name="book" style="color: white;" />
        </div>
        <div class="result-content">
          <div class="result-title">{{ item.title }}</div>
          <div class="result-meta">
            <span>{{ item.documentCount }} 篇文档</span>
            <span class="result-dot">·</span>
            <span>{{ formatTime(item.updatedAt) }}</span>
          </div>
        </div>
        <div class="result-action">
          <t-icon name="chevron-right" />
        </div>
      </template>
    </TopBar>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 功能卡片 -->
      <div class="feature-cards">
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

      <!-- Tab 导航 -->
      <div class="wiki-tabs">
        <div
          class="wiki-tab"
          :class="{ active: activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          全部知识库
        </div>
      </div>

      <!-- 知识库卡片网格 -->
      <div class="wiki-grid">
        <div
          v-for="wiki in filteredWikis"
          :key="wiki.id"
          class="wiki-card"
          @click="openWiki(wiki)"
        >
          <div class="wiki-card-inner" :style="{
            background: `linear-gradient(135deg, ${wiki.color} 0%, ${wiki.color}dd 70%, ${wiki.color}bb 100%)`
          }">
            <div class="wiki-card-header">
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

            <div class="wiki-card-body">
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

            <div class="wiki-card-footer">
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
      <div v-if="filteredWikis.length === 0" class="empty-state">
        <t-icon name="folder-open" size="64px" />
        <p class="empty-text">{{ searchKeyword ? '没有找到相关知识库' : '还没有创建任何知识库' }}</p>
        <t-button v-if="!searchKeyword" theme="primary" @click="handleCreateWiki">
          <t-icon name="add" />
          创建第一个知识库
        </t-button>
      </div>
    </div>
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

/* 响应式 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .wiki-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .top-bar {
    padding: 12px 16px;
  }
}
</style>
