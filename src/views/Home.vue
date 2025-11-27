<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { useMenuStore } from '../stores/menu'
import { MessagePlugin, Icon } from 'tdesign-vue-next'
import Sidebar from '../components/Sidebar.vue'


const router = useRouter()
const documentStore = useDocumentStore()
const menuStore = useMenuStore()

// 当前激活的菜单（从 menuStore 获取）
const currentMenu = computed(() => menuStore.activeMenu)

// 用户信息
const username = computed(() => localStorage.getItem('username') || '用户')

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  MessagePlugin.success('已退出登录')
  router.push('/login')
}

// 加载文档列表
onMounted(async () => {
  await documentStore.loadDocuments()
})

const searchKeyword = ref('')
const showCreateDialog = ref(false)
const newDocTitle = ref('')
const newDocFolder = ref('默认文件夹')
const viewMode = ref<'list' | 'grid'>('list')

// 获取当前菜单的信息
const currentMenuInfo = computed(() => {
  const menuMap: Record<string, { title: string, description: string, emptyText: string }> = {
    'home': {
      title: '首页',
      description: '查看和管理你的所有文档',
      emptyText: '暂无文档，点击右上角"新建"按钮创建文档'
    },
    'favorites': {
      title: '我的收藏',
      description: '这里显示你收藏的所有文档',
      emptyText: '还没有收藏任何文档，点击文档操作菜单可以添加收藏'
    },
    'my-docs': {
      title: '我的文档',
      description: '这里显示你创建的所有文档',
      emptyText: '还没有创建任何文档，点击右上角"新建"按钮创建文档'
    },
    'shared': {
      title: '共享文档',
      description: '这里显示其他人与你共享的文档',
      emptyText: '暂无共享文档'
    },
    'trash': {
      title: '回收站',
      description: '这里显示已删除的文档，30天后将永久删除',
      emptyText: '回收站是空的'
    }
  }
  return menuMap[currentMenu.value] || menuMap['home']
})

