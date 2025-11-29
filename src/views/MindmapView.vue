<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { MessagePlugin } from 'tdesign-vue-next'
import MindmapEditor from '../components/MindmapEditor.vue'

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
  }, 2000) // 思维导图数据较大，延长保存时间到2秒
})

// 保存文档
const saveDocument = async () => {
  if (!document.value) return

  isSaving.value = true

  // 模拟保存延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  documentStore.updateDocument(docId.value, {
    title: title.value || '无标题思维导图',
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

// 添加节点
const addNode = () => {
  MessagePlugin.info('双击画布空白处添加节点')
}

// 导出图片
const exportImage = () => {
  MessagePlugin.info('导出功能开发中')
}
</script>

<template>
  <div class="mindmap-view-page" v-if="document">
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
            placeholder="未命名思维导图"
            class="title-input"
          />
          <div class="doc-meta">
            <t-icon name="chart-bubble" size="14px" />
            <span>思维导图</span>
            <t-icon name="user" size="14px" style="margin-left: 8px" />
            <span>仅内部</span>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <span v-if="lastSavedTime" class="save-status">{{ formatSaveTime }}</span>
        <t-button variant="outline" size="small" @click="addNode">
          <template #icon><t-icon name="add" /></template>
          添加节点
        </t-button>
        <t-button variant="outline" size="small" @click="exportImage">
          <template #icon><t-icon name="download" /></template>
          导出图片
        </t-button>
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

    <!-- 工具提示 -->
    <div class="toolbar-tips">
      <div class="tip-item">
        <t-icon name="mouse" />
        <span>拖拽移动画布</span>
      </div>
      <div class="tip-item">
        <t-icon name="zoom-in" />
        <span>Ctrl + 滚轮缩放</span>
      </div>
      <div class="tip-item">
        <t-icon name="keyboard" />
        <span>Ctrl+C 复制 | Ctrl+V 粘贴 | Delete 删除</span>
      </div>
      <div class="tip-item">
        <t-icon name="rollback" />
        <span>Ctrl+Z 撤销 | Ctrl+Y 重做</span>
      </div>
    </div>

    <!-- 思维导图编辑器 -->
    <div class="mindmap-main">
      <MindmapEditor v-model="content" />
    </div>
  </div>
</template>

<style scoped>
.mindmap-view-page {
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

.toolbar-tips {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px 16px;
  background: #f7f9fc;
  border-bottom: 1px solid #e7e7e7;
  font-size: 12px;
  color: #646464;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tip-item :deep(.t-icon) {
  color: #0052D9;
}

.mindmap-main {
  flex: 1;
  overflow: hidden;
  background: white;
}
</style>
