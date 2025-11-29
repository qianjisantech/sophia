<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { MessagePlugin, Icon } from 'tdesign-vue-next'
import BottomTabBar from '../components/BottomTabBar.vue'

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

// 当前文件夹ID（从URL参数获取）
const folderId = computed(() => route.params.id as string)

// 当前文件夹信息
const currentFolder = computed(() => {
  return documentStore.getDocumentById(folderId.value)
})

// 判断文件夹所属分类
const folderCategory = computed(() => {
  if (currentFolder.value?.isShared) {
    return '共享文档'
  }
  return '我的文档'
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
  // 通过 folder 字段（文件夹名称）来匹配
  const folderName = currentFolder.value?.title
  if (!folderName) return []

  let docs = documentStore.documents.filter(doc =>
    doc.folder === folderName && doc.type !== 'folder'
  )

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
  router.push('/home')
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
    'document': { icon: 'file-copy', color: '#5B8FF9' },      // 蓝色 - 文档
    'spreadsheet': { icon: 'table', color: '#1D7F3E' },       // 绿色 - 表格
    'mindmap': { icon: 'root-list', color: '#8B5CF6' },       // 紫色 - 思维导图
    'pdf': { icon: 'file-copy', color: '#E02E24' },           // 红色 - PDF
    'word': { icon: 'file-copy', color: '#2B579A' },          // 深蓝色 - Word
    'folder': { icon: 'folder', color: '#FAAD14' },           // 橙色 - 文件夹
    'image': { icon: 'image', color: '#F5A623' },             // 橙色 - 图片
    'slide': { icon: 'play-circle', color: '#D24726' },       // 红橙色 - 幻灯片
    'flowchart': { icon: 'chart-bubble', color: '#00A870' },  // 绿色 - 流程图
    'whiteboard': { icon: 'edit', color: '#0052D9' }          // 蓝色 - 白板
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
    <div class="main-content">
      <!-- 顶部栏 -->
      <div class="top-bar">
        <div class="top-bar-left">
          <!-- 移动端菜单按钮 -->
          <t-button
            variant="text"
            shape="square"
            class="mobile-menu-btn"
            @click="toggleSidebar"
          >
            <t-icon :name="props.sidebarVisible ? 'menu-fold' : 'menu-unfold'" />
          </t-button>

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
            <t-breadcrumb-item @click="goBack" style="cursor: pointer;">
              {{ folderCategory }}
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
            <!-- 桌面端：表格视图 -->
            <div class="table-view desktop-table">
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

            <!-- 移动端：卡片列表视图 -->
            <div class="mobile-list-view">
              <div
                v-for="doc in folderDocuments"
                :key="doc.id"
                class="mobile-doc-item"
                @click="openDocument(doc.id)"
              >
                <div class="mobile-doc-icon">
                  <t-icon
                    :name="getFileIcon(doc.type || 'document').icon"
                    :style="{ fontSize: '32px', color: getFileIcon(doc.type || 'document').color }"
                  />
                </div>
                <div class="mobile-doc-info">
                  <h4 class="mobile-doc-title">{{ doc.title }}</h4>
                  <div class="mobile-doc-meta">
                    <span class="mobile-doc-time">{{ formatTime(doc.updatedAt) }}</span>
                    <span class="mobile-doc-creator" v-if="doc.creator">{{ doc.creator }}</span>
                  </div>
                </div>
                <div class="mobile-doc-action">
                  <t-dropdown
                    :options="[
                      { content: '打开', value: 'open' },
                      { content: '重命名', value: 'rename' },
                      { content: '移动', value: 'move' },
                      { content: '删除', value: 'delete' }
                    ]"
                    @click.stop="(data: any) => {
                      if (data.value === 'open') {
                        openDocument(doc.id)
                      } else if (data.value === 'delete') {
                        MessagePlugin.info('删除功能开发中...')
                      } else {
                        MessagePlugin.info('功能开发中...')
                      }
                    }"
                  >
                    <span class="mobile-action-icon" @click.stop>
                      <t-icon name="ellipsis" />
                    </span>
                  </t-dropdown>
                </div>
              </div>
              <div v-if="folderDocuments.length === 0" class="mobile-empty">
                该文件夹暂无文件
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端底部Tab栏 -->
    <BottomTabBar />
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

/* 移动端列表视图 - 默认隐藏 */
.mobile-list-view {
  display: none;
}

/* 桌面端表格 */
.desktop-table {
  display: flex;
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

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  width: 40px !important;
  height: 40px !important;
  border-radius: 8px !important;
  margin-right: 8px;
}

.mobile-menu-btn :deep(.t-icon) {
  font-size: 20px;
}

.top-bar-left {
  display: flex;
  align-items: center;
  flex: 1;
}

