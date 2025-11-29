<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '../../stores/document'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const documentStore = useDocumentStore()

// 搜索关键词
const searchKeyword = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

// 最近搜索历史
const searchHistory = ref<string[]>([])

// 热门搜索
const hotSearches = ['文档', '表格', '思维导图', '项目计划', '会议纪要']

// 过滤后的文档
const filteredDocuments = computed(() => {
  if (!searchKeyword.value.trim()) {
    return []
  }
  return documentStore.documents.filter(doc =>
    doc.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
}

// 执行搜索
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  // 添加到搜索历史
  if (keyword && !searchHistory.value.includes(keyword)) {
    searchHistory.value.unshift(keyword)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
}

// 清除搜索历史
const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 打开文档
const openDocument = (id: string) => {
  const doc = documentStore.documents.find(d => d.id === id)
  if (doc?.type === 'spreadsheet') {
    router.push(`/spreadsheet/${id}`)
  } else if (doc?.type === 'mindmap') {
    router.push(`/mindmap/${id}`)
  } else {
    router.push(`/document/${id}`)
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

// 获取文件图标
const getFileIcon = (type: string) => {
  const iconMap: Record<string, { icon: string, color: string }> = {
    'document': { icon: 'file-copy', color: '#5B8FF9' },
    'spreadsheet': { icon: 'table', color: '#1D7F3E' },
    'mindmap': { icon: 'root-list', color: '#8B5CF6' },
    'folder': { icon: 'folder', color: '#FAAD14' },
  }
  return iconMap[type] || { icon: 'file', color: '#8C8C8C' }
}

// 页面加载
onMounted(() => {
  // 自动聚焦搜索框
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 300)

  // 加载搜索历史
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
})
</script>

<template>
  <div class="search-page">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <t-button variant="text" shape="square" class="back-btn" @click="goBack">
        <t-icon name="chevron-left" />
      </t-button>

      <div class="search-input-wrapper">
        <t-input
          ref="searchInputRef"
          v-model="searchKeyword"
          placeholder="搜索文档、文件夹..."
          clearable
          @clear="clearSearch"
        >
          <template #prefix-icon>
            <t-icon name="search" />
          </template>
        </t-input>
      </div>
    </div>

    <!-- 搜索内容区域 -->
    <div class="search-content">
      <!-- 无搜索内容时显示 -->
      <div v-if="!searchKeyword" class="search-suggestions">
        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0" class="suggestion-section">
          <div class="section-header">
            <span class="section-title">最近搜索</span>
            <t-button variant="text" size="small" @click="clearHistory">
              <t-icon name="delete" size="14px" />
              清空
            </t-button>
          </div>
          <div class="history-tags">
            <t-tag
              v-for="(item, index) in searchHistory"
              :key="index"
              variant="light"
              class="history-tag"
              @click="handleSearch(item)"
            >
              {{ item }}
            </t-tag>
          </div>
        </div>

        <!-- 热门搜索 -->
        <div class="suggestion-section">
          <div class="section-header">
            <span class="section-title">热门搜索</span>
          </div>
          <div class="hot-search-list">
            <div
              v-for="(item, index) in hotSearches"
              :key="index"
              class="hot-search-item"
              @click="handleSearch(item)"
            >
              <span class="hot-search-rank">{{ index + 1 }}</span>
              <span class="hot-search-text">{{ item }}</span>
              <t-icon name="chevron-right" size="16px" class="hot-search-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-else class="search-results">
        <div v-if="filteredDocuments.length > 0" class="results-list">
          <div class="results-header">
            找到 <span class="results-count">{{ filteredDocuments.length }}</span> 个结果
          </div>

          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="result-item"
            @click="openDocument(doc.id)"
          >
            <div class="result-icon">
              <t-icon
                :name="getFileIcon(doc.type || 'document').icon"
                :style="{ fontSize: '32px', color: getFileIcon(doc.type || 'document').color }"
              />
            </div>
            <div class="result-info">
              <h4 class="result-title">{{ doc.title }}</h4>
              <div class="result-meta">
                <span class="result-time">{{ formatTime(doc.updatedAt) }}</span>
                <span v-if="doc.folder" class="result-folder">· {{ doc.folder }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果 -->
        <div v-else class="no-results">
          <t-icon name="search" size="64px" />
          <p class="no-results-text">未找到相关文档</p>
          <p class="no-results-tip">试试其他关键词吧</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F5F5F5;
}

/* 顶部搜索栏 */
.search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border-radius: 8px !important;
  color: var(--text-primary) !important;
  flex-shrink: 0;
}

.back-btn:active {
  background: rgba(0, 0, 0, 0.06) !important;
}

.back-btn :deep(.t-icon) {
  font-size: 24px;
}

.search-input-wrapper {
  flex: 1;
}

.search-input-wrapper :deep(.t-input) {
  border-radius: 20px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  height: 40px;
  font-size: 15px;
}

.search-input-wrapper :deep(.t-input:focus) {
  background: rgba(0, 0, 0, 0.08);
  box-shadow: none;
}

.search-input-wrapper :deep(.t-input__inner) {
  padding: 0 12px;
}

.search-input-wrapper :deep(.t-icon) {
  font-size: 20px;
  color: var(--text-tertiary);
}

/* 搜索内容区域 */
.search-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 搜索建议 */
.search-suggestions {
  padding: 16px;
}

.suggestion-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.section-header .t-button {
  color: var(--text-tertiary) !important;
  font-size: 13px !important;
  padding: 4px 8px !important;
}

/* 历史标签 */
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-tag:active {
  transform: scale(0.95);
  background: rgba(0, 82, 217, 0.1) !important;
}

/* 热门搜索 */
.hot-search-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hot-search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-search-item:active {
  background: rgba(0, 82, 217, 0.06);
  transform: scale(0.98);
}

.hot-search-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.hot-search-text {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.hot-search-icon {
  color: var(--text-tertiary);
}

/* 搜索结果 */
.search-results {
  padding: 16px;
}

.results-header {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  padding: 0 4px;
}

.results-count {
  color: var(--primary-color);
  font-weight: 600;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.result-item:active {
  transform: scale(0.98);
  background: rgba(0, 82, 217, 0.04);
}

.result-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.result-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.result-time,
.result-folder {
  flex-shrink: 0;
}

/* 无结果 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-results .t-icon {
  color: var(--text-placeholder);
  opacity: 0.3;
  margin-bottom: 16px;
}

.no-results-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.no-results-tip {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
}
</style>
