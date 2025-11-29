<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '../../stores/document'
import { useMenuStore } from '../../stores/menu'
import { MessagePlugin, Icon } from 'tdesign-vue-next'
import BottomTabBar from '../../components/BottomTabBar.vue'
import TopBar from '../../components/TopBar.vue'
import { useDevice } from '../../composables/useDevice'

const props = defineProps<{
  sidebarVisible?: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const router = useRouter()
const documentStore = useDocumentStore()
const menuStore = useMenuStore()

// 设备检测
const { isMobile, deviceType } = useDevice()

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

// 基本设置
const handleSettingsClick = () => {
  MessagePlugin.info('基本设置功能开发中...')
}

// 关于我们
const handleAboutClick = () => {
  MessagePlugin.info('关于我们功能开发中...')
}

// 加载文档列表
onMounted(async () => {
  await documentStore.loadDocuments()
})

const searchKeyword = ref('')
const showSearchPanel = ref(false)
const showCreateDialog = ref(false)
const newDocTitle = ref('')
const newDocFolder = ref('默认文件夹')

// 主页子标签控制
const activeSubTab = ref('my-docs')

// 移动端新建菜单控制
const showCreateMenu = ref(false)
const toggleCreateMenu = () => {
  showCreateMenu.value = !showCreateMenu.value
}

const closeCreateMenu = () => {
  showCreateMenu.value = false
}

// 搜索更新处理
const handleSearchUpdate = (value: string) => {
  searchKeyword.value = value
}

// 搜索结果点击处理
const handleSearchResultClick = (doc: any) => {
  openDocument(doc.id)
}

// 获取当前菜单的信息
const currentMenuInfo = computed(() => {
  const menuMap: Record<string, { title: string, description: string, emptyText: string }> = {
    'home': {
      title: '主页',
      description: '查看和管理你的所有文档',
      emptyText: '暂无文档'
    },
    'cloud': {
      title: '云盘',
      description: '查看和管理你的云盘文件',
      emptyText: '云盘为空'
    },
    'favorites': {
      title: '知识库',
      description: '这里显示你的知识库文档',
      emptyText: '暂无知识库文档'
    },
    'my-docs': {
      title: '最近访问',
      description: '这里显示你最近访问的所有文档',
      emptyText: '暂无文档'
    },
    'shared': {
      title: '与我共享',
      description: '这里显示其他人与你共享的文档',
      emptyText: '暂无共享文档'
    },
    'permission': {
      title: '权限管理',
      description: '管理用户权限和访问控制',
      emptyText: '暂无权限配置'
    },
    'trash': {
      title: '回收站',
      description: '这里显示你删除的文档',
      emptyText: '回收站为空'
    },
    'my': {
      title: '我的',
      description: '个人中心',
      emptyText: ''
    }
  }
  return menuMap[currentMenu.value] || menuMap['home']
})

// 根据当前菜单过滤文档
const filteredDocuments = computed(() => {
  let docs = documentStore.documents

  // 根据不同菜单过滤
  switch (currentMenu.value) {
    case 'home':
      // 主页 - 根据子标签过滤
      switch (activeSubTab.value) {
        case 'my-docs':
          // 最近访问 - 显示当前用户创建的文档
          docs = docs.filter(doc => doc.creator === username.value || !doc.creator)
          break
        case 'shared':
          // 与我共享 - 这里需要后端支持共享字段
          docs = docs.filter(doc => (doc as any).isShared)
          break
        case 'trash':
          // 收藏 - 这里需要后端支持收藏字段
          docs = docs.filter(doc => (doc as any).isFavorite)
          break
        default:
          docs = documentStore.documents
      }
      break
    case 'cloud':
      // 云盘 - 显示所有文档
      docs = documentStore.documents
      break
    case 'favorites':
      // 我的收藏 - 这里需要后端支持收藏字段
      docs = docs.filter(doc => (doc as any).isFavorite)
      break
    case 'my-docs':
      // 最近访问 - 显示当前用户创建的文档
      docs = docs.filter(doc => doc.creator === username.value || !doc.creator)
      break
    case 'shared':
      // 与我共享 - 这里需要后端支持共享字段
      docs = docs.filter(doc => (doc as any).isShared)
      break
    case 'permission':
      // 权限管理 - 不显示文档列表
      docs = []
      break
    case 'my':
      // 我的 - 不显示文档列表
      docs = []
      break
    default:
      // 默认显示所有文档
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

// 搜索面板结果 - 在所有文档中搜索
const searchResults = computed(() => {
  let docs = documentStore.documents.filter(doc => doc.type !== 'folder')

  if (searchKeyword.value.trim()) {
    // 有搜索关键词时，在标题、内容、文件夹中搜索
    const keyword = searchKeyword.value.toLowerCase().trim()
    docs = docs.filter(doc => {
      const titleMatch = doc.title.toLowerCase().includes(keyword)
      const folderMatch = doc.folder?.toLowerCase().includes(keyword)
      const contentMatch = doc.content?.toLowerCase().includes(keyword)
      return titleMatch || folderMatch || contentMatch
    })
  } else {
    // 无搜索关键词时，显示最近访问的文档（按更新时间排序）
    docs = docs
      .filter(doc => doc.creator === username.value || !doc.creator)
      .sort((a, b) => {
        const timeA = typeof a.updatedAt === 'string' ? new Date(a.updatedAt).getTime() : a.updatedAt
        const timeB = typeof b.updatedAt === 'string' ? new Date(b.updatedAt).getTime() : b.updatedAt
        return timeB - timeA
      })
  }

  return docs
})

// 创建文档
const handleCreateDocument = async () => {
  // 如果从卡片点击进来，直接创建文档
  if (!showCreateDialog.value) {
    const doc = await documentStore.createDocument('无标题文档', 'document', '默认文件夹')
    if (doc) {
      MessagePlugin.success('文档创建成功')
      // 跳转到编辑页面
      router.push(`/document/${doc.id}`)
    } else {
      MessagePlugin.error(documentStore.error || '创建文档失败')
    }
    return
  }

  // 如果从对话框创建
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

// 上传文件
const handleUpload = () => {
  MessagePlugin.info('上传功能开发中...')
}

// 模版库
const handleTemplates = () => {
  MessagePlugin.info('模版库功能开发中...')
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

// 新建菜单选项
const createMenuOptions = [
  { content: '文档', value: 'document', prefixIcon: h(Icon, { name: 'file-copy' }) },
  { content: '表格', value: 'spreadsheet', prefixIcon: h(Icon, { name: 'table' }) },
  { content: '幻灯片', value: 'slide', prefixIcon: h(Icon, { name: 'play-circle' }) },
  { content: '流程图', value: 'flowchart', prefixIcon: h(Icon, { name: 'chart-bubble' }) },
  { content: '思维导图', value: 'mindmap', prefixIcon: h(Icon, { name: 'root-list' }) },
  { content: '白板', value: 'whiteboard', prefixIcon: h(Icon, { name: 'edit' }) },
  { divider: true },
  { content: '文件夹', value: 'folder', prefixIcon: h(Icon, { name: 'folder' }) }
]

// 处理新建菜单点击
const handleCreateMenuClick = async (data: any) => {
  const type = typeof data === 'string' ? data : data.value
  closeCreateMenu() // 关闭移动端菜单

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
    width: '45%',
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
    width: '18%',
    cell: (h: any, { row }: any) => h('span', formatTime(row.updatedAt))
  },
  {
    colKey: 'updater',
    title: '更新者',
    width: '15%',
    cell: (h: any, { row }: any) => h('span', row.updater || '未知')
  },
  {
    colKey: 'createdAt',
    title: '创建时间',
    width: '18%',
    cell: (h: any, { row }: any) => h('span', formatTime(row.createdAt))
  },
  { colKey: 'actions', title: '操作', width: '14%' }
]
</script>

<template>
  <div class="document-list-page" :class="`device-${deviceType}`">
    <div class="main-content">
      <!-- 顶部栏 -->
      <TopBar
        :sidebar-visible="props.sidebarVisible"
        :page-title="currentMenuInfo.title"
        search-placeholder="搜索文档、文件夹..."
        :search-results="searchResults"
        @toggle-sidebar="toggleSidebar"
        @search-update="handleSearchUpdate"
        @result-click="handleSearchResultClick"
      >
        <template #search-title>
          {{ searchKeyword.trim() ? `搜索结果 (${searchResults.length})` : '最近访问' }}
        </template>
        <template #search-result-item="{ item }">
          <div class="result-icon">
            <t-icon :name="getFileIcon(item.type || 'document').icon" :style="{ color: getFileIcon(item.type || 'document').color }" />
          </div>
          <div class="result-content">
            <div class="result-title">{{ item.title }}</div>
            <div class="result-meta">
              <span>{{ item.folder }}</span>
              <span class="result-dot">·</span>
              <span>{{ formatTime(item.updatedAt) }}</span>
            </div>
          </div>
          <div class="result-action">
            <t-icon name="chevron-right" />
          </div>
        </template>
      </TopBar>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 文档列表区域 -->
        <div class="documents-section">
          <!-- 主页功能卡片 -->
          <div v-if="currentMenu === 'home'" class="feature-cards">
            <div class="feature-card" @click="handleCreateDocument">
              <div class="feature-card-icon">
                <t-icon name="add" size="20px" />
              </div>
              <div class="feature-card-content">
                <div class="feature-card-title">新建</div>
                <div class="feature-card-desc">创建新文档</div>
              </div>
            </div>
            <div class="feature-card" @click="handleUpload">
              <div class="feature-card-icon">
                <t-icon name="upload" size="20px" />
              </div>
              <div class="feature-card-content">
                <div class="feature-card-title">上传</div>
                <div class="feature-card-desc">上传本地文件</div>
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
          </div>

          <!-- 主页子标签 -->
          <div v-if="currentMenu === 'home'" class="sub-tabs">
            <div
              :class="['sub-tab-item', { active: activeSubTab === 'my-docs' }]"
              @click="activeSubTab = 'my-docs'"
            >
              最近访问
            </div>
            <div
              :class="['sub-tab-item', { active: activeSubTab === 'shared' }]"
              @click="activeSubTab = 'shared'"
            >
              与我共享
            </div>
            <div
              :class="['sub-tab-item', { active: activeSubTab === 'trash' }]"
              @click="activeSubTab = 'trash'"
            >
              回收站
            </div>
          </div>

          <div class="section-toolbar" v-if="currentMenu !== 'home' && currentMenu !== 'cloud' && currentMenu !== 'permission'">
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
            </div>
          </div>

          <!-- 文档内容 -->
          <div class="documents-content">
            <!-- 我的页面 -->
            <div v-if="currentMenu === 'my'" class="my-profile-page">
              <div class="my-profile-container">
                <!-- 用户信息卡片 -->
                <div class="profile-card">
                  <t-avatar size="80px" class="profile-avatar">{{ username.charAt(0).toUpperCase() }}</t-avatar>
                  <div class="profile-name">{{ username }}</div>
                  <div class="profile-email">{{ username }}@example.com</div>
                </div>

                <!-- 菜单列表 -->
                <div class="profile-menu-list">
                  <div class="profile-menu-item" @click="handleSettingsClick">
                    <div class="menu-item-left">
                      <t-icon name="setting" class="menu-item-icon" />
                      <span class="menu-item-label">基本设置</span>
                    </div>
                    <t-icon name="chevron-right" class="menu-item-arrow" />
                  </div>
                  <div class="profile-menu-item" @click="handleAboutClick">
                    <div class="menu-item-left">
                      <t-icon name="info-circle" class="menu-item-icon" />
                      <span class="menu-item-label">关于我们</span>
                    </div>
                    <t-icon name="chevron-right" class="menu-item-arrow" />
                  </div>
                </div>

                <!-- 退出登录按钮 -->
                <t-button
                  variant="outline"
                  size="large"
                  class="logout-button"
                  block
                  @click="handleLogout"
                >
                  <template #icon><t-icon name="logout" /></template>
                  退出登录
                </t-button>
              </div>
            </div>

            <!-- 权限管理页面 -->
            <div v-else-if="currentMenu === 'permission'" class="permission-page">
              <div class="permission-container">
                <div class="permission-empty">
                  <t-icon name="user-setting" size="64px" style="color: #d9d9d9;" />
                  <p class="empty-text">权限管理功能开发中...</p>
                  <p class="empty-desc">此功能将用于管理用户权限和访问控制</p>
                </div>
              </div>
            </div>

            <!-- 桌面端：表格视图 -->
            <div v-else class="table-view desktop-table">
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

            <!-- 移动端：卡片列表视图 -->
            <div v-if="currentMenu !== 'my' && currentMenu !== 'permission'" class="mobile-list-view">
              <div
                v-for="doc in filteredDocuments"
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
                  </div>
                </div>
                <div class="mobile-doc-action">
                  <t-dropdown
                    :options="[
                      { content: '打开', value: 'open' },
                      { content: '删除', value: 'delete', theme: 'error' }
                    ]"
                    @click.stop="(data: any) => {
                      if (data.value === 'open') openDocument(doc.id)
                      if (data.value === 'delete') deleteDocument(doc.id, doc.title)
                    }"
                  >
                    <span class="mobile-action-icon" @click.stop>
                      <t-icon name="ellipsis" />
                    </span>
                  </t-dropdown>
                </div>
              </div>
              <div v-if="filteredDocuments.length === 0" class="mobile-empty">
                {{ currentMenuInfo.emptyText }}
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

    <!-- 移动端FAB新建按钮 -->
    <div v-if="isMobile" class="fab-create-btn" @click="toggleCreateMenu">
      <t-icon name="add" class="fab-icon" />
    </div>

    <!-- 移动端新建菜单遮罩 -->
    <div v-if="isMobile && showCreateMenu" class="create-menu-overlay" @click="closeCreateMenu"></div>

    <!-- 移动端新建菜单 -->
    <div v-if="isMobile" :class="['create-menu-panel', { 'show': showCreateMenu }]">
      <div class="create-menu-header">
        <h3>新建</h3>
        <t-button variant="text" shape="square" @click="closeCreateMenu">
          <t-icon name="close" />
        </t-button>
      </div>
      <div class="create-menu-content">
        <div class="create-menu-item" @click="handleCreateMenuClick('document')">
          <div class="create-menu-item-icon" style="background: rgba(0, 82, 217, 0.1);">
            <t-icon name="file-copy" style="color: #0052D9; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">文档</div>
          </div>
        </div>
        <div class="create-menu-item" @click="handleCreateMenuClick('spreadsheet')">
          <div class="create-menu-item-icon" style="background: rgba(82, 196, 26, 0.1);">
            <t-icon name="table" style="color: #52C41A; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">表格</div>
          </div>
        </div>
        <div class="create-menu-item" @click="handleCreateMenuClick('mindmap')">
          <div class="create-menu-item-icon" style="background: rgba(139, 92, 246, 0.1);">
            <t-icon name="root-list" style="color: #8B5CF6; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">思维导图</div>
          </div>
        </div>
        <div class="create-menu-item" @click="handleCreateMenuClick('slide')">
          <div class="create-menu-item-icon" style="background: rgba(210, 71, 38, 0.1);">
            <t-icon name="play-circle" style="color: #D24726; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">幻灯片</div>
          </div>
        </div>
        <div class="create-menu-item" @click="handleCreateMenuClick('flowchart')">
          <div class="create-menu-item-icon" style="background: rgba(0, 168, 112, 0.1);">
            <t-icon name="chart-bubble" style="color: #00A870; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">流程图</div>
          </div>
        </div>
        <div class="create-menu-item" @click="handleCreateMenuClick('whiteboard')">
          <div class="create-menu-item-icon" style="background: rgba(0, 82, 217, 0.1);">
            <t-icon name="edit" style="color: #0052D9; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">白板</div>
          </div>
        </div>
        <div class="create-menu-divider"></div>
        <div class="create-menu-item" @click="handleCreateMenuClick('folder')">
          <div class="create-menu-item-icon" style="background: rgba(250, 173, 20, 0.1);">
            <t-icon name="folder" style="color: #FAAD14; font-size: 16px;" />
          </div>
          <div class="create-menu-item-text">
            <div class="create-menu-item-title">文件夹</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端底部Tab栏 -->
    <BottomTabBar v-if="isMobile" />
  </div>
</template>

<style scoped>
/* 设备类型样式 */
.document-list-page {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

/* 桌面端布局 */
.device-desktop .main-content {
  padding-bottom: 0;
}

/* 移动端布局 */
.device-mobile .main-content {
  padding-bottom: 56px;
}

/* 桌面端 - Sidebar 默认显示 */
.device-desktop {
  /* 桌面端侧边栏始终可见 */
}

/* 移动端 - 隐藏不必要的元素 */
.device-mobile .desktop-only {
  display: none !important;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: var(--bg-white);
}

/* Apple 风格顶部栏 - 毛玻璃效果 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 32px;
  background: #ffffff;
  flex-shrink: 0;
  height: 56px;
  position: relative;
  z-index: 100;
  overflow: visible;
}

.top-bar-left {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 600px;
}

.search-bar {
  flex: 1;
  position: relative;
  z-index: 10000;
}

/* Apple 风格搜索框 */
.search-bar :deep(.t-input) {
  border-radius: var(--radius-medium);
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: var(--bg-white);
  transition: all var(--transition-fast);
  height: 36px;
}

.search-bar :deep(.t-input:hover) {
  background: var(--bg-white);
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

/* 搜索面板遮罩 */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 9998;
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
.search-panel {
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
  z-index: 9999;
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
  overflow: visible;
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

/* 子标签栏 */
.sub-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 32px;
  background: white;
  border-bottom: 1px solid var(--border-color-2);
  flex-shrink: 0;
}

.sub-tab-item {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sub-tab-item:hover {
  color: #1f1f1f;
}

.sub-tab-item.active {
  color: var(--primary-color);
}

/* 功能卡片 */
.feature-cards {
  display: flex;
  gap: 12px;
  padding: 16px 32px;
  background: white;
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
  border: 2px solid var(--border-color-2);
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
  border-color: var(--primary-color);
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
  background: linear-gradient(135deg, var(--primary-color) 0%, #1677FF 100%);
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
  color: var(--text-primary);
  position: relative;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feature-card-desc {
  font-size: 11px;
  color: var(--text-tertiary);
  position: relative;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 移动端列表视图 - 默认隐藏 */
.mobile-list-view {
  display: none;
}

/* 桌面端表格 */
.desktop-table {
  display: flex;
}

/* 设备类型控制显示 */
.device-mobile .desktop-table {
  display: none !important;
}

.device-mobile .mobile-list-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px 16px;
  flex: 1;
  overflow-y: auto;
  background: var(--bg-gray-2);
}

.device-desktop .mobile-list-view {
  display: none !important;
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

/* 下拉菜单样式优化 - 参考 Apple/Vercel 风格 */
:deep(.t-popup) {
  margin-top: 8px !important;
}

:deep(.t-dropdown__menu) {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  border-radius: 12px !important;
  padding: 6px !important;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
              0 4px 6px rgba(0, 0, 0, 0.05),
              0 12px 24px rgba(0, 0, 0, 0.08),
              0 24px 48px rgba(0, 0, 0, 0.08) !important;
  min-width: 220px !important;
  animation: dropdown-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

:deep(.t-dropdown__item) {
  padding: 10px 14px !important;
  margin: 2px 0 !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #000 !important;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  letter-spacing: -0.01em !important;
}

:deep(.t-dropdown__item:hover) {
  background: rgba(0, 0, 0, 0.06) !important;
  color: #000 !important;
  transform: translateX(2px) !important;
}

:deep(.t-dropdown__item:active) {
  background: rgba(0, 0, 0, 0.1) !important;
  transform: scale(0.98) translateX(2px) !important;
}

:deep(.t-dropdown__item .t-icon) {
  font-size: 16px !important;
  color: #666 !important;
  transition: color 0.15s ease !important;
}

:deep(.t-dropdown__item:hover .t-icon) {
  color: #000 !important;
}

/* 用户下拉菜单特殊样式 */
:deep(.t-dropdown__item[theme="error"]) {
  color: #ff3b30 !important;
}

:deep(.t-dropdown__item[theme="error"]:hover) {
  background: rgba(255, 59, 48, 0.08) !important;
  color: #ff3b30 !important;
}

:deep(.t-dropdown__item[theme="error"] .t-icon) {
  color: #ff3b30 !important;
}

/* 分隔线样式 */
:deep(.t-dropdown__menu .t-divider) {
  margin: 6px 0 !important;
  background: rgba(0, 0, 0, 0.08) !important;
  height: 1px !important;
}

/* 我的页面样式 */
.my-profile-page {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-gray-2);
  padding: 20px;
}

.my-profile-container {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 权限管理页面 */
.permission-page {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-gray-2);
  padding: 20px;
}

.permission-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: var(--radius-medium);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.permission-empty .empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #1f1f1f;
  margin: 16px 0 8px 0;
}

.permission-empty .empty-desc {
  font-size: 14px;
  color: #8a8a8a;
  margin: 0;
}

/* 用户信息卡片 */
.profile-card {
  background: white;
  border-radius: var(--radius-medium);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.profile-avatar {
  background: linear-gradient(135deg, var(--primary-color) 0%, #1677FF 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 32px !important;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-email {
  font-size: 14px;
  color: var(--text-tertiary);
}

/* 菜单列表 */
.profile-menu-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-menu-item {
  background: white;
  border-radius: var(--radius-small);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.profile-menu-item:active {
  background: rgba(0, 82, 217, 0.04);
  transform: scale(0.98);
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-item-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.menu-item-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.menu-item-arrow {
  font-size: 16px;
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.profile-menu-item:active .menu-item-arrow {
  transform: translateX(2px);
}

/* 退出登录按钮 */
.logout-button {
  margin-top: 8px;
  border-radius: var(--radius-small) !important;
  border-color: #ff4d4f !important;
  color: #ff4d4f !important;
  font-weight: 500 !important;
}

.logout-button:hover {
  background: rgba(255, 77, 79, 0.08) !important;
  border-color: #ff4d4f !important;
}

.logout-button:active {
  background: rgba(255, 77, 79, 0.12) !important;
  transform: scale(0.98);
}

/* FAB按钮 */
.fab-create-btn {
  position: fixed;
  bottom: 72px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.4);
  cursor: pointer;
  z-index: 102;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 桌面端隐藏FAB */
.device-desktop .fab-create-btn {
  display: none !important;
}

.fab-create-btn:active {
  transform: scale(0.9);
}

.fab-icon {
  font-size: 28px;
  color: white;
}

/* 移动端新建菜单遮罩 */
.create-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 199;
  animation: fadeIn 0.3s ease;
}

.device-desktop .create-menu-overlay {
  display: none !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 移动端新建菜单面板 */
.create-menu-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 200;
  max-height: 35vh;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
}

.device-desktop .create-menu-panel {
  display: none !important;
}

.create-menu-panel.show {
  transform: translateY(0);
}

.create-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color-2);
}

.create-menu-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.create-menu-content {
  padding: 8px 6px;
  max-height: calc(35vh - 50px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.create-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-menu-item:active {
  background: rgba(0, 82, 217, 0.08);
  transform: scale(0.95);
}

.create-menu-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.create-menu-item-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.create-menu-item-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.create-menu-item-desc {
  display: none;
}

.create-menu-divider {
  height: 1px;
  background: var(--border-color-2);
  margin: 4px 0;
  grid-column: 1 / -1;
}

/* 新建按钮特殊样式 */
.create-btn {
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
  border-radius: 10px !important;
  padding: 0 16px !important;
  height: 36px !important;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.create-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 122, 255, 0.25) !important;
}

.create-btn:active {
  transform: translateY(0) !important;
}

/* 菜单切换按钮 - 侧边栏折叠时显示 */
.menu-toggle-btn {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  border-radius: var(--radius-small) !important;
  margin-right: 12px;
  color: var(--text-primary) !important;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.menu-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.06) !important;
}

.menu-toggle-btn :deep(.t-icon) {
  font-size: 20px;
  transition: transform var(--transition-fast);
}

/* ===== 移动端适配 (768px以下) - 作为后备方案 ===== */
@media (max-width: 768px) {
  /* 主内容区域适配底部Tab栏 */
  .main-content {
    padding-bottom: 56px;
  }

  /* 顶部栏适配 */
  .top-bar {
    padding: 8px 16px;
    height: 56px;
  }

  .top-bar-left {
    max-width: none;
    gap: 8px;
  }

  .top-bar-right {
    gap: 4px;
  }

  /* 移动端隐藏菜单切换按钮 */
  .menu-toggle-btn {
    display: none !important;
  }

  /* 隐藏桌面端创建按钮 */
  .desktop-create-dropdown {
    display: none !important;
  }

  /* 搜索栏优化 */
  .search-bar {
    flex: 1;
    max-width: none;
  }

  .search-bar :deep(.t-input) {
    font-size: 14px;
    height: 38px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.05);
    border: none;
  }

  .search-bar :deep(.t-input__inner) {
    padding: 0 12px;
  }

  .search-bar :deep(.t-input:focus) {
    background: white;
    border: 1px solid var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 82, 217, 0.15);
  }

  .keyboard-hint {
    display: none;
  }

  /* 搜索面板遮罩 - 移动端 */
  .search-overlay {
    z-index: 9998;
  }

  /* 搜索面板移动端优化 */
  .search-panel {
    position: fixed;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 56px;
    max-height: none;
    border-radius: 0;
    box-shadow: none;
    background: white;
    z-index: 9999;
  }

  .search-panel-section {
    padding: 16px;
  }

  .search-section-title {
    font-size: 13px;
    padding: 8px 0;
  }

  .search-result-item {
    padding: 12px;
    border-radius: 8px;
  }

  .result-title {
    font-size: 14px;
  }

  .result-meta {
    font-size: 12px;
  }

  /* 隐藏部分按钮 */
  .icon-button:first-child {
    display: none !important;
  }

  /* 隐藏用户信息（已移至侧边栏） */
  .user-info-trigger {
    display: none !important;
  }

  /* 隐藏用户信息前的分隔线 */
  .top-bar-right .divider-vertical:last-of-type {
    display: none !important;
  }

  /* 页面标题 */
  .page-header {
    padding: 12px 16px 8px;
  }

  .page-title {
    font-size: 22px;
  }

  /* 子标签栏移动端样式 */
  .sub-tabs {
    padding: 8px 12px;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .sub-tabs::-webkit-scrollbar {
    display: none;
  }

  .sub-tab-item {
    padding: 6px 12px;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* 功能卡片移动端样式 */
  .feature-cards {
    padding: 12px 12px;
    gap: 8px;
    max-width: 100%;
  }

  .feature-card {
    padding: 10px 12px;
    gap: 10px;
  }

  .feature-card-icon {
    width: 32px;
    height: 32px;
  }

  .feature-card-icon :deep(.t-icon) {
    font-size: 18px;
  }

  .feature-card-title {
    font-size: 13px;
  }

  .feature-card-desc {
    font-size: 11px;
  }

  /* 工具栏 */
  .section-toolbar {
    padding: 6px 16px;
    flex-wrap: wrap;
  }

  .toolbar-left,
  .toolbar-right {
    gap: 4px;
  }

  /* 表格视图 - 移动端优化 */

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

  /* 搜索面板 */
  .search-panel {
    left: -8px;
    right: -8px;
  }

  /* 我的页面移动端优化 */
  .my-profile-page {
    padding: 16px;
  }

  .my-profile-container {
    gap: 12px;
  }

  .profile-card {
    padding: 24px 20px;
  }

  .profile-avatar {
    font-size: 28px !important;
  }

  .profile-name {
    font-size: 18px;
  }

  .profile-email {
    font-size: 13px;
  }

  .profile-menu-item {
    padding: 14px;
  }

  .menu-item-icon {
    font-size: 18px;
  }

  .menu-item-label {
    font-size: 14px;
  }
}

/* ===== 超小屏幕适配 (480px以下) ===== */
@media (max-width: 480px) {
  /* 主内容区域适配底部Tab栏 */
  .main-content {
    padding-bottom: 52px;
  }

  .top-bar {
    padding: 8px 12px;
  }

  .page-title {
    font-size: 18px;
  }

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

  /* 搜索框进一步优化 */
  .search-bar :deep(.t-input) {
    font-size: 13px;
    height: 36px;
    border-radius: 18px;
  }

  .search-bar :deep(.t-input__inner) {
    padding: 0 10px;
  }

  .search-bar :deep(.t-input__prefix) {
    margin-left: 8px;
  }

  .search-bar :deep(.t-icon) {
    font-size: 16px;
  }

  /* 搜索面板进一步优化 */
  .search-panel {
    top: 56px;
  }

  /* 我的页面超小屏优化 */
  .my-profile-page {
    padding: 12px;
  }

  .profile-card {
    padding: 20px 16px;
    gap: 10px;
  }

  .profile-avatar {
    width: 70px !important;
    height: 70px !important;
    font-size: 24px !important;
  }

  .profile-name {
    font-size: 16px;
  }

  .profile-email {
    font-size: 12px;
  }

  .profile-menu-item {
    padding: 12px;
  }

  .menu-item-icon {
    font-size: 16px;
  }

  .menu-item-label {
    font-size: 13px;
  }
}

</style>
