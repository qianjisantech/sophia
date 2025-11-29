<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { MessagePlugin } from 'tdesign-vue-next'
import SpreadsheetEditor from '../components/SpreadsheetEditor.vue'

const props = defineProps<{
  sidebarVisible?: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()

const docId = computed(() => route.params.id as string)
const document = computed(() => documentStore.documents.find(d => d.id === docId.value))

const title = ref('')
const content = ref('')
const isSaving = ref(false)
const lastSavedTime = ref<Date | null>(null)

// 初始化文档内容
onMounted(async () => {
  // 如果本地没有，从 API 加载
  if (!document.value) {
    await documentStore.loadDocumentById(docId.value)
  }

  if (document.value) {
    title.value = document.value.title
    content.value = document.value.content
    documentStore.setCurrentDocument(docId.value)
  } else {
    MessagePlugin.error('文档不存在')
    router.push('/home')
  }
})

// 自动保存
let saveTimer: number | null = null
watch([title, content], () => {
  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(() => {
    saveDocument()
  }, 2000) // 表格数据较大，延长保存时间到2秒
})

// 保存文档
const saveDocument = async () => {
  if (!document.value) return

  isSaving.value = true

  // 模拟保存延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  documentStore.updateDocument(docId.value, {
    title: title.value || '无标题表格',
    content: content.value
  })

  lastSavedTime.value = new Date()
  isSaving.value = false
}

// 返回列表
const goBack = () => {
  router.push('/home')
}

// 格式化保存时间
const formatSaveTime = computed(() => {
  if (!lastSavedTime.value) return ''
  const now = new Date()
  const diff = now.getTime() - lastSavedTime.value.getTime()

  if (diff < 60000) {
    return '刚刚保存'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前保存`
  } else {
    return lastSavedTime.value.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
})
</script>

<template>
  <div class="spreadsheet-view-page" v-if="document">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <t-button
          variant="text"
          shape="square"
          class="menu-toggle-btn"
          @click="toggleSidebar"
        >
          <t-icon :name="props.sidebarVisible ? 'menu-fold' : 'menu-unfold'" />
        </t-button>
        <t-button variant="text" @click="goBack" class="home-btn">
          <template #icon><t-icon name="home" /></template>
        </t-button>

        <div class="document-title-section">
          <input
            v-model="title"
            placeholder="未命名表格"
            class="title-input"
          />
          <div class="doc-meta">
            <t-icon name="view-module" size="14px" />
            <span>多维表格</span>
            <t-icon name="user" size="14px" style="margin-left: 8px" />
            <span>仅内部</span>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <span v-if="lastSavedTime" class="save-status">{{ formatSaveTime }}</span>
        <t-button
          theme="primary"
          variant="outline"
          @click="saveDocument"
          :loading="isSaving"
        >
          保存
        </t-button>
        <t-button variant="text" shape="square">
          <t-icon name="share" />
        </t-button>
        <t-button variant="text" shape="square">
          <t-icon name="user" />
        </t-button>
        <t-button variant="text" shape="square">
          <t-icon name="ellipsis" />
        </t-button>
        <t-avatar size="32px">User</t-avatar>
      </div>
    </div>

    <!-- 表格编辑器 -->
    <div class="spreadsheet-main">
      <SpreadsheetEditor v-model="content" />
    </div>
  </div>
</template>

<style scoped>
.spreadsheet-view-page {
  height: 100%;
  display: flex;
  background: #fff;
}

.menu-toggle-btn {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  border-radius: 8px !important;
  color: var(--text-primary) !important;
  transition: all 0.2s ease;
}

.menu-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.06) !important;
}

.menu-toggle-btn :deep(.t-icon) {
  font-size: 20px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e7e7e7;
  background: white;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.home-btn {
  padding: 4px 8px;
}

.document-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-input {
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  padding: 2px 4px;
  min-width: 200px;
  background: transparent;
}

.title-input:focus {
  background: #f5f5f5;
  border-radius: 4px;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8a8a8a;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-status {
  font-size: 12px;
  color: #52c41a;
  padding: 0 8px;
}

.spreadsheet-main {
  flex: 1;
  overflow: hidden;
  background: white;
}

/* ===== 移动端适配 (768px以下) ===== */
@media (max-width: 768px) {
  .spreadsheet-view-page {
    overflow: hidden;
  }

  /* 顶部导航栏适配 */
  .top-nav {
    padding: 6px 12px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .nav-left {
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .home-btn {
    padding: 3px 6px;
  }

  .home-btn :deep(.t-icon) {
    font-size: 18px;
  }

  .document-title-section {
    gap: 3px;
    flex: 1;
    min-width: 0;
  }

  .title-input {
    font-size: 13px;
    padding: 2px 4px;
    min-width: 0;
    width: 100%;
  }

  .doc-meta {
    font-size: 10px;
    gap: 3px;
  }

  .nav-right {
    gap: 6px;
  }

  /* 隐藏不必要的按钮和元素 */
  .save-status {
    display: none;
  }

  .nav-right :deep(.t-button:not(:first-child)) {
    display: none;
  }

  .nav-right :deep(.t-avatar) {
    display: none;
  }

  /* 表格编辑器全屏显示 */
  .spreadsheet-main {
    position: relative;
  }

  /* 优化表格编辑器内部样式 */
  .spreadsheet-main :deep(.luckysheet-grid-container) {
    overflow-x: auto !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  /* 工具栏优化 */
  .spreadsheet-main :deep(.luckysheet-toolbar) {
    flex-wrap: wrap;
    padding: 4px !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .spreadsheet-main :deep(.luckysheet-toolbar-button) {
    margin: 2px !important;
    padding: 4px !important;
  }

  /* 隐藏部分工具栏按钮 */
  .spreadsheet-main :deep(.luckysheet-toolbar .toolbar-more-options) {
    display: none;
  }

  /* 单元格输入框优化 */
  .spreadsheet-main :deep(.luckysheet-formula-bar) {
    flex-wrap: wrap;
    padding: 4px !important;
  }

  .spreadsheet-main :deep(.luckysheet-formula-text) {
    font-size: 13px !important;
  }
}

/* ===== 超小屏幕适配 (480px以下) ===== */
@media (max-width: 480px) {
  .top-nav {
    padding: 4px 10px;
  }

  .home-btn {
    padding: 2px 4px;
  }

  .home-btn :deep(.t-icon) {
    font-size: 16px;
  }

  .title-input {
    font-size: 12px;
  }

  .doc-meta {
    font-size: 9px;
  }

  .nav-right :deep(.t-button) {
    padding: 3px 6px;
    font-size: 11px;
  }

  /* 表格单元格字体大小 */
  .spreadsheet-main :deep(.luckysheet-cell) {
    font-size: 11px !important;
  }

  /* 工具栏按钮更紧凑 */
  .spreadsheet-main :deep(.luckysheet-toolbar-button) {
    margin: 1px !important;
    padding: 3px !important;
    font-size: 12px !important;
  }

  /* 调整行高列宽 */
  .spreadsheet-main :deep(.luckysheet-row-cell) {
    min-width: 40px !important;
  }

  .spreadsheet-main :deep(.luckysheet-column-cell) {
    min-height: 30px !important;
  }
}

/* ===== 横屏优化 ===== */
@media (max-width: 768px) and (orientation: landscape) {
  .top-nav {
    padding: 4px 12px;
  }

  .title-input {
    font-size: 12px;
  }

  .doc-meta {
    display: none;
  }

  /* 最大化表格编辑区域 */
  .spreadsheet-main {
    height: calc(100vh - 50px);
  }
}
</style>
