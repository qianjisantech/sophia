<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { MessagePlugin, Icon } from 'tdesign-vue-next'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()

// 当前文件夹ID（从URL参数获取）
const folderId = computed(() => route.params.id as string)

// 当前文件夹信息
const currentFolder = computed(() => {
  return documentStore.getDocumentById(folderId.value)
})

// 用户信息
const username = computed(() => localStorage.getItem('username') || '用户')

// 搜索关键词
const searchKeyword = ref('')

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  MessagePlugin.success('已退出登录')
  router.push('/login')
}

// 获取文件夹内的文档
const folderDocuments = computed(() => {
  let docs = documentStore.getDocumentsByFolderId(folderId.value)
  // 过滤掉文件夹类型的文档
  docs = docs.filter(doc => doc.type !== 'folder')

  // 应用搜索过滤
  if (searchKeyword.value) {
    docs = docs.filter(doc =>
      doc.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  return docs
})

// 加载文档列表
onMounted(async () => {
  await documentStore.loadDocuments()
})

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

// 返回首页
const goBack = () => {
  router.push('/')
}

// 格式化时间
const formatTime = (timestamp: string | number) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

// 根据文件类型获取图标和颜色
const getFileIcon = (type: string) => {
  const iconMap: Record<string, { icon: string, color: string }> = {
    'document': { icon: 'file-text', color: '#5B8FF9' },
    'spreadsheet': { icon: 'table', color: '#1D7F3E' },
    'mindmap': { icon: 'root-list', color: '#8B5CF6' },
    'pdf': { icon: 'file-pdf', color: '#E02E24' },
    'word': { icon: 'file-word', color: '#2B579A' },
    'folder': { icon: 'folder', color: '#FAAD14' },
    'image': { icon: 'image', color: '#F5A623' },
    'slide': { icon: 'play-circle', color: '#D24726' },
    'flowchart': { icon: 'chart-bubble', color: '#00A870' },
    'whiteboard': { icon: 'edit', color: '#0052D9' }
  }
  return iconMap[type] || { icon: 'file', color: '#8C8C8C' }
}

// 表格列配置
const columns: any[] = [
  {
    colKey: 'title',
    title: '名称',
    width: '35%',
    cell: (h: any, { row }: any) => {
      const fileIcon = getFileIcon(row.type || 'document')
      return h('div', { class: 'doc-title-cell', style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
        h(Icon, {
          name: fileIcon.icon,
          style: { fontSize: '24px', color: fileIcon.color, flexShrink: '0' }
        }),
        h('div', { class: 'doc-info', style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          h('span', { class: 'doc-name', style: { fontSize: '14px', color: '#1F1F1F', fontWeight: '400' } }, row.title)
        ])
      ])
    }
  },
  {
    colKey: 'updatedAt',
    title: '更新时间',
    width: '15%',
    cell: (h: any, { row }: any) => h('span', formatTime(row.updatedAt))
  },
  {
    colKey: 'updater',
    title: '更新者',
    width: '12%',
    cell: (h: any, { row }: any) => h('span', row.updater || '未知')
  },
  {
    colKey: 'creator',
    title: '创建者',
    width: '12%',
    cell: (h: any, { row }: any) => h('span', row.creator || '未知')
  },
  {
    colKey: 'createdAt',
    title: '创建时间',
    width: '15%',
    cell: (h: any, { row }: any) => h('span', formatTime(row.createdAt))
  },
  {
    colKey: 'actions',
    title: '操作',
    width: '11%'
  }
]
</script>

<template>
  <div class="folder-view-page">
    <Sidebar />

    <div class="main-content">
      <!-- 顶部栏 -->
      <div class="top-bar">
        <div class="search-bar">
          <t-input
            v-model="searchKeyword"
            placeholder="搜索"
            clearable
            :style="{ width: '400px' }"
          >
            <template #prefix-icon>
              <t-icon name="search" />
            </template>
          </t-input>
        </div>

        <div class="action-buttons">
          <t-dropdown
            :options="[
              { content: '退出登录', value: 'logout' }
            ]"
            @click="handleLogout"
          >
            <div class="user-info-section">
              <div class="user-info-trigger">
                <t-avatar size="32px">{{ username.charAt(0).toUpperCase() }}</t-avatar>
                <span class="username">{{ username }}</span>
              </div>
            </div>
          </t-dropdown>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-nav">
          <t-breadcrumb>
            <t-breadcrumb-item @click="goBack" style="cursor: pointer;">
              <t-icon name="home" />
              首页
            </t-breadcrumb-item>
            <t-breadcrumb-item>{{ currentFolder?.title || '文件夹' }}</t-breadcrumb-item>
          </t-breadcrumb>
        </div>

        <!-- 页面标题区域 -->
        <div class="page-header">
          <div class="page-title-wrapper">
            <div style="display: flex; align-items: center; gap: 12px;">
              <t-icon name="folder" size="22px" style="color: #FAAD14;" />
              <h2 class="page-title">{{ currentFolder?.title || '文件夹' }}</h2>
            </div>
            <p class="page-meta">共 {{ folderDocuments.length }} 个文件</p>
          </div>
        </div>

        <!-- 文档列表区域 -->
        <div class="documents-section">
          <div class="section-toolbar">
            <div class="toolbar-left"></div>
            <div class="toolbar-right">
              <t-button variant="text" size="small">创建者</t-button>
              <t-button variant="text" size="small">全部文件</t-button>
            </div>
          </div>

          <!-- 文档内容 -->
          <div class="documents-content">
            <!-- 表格视图 -->
            <div class="table-view">
              <t-table
                :data="folderDocuments"
                :columns="columns"
                row-key="id"
                :empty="folderDocuments.length === 0 ? '该文件夹暂无文件' : undefined"
                @row-dblclick="(e: any) => openDocument(e.row.id)"
              >
                <template #actions="{ row }">
                  <t-dropdown
                    :options="[
                      { content: '打开', value: 'open' },
                      { content: '重命名', value: 'rename' },
                      { content: '移动', value: 'move' },
                      { content: '删除', value: 'delete' }
                    ]"
                    @click="(data: any) => {
                      if (data.value === 'open') {
                        openDocument(row.id)
                      } else if (data.value === 'delete') {
                        MessagePlugin.info('删除功能开发中...')
                      } else {
                        MessagePlugin.info('功能开发中...')
                      }
                    }"
                  >
                    <div class="action-more-icon">
                      <t-icon name="ellipsis" />
                    </div>
                  </t-dropdown>
                </template>
              </t-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-view-page {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #FAFAFA;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
  box-shadow: none;
  flex-shrink: 0;
}

