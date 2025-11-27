<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { MessagePlugin } from 'tdesign-vue-next'
import WangEditor from '../components/WangEditor.vue'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()

const docId = computed(() => route.params.id as string)
const document = computed(() => documentStore.documents.find(d => d.id === docId.value))

const title = ref('')
const content = ref('')
const isSaving = ref(false)
const lastSavedTime = ref<Date | null>(null)
const showOutline = ref(true)
const wordCount = ref(0)

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
    updateWordCount()
  } else {
    MessagePlugin.error('文档不存在')
    router.push('/')
  }
})

// 自动保存
let saveTimer: number | null = null
watch([title, content], () => {
  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(() => {
    saveDocument()
  }, 1000)

  updateWordCount()
})

// 保存文档
const saveDocument = async () => {
  if (!document.value) return

  isSaving.value = true

  // 模拟保存延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  documentStore.updateDocument(docId.value, {
    title: title.value || '无标题文档',
    content: content.value
  })

  lastSavedTime.value = new Date()
  isSaving.value = false
}

// 返回列表
const goBack = () => {
  router.push('/')
}

// 计算字数
const updateWordCount = () => {
  const text = content.value.replace(/<[^>]*>/g, '').replace(/\s+/g, '')
  wordCount.value = text.length
}

// 切换大纲显示
const toggleOutline = () => {
  showOutline.value = !showOutline.value
}
</script>

<template>
  <div class="document-editor-page" v-if="document">
    <!-- 顶部导航栏 --><div class="top-nav">
      <div class="nav-left">
        <t-button variant="text" @click="goBack" class="home-btn">
          <template #icon><t-icon name="home" /></template>
        </t-button>

        <div class="document-title-section">
          <input
            v-model="title"
            placeholder="未命名文档"
            class="title-input"
          />
          <div class="doc-meta">
            <t-icon name="folder" size="14px" />
            <span>{{ document.folder || '我的文档' }}</span>
            <t-icon name="user" size="14px" style="margin-left: 8px" />
            <span>仅内部</span>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <span class="word-count">{{ wordCount }} 字数</span>
        <t-button
          theme="primary"
          variant="outline"
          @click="saveDocument"
          :loading="isSaving"
        >
          保存
        </t-button>
        <t-button variant="text" shape="square">
          <t-icon name="star" />
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


    <!-- 编辑器主体 -->
    <div class="editor-main">
      <!-- 左侧大纲 -->
      <div v-if="showOutline" class="outline-sidebar">
        <div class="outline-header">
          <span>目录</span>
          <t-button variant="text" size="small" @click="toggleOutline">
            <t-icon name="close" />
          </t-button>
        </div>
        <div class="outline-content">
          <p class="outline-empty">暂无目录</p>
        </div>
      </div>

      <!-- 编辑器内容区 -->
      <div class="editor-content-wrapper">
        <div class="editor-container">
          <WangEditor v-model="content" />
        </div>
      </div>

      <!-- 右侧工具栏 -->
      <div class="right-sidebar">
        <t-button variant="text" shape="square" title="评论">
          <t-icon name="chat" />
        </t-button>
        <t-button variant="text" shape="square" title="历史">
          <t-icon name="time" />
        </t-button>
        <t-button variant="text" shape="square" title="展开" @click="toggleOutline" v-if="!showOutline">
          <t-icon name="chevron-right" />
        </t-button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.document-editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FAFBFC;
}

/* 飞书风格的顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #E3E6EB;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.home-btn {
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-btn:hover {
  background: rgba(0, 82, 217, 0.06);
  transform: scale(1.05);
}

.document-title-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-input {
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  padding: 4px 8px;
  min-width: 280px;
  background: transparent;
  color: #1F2329;
  transition: all 0.2s;
  border-radius: 6px;
}

.title-input:hover {
  background: rgba(0, 82, 217, 0.04);
}

.title-input:focus {
  background: rgba(0, 82, 217, 0.06);
  box-shadow: 0 0 0 2px rgba(0, 82, 217, 0.15);
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8F959E;
}

.doc-meta .t-icon {
  color: #8F959E;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-right :deep(.t-button) {
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-right :deep(.t-button--primary) {
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.2);
}

.nav-right :deep(.t-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.3);
}

.word-count {
  font-size: 13px;
  color: #646A73;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  font-weight: 500;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #FFFFFF;
}

/* 飞书风格的目录侧边栏 */
.outline-sidebar {
  width: 240px;
  background: #FAFBFC;
  border-right: 1px solid #E3E6EB;
  display: flex;
  flex-direction: column;
}

.outline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E3E6EB;
  font-size: 14px;
  font-weight: 600;
  color: #1F2329;
  background: white;
}

.outline-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 飞书风格滚动条 */
.outline-content::-webkit-scrollbar {
  width: 6px;
}

.outline-content::-webkit-scrollbar-track {
  background: transparent;
}

.outline-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
}

.outline-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

.outline-empty {
  text-align: center;
  color: #8F959E;
  font-size: 13px;
  margin-top: 60px;
  line-height: 1.6;
}

.editor-content-wrapper {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 0;
  background: #FAFBFC;
}

/* 飞书风格滚动条 */
.editor-content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.editor-content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

.editor-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

.editor-container {
  width: 100%;
  max-width: 900px;
  background: white;
  min-height: 100%;
  margin: 24px auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #E3E6EB;
}

/* 飞书风格的右侧工具栏 */
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 12px;
  background: #FAFBFC;
  border-left: 1px solid #E3E6EB;
}

.right-sidebar :deep(.t-button) {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #646A73;
}

.right-sidebar :deep(.t-button:hover) {
  background: rgba(0, 82, 217, 0.08);
  color: #0052D9;
  transform: scale(1.1);
}
</style>