/* ===== 移动端适配 (768px以下) ===== */
@media (max-width: 768px) {
  /* 主内容区域适配底部Tab栏 */
  .main-content {
    padding-bottom: 56px;
  }

  /* 显示移动端菜单按钮 */
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 顶部栏调整 */
  .top-bar {
    padding: 8px 16px;
  }

  /* 搜索框调整 */
  .search-bar {
    flex: 1;
    max-width: none;
  }

  .search-bar :deep(.t-input) {
    width: 100% !important;
    height: 38px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid transparent;
    font-size: 14px;
  }

  .search-bar :deep(.t-input__inner) {
    padding: 0 12px;
  }

  .search-bar :deep(.t-input:focus) {
    background: white;
    border: 1px solid var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 82, 217, 0.15);
  }

  .search-bar :deep(.t-input__prefix) {
    margin-left: 8px;
  }

  .search-bar :deep(.t-icon) {
    font-size: 18px;
  }

  /* 用户名文本隐藏 */
  .user-info-trigger .username {
    display: none;
  }

  /* 面包屑导航调整 */
  .breadcrumb-nav {
    padding: 10px 16px;
  }

  .breadcrumb-nav :deep(.t-breadcrumb__item) {
    font-size: 13px;
  }

  /* 页面标题区域调整 */
  .page-header {
    padding: 16px 16px 10px;
  }

  .page-title {
    font-size: 18px;
  }

  .page-meta {
    font-size: 12px;
    margin: 6px 0 0 30px;
  }

  /* 工具栏调整 */
  .section-toolbar {
    padding: 6px 16px;
  }

  .toolbar-right :deep(.t-button) {
    font-size: 13px;
    padding: 4px 8px;
  }

  /* 表格区域调整 */
  /* 隐藏桌面端表格，显示移动端列表 */
  .desktop-table {
    display: none !important;
  }

  .mobile-list-view {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px 16px;
    flex: 1;
    overflow-y: auto;
    background: var(--bg-gray-2);
  }

  /* 移动端文档卡片 */
  .mobile-doc-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: white;
    border-radius: var(--radius-small);
    transition: all var(--transition-fast);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .mobile-doc-item:active {
    transform: scale(0.98);
    background: var(--bg-gray-1);
  }

  .mobile-doc-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }

  .mobile-doc-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mobile-doc-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-doc-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-tertiary);
  }

  .mobile-doc-time {
    flex-shrink: 0;
  }

  .mobile-doc-creator {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-doc-creator::before {
    content: "·";
    margin-right: 8px;
  }

  .mobile-doc-action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: -8px -4px -8px 0;
  }

  .mobile-action-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
  }

  .mobile-action-icon:active {
    background: rgba(0, 0, 0, 0.06);
  }

  /* 空状态 */
  .mobile-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-tertiary);
    font-size: 14px;
    padding: 40px 20px;
    text-align: center;
  }

  /* 表格行调整 */
  .table-view :deep(.t-table__body tr) {
    height: 48px;
  }

  .table-view :deep(.t-table__body td) {
    padding: 10px 12px;
  }

  .table-view :deep(.t-table__header th) {
    padding: 8px 12px;
    font-size: 12px;
  }

  /* 文档标题单元格调整 */
  .doc-title-cell {
    gap: 10px;
  }

  .doc-title-cell :deep(.t-icon) {
    font-size: 20px !important;
  }

  .doc-name {
    font-size: 13px !important;
  }

  /* 操作图标调整 */
  .action-more-icon {
    width: 32px;
    height: 32px;
  }

  .action-more-icon .t-icon {
    font-size: 20px;
  }
}

/* ===== 超小屏幕适配 (480px以下) ===== */
@media (max-width: 480px) {
  /* 主内容区域适配底部Tab栏 */
  .main-content {
    padding-bottom: 52px;
  }

  /* 顶部栏进一步压缩 */
  .top-bar {
    padding: 6px 12px;
  }

  .mobile-menu-btn {
    width: 36px !important;
    height: 36px !important;
    margin-right: 6px;
  }

  /* 搜索框进一步优化 */
  .search-bar :deep(.t-input) {
    height: 36px;
    border-radius: 18px;
    font-size: 13px;
  }

  .search-bar :deep(.t-input__inner) {
    padding: 0 10px;
  }

  .search-bar :deep(.t-input__prefix) {
    margin-left: 6px;
  }

  .search-bar :deep(.t-icon) {
    font-size: 16px;
  }

  /* 隐藏用户信息（已移至侧边栏） */
  .user-info-trigger {
    display: none !important;
  }

  /* 隐藏用户信息前的分隔线 */
  .top-bar-right .divider-vertical:last-of-type {
    display: none !important;
  }

  /* 面包屑导航 */
  .breadcrumb-nav {
    padding: 8px 12px;
  }

  .breadcrumb-nav :deep(.t-breadcrumb__item) {
    font-size: 12px;
  }

  .breadcrumb-nav :deep(.t-icon) {
    font-size: 14px;
  }

  /* 页面标题区域 */
  .page-header {
    padding: 12px 12px 8px;
  }

  .page-title {
    font-size: 16px;
  }

  .page-title-wrapper :deep(.t-icon) {
    font-size: 18px !important;
  }

  .page-meta {
    font-size: 11px;
    margin: 4px 0 0 26px;
  }

  /* 工具栏 */
  .section-toolbar {
    padding: 4px 12px;
  }

  .toolbar-right :deep(.t-button) {
    font-size: 12px;
    padding: 3px 6px;
  }

  /* 表格区域 */
  /* 移动端列表进一步压缩 */
  .mobile-list-view {
    padding: 10px 12px 12px;
    gap: 6px;
  }

  .mobile-doc-item {
    padding: 10px;
    gap: 10px;
  }

  .mobile-doc-icon {
    width: 44px;
    height: 44px;
  }

  .mobile-doc-icon :deep(.t-icon) {
    font-size: 28px !important;
  }

  .mobile-doc-title {
    font-size: 14px;
  }

  .mobile-doc-meta {
    font-size: 11px;
  }

  .mobile-doc-action {
    width: 36px;
    height: 36px;
  }

  .mobile-action-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