.search-bar {
  flex: 1;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info-section {
  margin-left: 8px;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.user-info-trigger:hover {
  background: #F7F8FA;
}

.user-info-trigger .username {
  font-size: 14px;
  color: #1F1F1F;
  font-weight: 400;
}

.content-area {
  flex: 1;
  overflow: hidden;
  background: #ffffff;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #ffffff;
  border-bottom: 1px solid #F0F0F0;
}

.page-header {
  padding: 20px 20px 12px;
  background: #ffffff;
  flex-shrink: 0;
}

.page-title-wrapper {
  max-width: 1200px;
}

.page-title {
  font-size: 20px;
  font-weight: 500;
  color: #1F1F1F;
  margin: 0;
}

.page-meta {
  font-size: 13px;
  color: #8C8C8C;
  margin: 8px 0 0 34px;
}

.documents-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.section-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background: white;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.documents-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.table-view {
  flex: 1;
  overflow: auto;
  padding: 0 20px 20px;
  min-height: 0;
}

/* 自定义滚动条样式 */
.table-view::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-view::-webkit-scrollbar-track {
  background: transparent;
}

.table-view::-webkit-scrollbar-thumb {
  background: #D9D9D9;
  border-radius: 3px;
}

.table-view::-webkit-scrollbar-thumb:hover {
  background: #BFBFBF;
}

/* TDesign 表格样式优化 */
.table-view :deep(.t-table__body tr) {
  height: 52px;
  transition: background 0.2s;
}

.table-view :deep(.t-table__body tr:hover) {
  background: #F7F8FA !important;
}

.table-view :deep(.t-table__body td) {
  padding: 12px 16px;
  border-bottom: 1px solid #F5F5F5;
}

.table-view :deep(.t-table__header th) {
  background: #FAFAFA;
  color: #8C8C8C;
  font-weight: 400;
  font-size: 13px;
  padding: 10px 16px;
  border-bottom: 1px solid #F0F0F0;
}

.table-view :deep(.t-table) {
  border: 1px solid #F0F0F0;
  border-radius: 6px;
  overflow: hidden;
}

.doc-title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doc-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-name {
  font-size: 14px;
  color: #1F1F1F;
  font-weight: 400;
}

/* 操作列3个点图标样式 */
.action-more-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  color: #8C8C8C;
}

.action-more-icon:hover {
  background: #F7F8FA;
  color: #0052D9;
}

.action-more-icon .t-icon {
  font-size: 18px;
}
</style>