// 根据当前菜单过滤文档
const filteredDocuments = computed(() => {
  let docs = documentStore.documents

  // 根据不同菜单过滤
  switch (currentMenu.value) {
    case 'favorites':
      // 我的收藏 - 这里需要后端支持收藏字段
      docs = docs.filter(doc => (doc as any).isFavorite)
      break
    case 'my-docs':
      // 我的文档 - 显示当前用户创建的文档
      docs = docs.filter(doc => doc.creator === username.value || !doc.creator)
      break
    case 'shared':
      // 共享文档 - 这里需要后端支持共享字段
      docs = docs.filter(doc => (doc as any).isShared)
      break
    case 'trash':
      // 回收站 - 这里需要后端支持删除标记
      docs = docs.filter(doc => (doc as any).isDeleted)
      break
    default:
      // 首页 - 显示所有文档
      docs = documentStore.documents
  }

  // 应用搜索过滤
  if (searchKeyword.value) {
    docs = docs.filter(doc =>
      doc.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  return docs
})

// 创建文档
const handleCreateDocument = async () => {
  if (!newDocTitle.value.trim()) {
    MessagePlugin.warning('请输入文档标题')
    return
  }

  const doc = await documentStore.createDocument(newDocTitle.value, 'document', newDocFolder.value)

  if (doc) {
    MessagePlugin.success('文档创建成功')

    // 重置表单
    newDocTitle.value = ''
    newDocFolder.value = '默认文件夹'
    showCreateDialog.value = false

    // 跳转到编辑页面
    router.push(`/document/${doc.id}`)
  } else {
    MessagePlugin.error(documentStore.error || '创建文档失败')
  }
}

// 打开文档或文件夹
const openDocument = (id: string) => {
  const doc = documentStore.documents.find(d => d.id === id)
  if (doc?.type === 'folder') {
    // 文件夹暂时不支持导航，显示提示
    MessagePlugin.info('文件夹功能开发中...')
    return
  } else if (doc?.type === 'spreadsheet') {
    router.push(`/spreadsheet/${id}`)
  } else if (doc?.type === 'mindmap') {
    router.push(`/mindmap/${id}`)
  } else {
    router.push(`/document/${id}`)
  }
}

// 删除文档
const deleteDocument = async (id: string, title: string) => {
  if (confirm(`确定要删除文档「${title}」吗？此操作不可恢复。`)) {
    await documentStore.deleteDocument(id)
    if (!documentStore.error) {
      MessagePlugin.success('文档已删除')
    } else {
      MessagePlugin.error(documentStore.error)
    }
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

// 根据文件类型获取图标和颜色
const getFileIcon = (type: string) => {
  const iconMap: Record<string, { icon: string, color: string }> = {
    'document': { icon: 'file-text', color: '#5B8FF9' },      // 蓝色 - 文档
    'spreadsheet': { icon: 'table', color: '#1D7F3E' },       // 绿色 - 表格
    'mindmap': { icon: 'root-list', color: '#8B5CF6' },       // 紫色 - 思维导图
    'pdf': { icon: 'file-pdf', color: '#E02E24' },            // 红色 - PDF
    'word': { icon: 'file-word', color: '#2B579A' },          // 深蓝色 - Word
    'folder': { icon: 'folder', color: '#FAAD14' },           // 橙色 - 文件夹
    'image': { icon: 'image', color: '#F5A623' },             // 橙色 - 图片
    'slide': { icon: 'play-circle', color: '#D24726' },       // 红橙色 - 幻灯片
    'flowchart': { icon: 'chart-bubble', color: '#00A870' },  // 绿色 - 流程图
    'whiteboard': { icon: 'edit', color: '#0052D9' }          // 蓝色 - 白板
  }
  return iconMap[type] || { icon: 'file', color: '#8C8C8C' }
}

// 新建菜单选项
const createMenuOptions = [
  { content: '文件夹', value: 'folder', prefixIcon: h(Icon, { name: 'folder' }) },
  { content: '文档', value: 'document', prefixIcon: h(Icon, { name: 'file-text' }) },
  { content: '表格', value: 'spreadsheet', prefixIcon: h(Icon, { name: 'table' }) },
  { content: '幻灯片', value: 'slide', prefixIcon: h(Icon, { name: 'play-circle' }) },
  { content: '流程图', value: 'flowchart', prefixIcon: h(Icon, { name: 'chart-bubble' }) },
  { content: '思维导图', value: 'mindmap', prefixIcon: h(Icon, { name: 'root-list' }) },
  { content: '白板', value: 'whiteboard', prefixIcon: h(Icon, { name: 'edit' }) }
]

// 处理新建菜单点击
const handleCreateMenuClick = async (data: any) => {
  const type = data.value
  const typeNames: Record<string, string> = {
    folder: '文件夹',
    document: '文档',
    spreadsheet: '表格',
    slide: '幻灯片',
    flowchart: '流程图',
    mindmap: '思维导图',
    whiteboard: '白板'
  }

  // 根据类型创建不同的文档
  if (type === 'folder') {
    MessagePlugin.info('文件夹功能开发中...')
    return
  }

  if (type === 'slide' || type === 'flowchart' || type === 'whiteboard') {
    MessagePlugin.info(`${typeNames[type]}功能开发中...`)
    return
  }

  // 创建文档/表格/思维导图
  const defaultTitle = `未命名${typeNames[type]}`
  const doc = await documentStore.createDocument(defaultTitle, type, '默认文件夹')

  if (doc) {
    MessagePlugin.success(`${typeNames[type]}创建成功`)

    // 根据类型跳转到相应页面
    if (type === 'spreadsheet') {
      router.push(`/spreadsheet/${doc.id}`)
    } else if (type === 'mindmap') {
      router.push(`/mindmap/${doc.id}`)
    } else {
      router.push(`/document/${doc.id}`)
    }
  } else {
    MessagePlugin.error(documentStore.error || `创建${typeNames[type]}失败`)
  }
}

// 打开协同编辑演示 - 暂时注释掉
// const handleCollaborativeDemoClick = (data: any) => {
//   if (data.value === 'document') {
//     router.push('/collaborative-demo')
//   } else if (data.value === 'mindmap') {
//     router.push('/collaborative-mindmap-demo')
//   } else if (data.value === 'spreadsheet') {
//     router.push('/collaborative-spreadsheet-demo')
//   }
// }

// 获取当前菜单图标
const getCurrentMenuIcon = () => {
  const iconMap: Record<string, string> = {
    'home': 'home',
    'favorites': 'star',
    'my-docs': 'folder',
    'shared': 'usergroup',
    'trash': 'delete'
  }
  return iconMap[currentMenu.value] || 'home'
}

// 获取最近更新数量（7天内）
const getRecentUpdateCount = () => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return filteredDocuments.value.filter(doc => doc.updatedAt > sevenDaysAgo).length
}

// 获取我的创建文档数量
const getMyDocCount = () => {
  return documentStore.documents.filter(doc =>
    doc.creator === username.value || !doc.creator
  ).length
}

// 表格列配置
const columns: any[] = [
  {
    colKey: 'title',
    title: '名称',
    width: '35%',
    cell: (h: any, { row }: any) => {
      const fileIcon = getFileIcon(row.type || 'document')
      return h('div', { class: 'doc-title-cell', style: { display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px' } }, [
        h(Icon, {
          name: fileIcon.icon,
          style: { fontSize: '24px', color: fileIcon.color, flexShrink: '0' }
        }),
        h('div', { class: 'doc-info', style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          h('span', { class: 'doc-name', style: { fontSize: '14px', color: '#1f1f1f', fontWeight: '500' } }, row.title),
          row.folder && h('span', { class: 'doc-folder', style: { fontSize: '12px', color: '#999999' } }, row.folder)
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
  { colKey: 'actions', title: '操作', width: '11%' }
]
</script>

<template>
  <div class="document-list-page">
    <Sidebar />

    <div class="main-content">
      <!-- 顶部栏 -->
      <div class="top-bar">
        <div class="top-bar-left">
          <div class="search-bar">
            <t-input
              v-model="searchKeyword"
              placeholder="搜索文档、文件夹..."
              clearable
              size="large"
            >
              <template #prefix-icon>
                <t-icon name="search" />
              </template>
              <template #suffix>
                <span class="keyboard-hint">⌘K</span>
              </template>
            </t-input>
          </div>
        </div>

        <div class="top-bar-right">
          <t-button variant="text" shape="square" class="icon-button">
            <t-icon name="notification" />
          </t-button>

          <t-button variant="text" shape="square" class="icon-button">
            <t-icon name="help-circle" />
          </t-button>

          <div class="divider-vertical"></div>

          <t-button variant="outline" class="import-btn">
            <template #icon><t-icon name="download" /></template>
            导入
          </t-button>

          <!-- 协同编辑演示 - 暂时注释掉 -->
          <!-- <t-dropdown
            :options="[
              { content: '文档协同编辑', value: 'document', prefixIcon: () => h(Icon, { name: 'file-text' }) },
              { content: '思维导图协同编辑', value: 'mindmap', prefixIcon: () => h(Icon, { name: 'chart-bubble' }) },
              { content: '表格协同编辑', value: 'spreadsheet', prefixIcon: () => h(Icon, { name: 'table' }) }
            ]"
            @click="handleCollaborativeDemoClick"
            trigger="hover"
          >
            <t-button variant="outline" class="collab-demo-btn">
              <template #icon><t-icon name="usergroup" /></template>
              协同编辑演示
              <template #suffix><t-icon name="chevron-down" size="16px" /></template>
            </t-button>
          </t-dropdown> -->

          <!-- 新建下拉菜单 -->
          <t-dropdown
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
            @click="(data: any) => {
              if (data.value === 'logout') handleLogout()
            }"
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
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 页面标题区域 -->
        <div class="page-header">
          <div class="page-title-wrapper">
            <div class="title-section">
              <h2 class="page-title">{{ currentMenuInfo.title }}</h2>
            </div>
            <div class="header-actions">
              <t-button variant="text" size="small" class="action-link">
                <template #icon><t-icon name="refresh" /></template>
                刷新
              </t-button>
              <t-button variant="text" size="small" class="action-link">
                <template #icon><t-icon name="setting" /></template>
                设置
              </t-button>
            </div>
          </div>
        </div>

        <!-- 文档列表区域 -->
        <div class="documents-section">
          <div class="section-toolbar">
            <div class="toolbar-left">
              <t-button variant="text" size="small" class="filter-btn">
                <template #icon><t-icon name="filter" /></template>
                筛选
              </t-button>
              <t-button variant="text" size="small" class="filter-btn">
                <template #icon><t-icon name="sort-descending" /></template>
                排序
              </t-button>
            </div>
            <div class="toolbar-right">
              <t-button variant="text" size="small" class="filter-btn">
                <template #icon><t-icon name="user" /></template>
                创建者
              </t-button>
              <t-button variant="text" size="small" class="filter-btn">
                <template #icon><t-icon name="folder" /></template>
                全部文件
              </t-button>
              <div class="view-mode-buttons">
                <t-button
                  variant="text"
                  size="small"
                  :class="{ 'is-active': viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  class="view-mode-btn"
                >
                  <t-icon name="view-list" />
                </t-button>
                <t-button
                  variant="text"
                  size="small"
                  :class="{ 'is-active': viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  class="view-mode-btn"
                >
                  <t-icon name="view-module" />
                </t-button>
              </div>
            </div>
          </div>

          <!-- 文档内容 -->
          <div class="documents-content">
            <!-- 表格视图 -->
            <div v-if="viewMode === 'list'" class="table-view">
              <t-table
              :data="filteredDocuments"
              :columns="columns"
              row-key="id"
              :empty="filteredDocuments.length === 0 ? currentMenuInfo.emptyText : undefined"
              @row-dblclick="(e: any) => openDocument(e.row.id)"
              max-height="100%"
              :bordered="false"
            >
              <template #actions="{ row }">
                <t-dropdown
                  :options="[
                    { content: '打开', value: 'open' },
                    { content: '删除', value: 'delete', theme: 'error' }
                  ]"
                  @click="(data: any) => {
                    if (data.value === 'open') openDocument(row.id)
                    if (data.value === 'delete') deleteDocument(row.id, row.title)
                  }"
                >
                  <span class="action-more-icon" @click.stop>
                    <t-icon name="ellipsis" />
                  </span>
                </t-dropdown>
              </template>
            </t-table>
            </div>

            <!-- 网格视图 -->
            <div v-else class="grid-view">
              <div
                v-for="doc in filteredDocuments"
                :key="doc.id"
                class="document-card"
                @dblclick="openDocument(doc.id)"
              >
                <div class="card-header">
                    <t-icon
                      :name="getFileIcon(doc.type || 'document').icon"
                      :style="{ fontSize: '24px', color: getFileIcon(doc.type || 'document').color }"
                    />
                    <t-dropdown
                      :options="[
                        { content: '打开', value: 'open' },
                        { content: '删除', value: 'delete', theme: 'error' }
                      ]"
                      @click="(data: any) => {
                        if (data.value === 'open') openDocument(doc.id)
                        if (data.value === 'delete') deleteDocument(doc.id, doc.title)
                      }"
                    >
                      <span class="action-more-icon" @click.stop>
                        <t-icon name="ellipsis" />
                      </span>
                    </t-dropdown>
                  </div>

                  <div class="card-body">
                    <h4 class="doc-title">{{ doc.title }}</h4>
                    <div class="doc-preview" v-html="doc.content.substring(0, 100) || '空白文档'"></div>
                  </div>

                  <div class="card-footer">
                    <span class="time">{{ formatTime(doc.updatedAt) }}</span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 创建文档对话框 -->
      <t-dialog
        v-model:visible="showCreateDialog"
        header="创建新文档"
        width="500px"
        @confirm="handleCreateDocument"
      >
        <t-form :data="{ title: newDocTitle, folder: newDocFolder }" layout="vertical">
          <t-form-item label="文档标题" name="title">
            <t-input v-model="newDocTitle" placeholder="请输入文档标题" />
          </t-form-item>
          <t-form-item label="所属文件夹" name="folder">
            <t-input v-model="newDocFolder" placeholder="请输入文件夹名称" />
          </t-form-item>
        </t-form>
      </t-dialog>
    </div>
  </div>
</template>

<style scoped>
.document-list-page {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-white);
}

/* Apple 风格顶部栏 - 毛玻璃效果 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 32px;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  flex-shrink: 0;
  height: 56px;
}

.top-bar-left {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 600px;
}

.search-bar {
  flex: 1;
}

/* Apple 风格搜索框 */
.search-bar :deep(.t-input) {
  border-radius: var(--radius-medium);
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.04);
  transition: all var(--transition-fast);
  height: 36px;
}

.search-bar :deep(.t-input:hover) {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.12);
}

.search-bar :deep(.t-input:focus) {
  background: var(--bg-white);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.search-bar :deep(.t-input__prefix) {
  color: var(--text-tertiary);
}

.search-bar :deep(.t-input:focus .t-input__prefix) {
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

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Apple 风格图标按钮 */
.icon-button {
  width: 36px !important;
  height: 36px !important;
  border-radius: 18px !important;
  color: var(--text-secondary) !important;
  transition: all var(--transition-fast) !important;
}

.icon-button:hover {
  background: rgba(0, 0, 0, 0.06) !important;
  color: var(--text-primary) !important;
}

.icon-button :deep(.t-icon) {
  font-size: 19px;
}

/* Apple 风格分割线 */
.divider-vertical {
  width: 1px;
  height: 20px;
  background: var(--border-color-2);
  margin: 0 8px;
  opacity: 0.5;
}

/* Apple 风格导入按钮 */
.import-btn {
  border-radius: var(--radius-medium) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: var(--text-primary) !important;
  font-weight: 500 !important;
  height: 32px !important;
  padding: 0 14px !important;
  transition: all var(--transition-fast) !important;
  font-size: 13px !important;
}

.import-btn:hover {
  background: rgba(0, 0, 0, 0.04) !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
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

.content-area {
  flex: 1;
  overflow: hidden;
  background: #FFFFFF;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 飞书/钉钉风格的页面标题区域 */
/* Apple 风格页面标题区域 */
.page-header {
  padding: 16px 32px 12px;
  background: var(--bg-white);
  flex-shrink: 0;
}

.page-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -1px;
  font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* 标题右侧操作按钮 */
.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-link {
  padding: 6px 12px !important;
  border-radius: 6px !important;
  color: var(--text-secondary) !important;
  font-size: 13px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.action-link:hover {
  background: rgba(0, 82, 217, 0.06) !important;
  color: var(--primary-color) !important;
}

.action-link :deep(.t-icon) {
  font-size: 16px;
}

/* 飞书风格的统计数据栏 */
.header-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #E3E6EB;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1;
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: linear-gradient(180deg, transparent 0%, #E3E6EB 50%, transparent 100%);
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
  padding: 8px 24px;
  background: white;
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

/* 飞书/钉钉风格的筛选按钮 */
.filter-btn {
  padding: 6px 12px !important;
  border-radius: 6px !important;
  color: var(--text-secondary) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid transparent !important;
}

.filter-btn:hover {
  background: rgba(0, 82, 217, 0.06) !important;
  color: var(--primary-color) !important;
  border-color: rgba(0, 82, 217, 0.1) !important;
}

.filter-btn :deep(.t-icon) {
  font-size: 16px;
  margin-right: 4px;
}

/* 视图切换按钮组 - 飞书风格 */
.view-mode-buttons {
  display: flex;
  gap: 4px;
  background: #F7F8FA;
  padding: 4px;
  border-radius: 8px;
  margin-left: 8px;
}

.view-mode-btn {
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  border-radius: 6px !important;
  color: var(--text-tertiary) !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.view-mode-btn :deep(.t-icon) {
  font-size: 18px;
}

.view-mode-btn:hover {
  background: rgba(0, 82, 217, 0.08) !important;
  color: var(--primary-color) !important;
}

.view-mode-btn.is-active {
  background: white !important;
  color: var(--primary-color) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
}

.documents-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  background: white;
}

.table-view {
  flex: 1;
  overflow: hidden;
  padding: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 飞书风格滚动条 */
.table-view::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-view::-webkit-scrollbar-track {
  background: transparent;
}

.table-view::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

.table-view::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

/* 飞书风格表格 */
.table-view :deep(.t-table__body tr) {
  height: 56px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-view :deep(.t-table__body tr:hover) {
  background: #F7F8FA !important;
  transform: scale(1.002);
}

.table-view :deep(.t-table__body td) {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.table-view :deep(.t-table__header th) {
  background: #F5F7FA;
  color: #8F959E;
  font-weight: 500;
  font-size: 13px;
  padding: 12px 16px;
  border-bottom: 1px solid #E3E6EB;
}

.table-view :deep(.t-table__header th:first-child) {
  padding-left: 24px;
}

.table-view :deep(.t-table) {
  border: none;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  background: white;
  height: 100%;
}

.table-view :deep(.t-table__content) {
  height: 100%;
}

.table-view :deep(.t-table__body) {
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.table-view :deep(.t-table__body)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-view :deep(.t-table__body)::-webkit-scrollbar-track {
  background: transparent;
}

.table-view :deep(.t-table__body)::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

.table-view :deep(.t-table__body)::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
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
  color: #1F2329;
  font-weight: 500;
}

.doc-tags {
  display: flex;
  gap: 4px;
}

/* 操作按钮 - 飞书风格 */
.action-more-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #8F959E;
}

.action-more-icon:hover {
  background: rgba(0, 82, 217, 0.08);
  color: #0052D9;
  transform: scale(1.1);
}

.action-more-icon .t-icon {
  font-size: 18px;
}

.grid-view {
  flex: 1;
  overflow: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  align-content: start;
  min-height: 0;
}

/* 飞书风格滚动条 */
.grid-view::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.grid-view::-webkit-scrollbar-track {
  background: transparent;
}

.grid-view::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

.grid-view::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

/* 飞书/钉钉风格的卡片 */
.document-card {
  background: white;
  border: 1px solid #E5E5EA;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.document-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  opacity: 0;
  transition: opacity 0.2s;
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--primary-color);
}

.document-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.doc-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-preview {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-height: 4.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.doc-preview :deep(*) {
  margin: 0;
  padding: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-tertiary);
  padding-top: 14px;
  border-top: 1px solid var(--border-color-2);
  margin-top: auto;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #8F959E;
}

.empty-state .t-icon {
  opacity: 0.3;
}

.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}
</style>
