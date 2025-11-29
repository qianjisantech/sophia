<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { useMenuStore } from '../stores/menu'
import { MessagePlugin } from 'tdesign-vue-next'
import Logo from './Logo.vue'

const router = useRouter()
const documentStore = useDocumentStore()
const menuStore = useMenuStore()

// 移动端侧边栏控制
const props = defineProps<{
  visible?: boolean
  sidebarVisible?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'toggle-sidebar': []
}>()

const closeSidebar = () => {
  emit('update:visible', false)
}

// 加载文档数据
onMounted(async () => {
  await documentStore.loadDocuments()
})

// 从 localStorage 恢复展开状态
const expandedFolders = ref<string[]>(
  JSON.parse(localStorage.getItem('expandedFolders') || '[]')
)

const menuItems = [
  { key: 'home', label: '主页', icon: 'home' },
  { key: 'cloud', label: '云盘', icon: 'cloud' },
  { key: 'favorites', label: '知识库', icon: 'star' }
]

const bottomMenuItems = [
  { key: 'permission', label: '权限管理', icon: 'user-setting' },
  { key: 'trash', label: '回收站', icon: 'delete' }
]

// 计算每个文件夹内的文档数量（通过 folder 字段匹配）
const getFolderDocCount = (folderName: string) => {
  return documentStore.documents.filter(doc =>
    doc.folder === folderName && doc.type !== 'folder'
  ).length
}

// 获取文件夹内的文档列表
const getFolderDocs = (folderName: string) => {
  return documentStore.documents.filter(doc =>
    doc.folder === folderName && doc.type !== 'folder'
  )
}

// 获取文档图标
const getDocIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'document': 'file-copy',
    'spreadsheet': 'table',
    'mindmap': 'root-list',
    'pdf': 'file-pdf',
    'word': 'file-word',
    'slide': 'play-circle',
    'flowchart': 'chart-bubble',
    'whiteboard': 'edit'
  }
  return iconMap[type] || 'file'
}

// 打开文档
const openDocument = (doc: any) => {
  if (doc.type === 'spreadsheet') {
    router.push(`/spreadsheet/${doc.id}`)
  } else if (doc.type === 'mindmap') {
    router.push(`/mindmap/${doc.id}`)
  } else {
    router.push(`/document/${doc.id}`)
  }
}

const username = computed(() => localStorage.getItem('username') || '用户')

const toggleFolder = (key: string) => {
  const index = expandedFolders.value.indexOf(key)
  if (index > -1) {
    expandedFolders.value.splice(index, 1)
  } else {
    expandedFolders.value.push(key)
  }
  // 保存到 localStorage
  localStorage.setItem('expandedFolders', JSON.stringify(expandedFolders.value))
}

const handleMenuClick = (key: string) => {
  // 设置当前激活的菜单
  menuStore.setActiveMenu(key)

  // 如果是可展开的菜单项，切换展开状态
  const menuItem = menuItems.find(item => item.key === key)
  if (menuItem?.expandable) {
    toggleFolder(key)
  }

  // 根据菜单项跳转到对应路由
  if (key === 'cloud') {
    if (router.currentRoute.value.path !== '/cloud') {
      router.push('/cloud')
    }
  } else if (key === 'favorites') {
    if (router.currentRoute.value.path !== '/wiki') {
      router.push('/wiki')
    }
  } else if (key === 'permission') {
    if (router.currentRoute.value.path !== '/rbac') {
      router.push('/rbac')
    }
  } else if (key === 'trash') {
    if (router.currentRoute.value.path !== '/trash') {
      router.push('/trash')
    }
  } else {
    // 其他菜单项都跳转到 /home
    if (router.currentRoute.value.path !== '/home') {
      router.push('/home')
    }
  }
}

const handleSettingsClick = () => {
  MessagePlugin.info('基本设置功能开发中...')
  // TODO: 跳转到设置页面
  // router.push('/settings')
}

const handleAboutClick = () => {
  MessagePlugin.info('关于我们功能开发中...')
  // TODO: 跳转到关于页面或显示关于对话框
  // router.push('/about')
}

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  MessagePlugin.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <!-- 移动端遮罩层 -->
  <div v-if="visible" class="sidebar-overlay" @click="closeSidebar"></div>

  <div class="sidebar" :class="{ 'sidebar-mobile-open': visible, 'sidebar-hidden': !visible }">
    <div class="sidebar-header">
      <!-- 折叠按钮 - 桌面端显示 -->
      <t-button
        variant="text"
        shape="square"
        class="collapse-btn desktop-only"
        @click="emit('toggle-sidebar')"
      >
        <t-icon :name="sidebarVisible ? 'menu-fold' : 'menu-unfold'" />
      </t-button>
      <Logo size="medium" :showText="true" />
      <!-- 关闭按钮 - 移动端显示 -->
      <t-button
        variant="text"
        shape="square"
        class="mobile-close-btn"
        @click="closeSidebar"
      >
        <t-icon name="close" />
      </t-button>
    </div>

    <!-- 移动端个人信息区域 -->
    <div class="user-profile-section">
      <!-- 移动端菜单列表 -->
      <div class="mobile-menu-list">
        <div class="mobile-menu-item" @click="handleSettingsClick">
          <t-icon name="setting" class="mobile-menu-icon" />
          <span class="mobile-menu-label">基本设置</span>
          <t-icon name="chevron-right" class="mobile-menu-arrow" />
        </div>
        <div class="mobile-menu-item" @click="handleAboutClick">
          <t-icon name="info-circle" class="mobile-menu-icon" />
          <span class="mobile-menu-label">关于我们</span>
          <t-icon name="chevron-right" class="mobile-menu-arrow" />
        </div>
      </div>

      <div class="user-profile-content">
        <t-avatar size="56px" class="user-avatar">{{ username.charAt(0).toUpperCase() }}</t-avatar>
        <div class="user-info">
          <div class="user-name">{{ username }}</div>
          <div class="user-email">{{ username }}@example.com</div>
        </div>
      </div>

      <t-button
        variant="outline"
        size="small"
        class="logout-btn"
        @click="handleLogout"
      >
        <template #icon><t-icon name="logout" /></template>
        退出登录
      </t-button>
    </div>

    <div class="sidebar-menu">
      <template v-for="item in menuItems" :key="item.key">
        <div
          :class="['menu-item', { active: menuStore.activeMenu === item.key }]"
          @click="handleMenuClick(item.key)"
        >
          <div class="menu-item-content">
            <t-icon
              v-if="item.expandable"
              :name="expandedFolders.includes(item.key) ? 'chevron-down' : 'chevron-right'"
              class="expand-icon"
              @click.stop="toggleFolder(item.key)"
            />
            <t-icon :name="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>

        <!-- My documents folder contents -->
        <div v-if="item.key === 'my-docs' && expandedFolders.includes('my-docs')" class="folder-contents">
          <template v-for="folder in documentStore.myFolders" :key="folder.id">
            <div class="folder-item">
              <t-icon
                :name="expandedFolders.includes(folder.id) ? 'chevron-down' : 'chevron-right'"
                class="expand-icon"
                style="font-size: 10px;"
                @click.stop="toggleFolder(folder.id)"
              />
              <div class="folder-item-main" @click="router.push(`/folder/${folder.id}`)">
                <t-icon name="folder" class="folder-icon" />
                <span>{{ folder.title }}</span>
                <span class="doc-count">{{ getFolderDocCount(folder.title) }}</span>
              </div>
            </div>

            <!-- 文件夹内的文档列表 -->
            <div v-if="expandedFolders.includes(folder.id)" class="sub-docs">
              <div
                v-for="doc in getFolderDocs(folder.title)"
                :key="doc.id"
                class="sub-doc-item"
                @click="openDocument(doc)"
              >
                <t-icon
                  :name="getDocIcon(doc.type || 'document')"
                  class="sub-doc-icon"
                />
                <span>{{ doc.title }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Shared documents contents -->
        <div v-if="item.key === 'shared' && expandedFolders.includes('shared')" class="folder-contents">
          <template v-for="folder in documentStore.sharedFolders" :key="folder.id">
            <div class="folder-item">
              <t-icon
                :name="expandedFolders.includes(folder.id) ? 'chevron-down' : 'chevron-right'"
                class="expand-icon"
                style="font-size: 10px;"
                @click.stop="toggleFolder(folder.id)"
              />
              <div class="folder-item-main" @click="router.push(`/folder/${folder.id}`)">
                <t-icon name="folder" class="folder-icon" />
                <span>{{ folder.title }}</span>
                <span class="doc-count">{{ getFolderDocCount(folder.title) }}</span>
              </div>
            </div>

            <!-- 文件夹内的文档列表 -->
            <div v-if="expandedFolders.includes(folder.id)" class="sub-docs">
              <div
                v-for="doc in getFolderDocs(folder.title)"
                :key="doc.id"
                class="sub-doc-item"
                @click="openDocument(doc)"
              >
                <t-icon
                  :name="getDocIcon(doc.type || 'document')"
                  class="sub-doc-icon"
                />
                <span>{{ doc.title }}</span>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- 底部菜单项 -->
    <div class="sidebar-bottom-menu">
      <template v-for="(item, index) in bottomMenuItems" :key="item.key">
        <div
          :class="['menu-item', { active: menuStore.activeMenu === item.key }]"
          @click="handleMenuClick(item.key)"
        >
          <div class="menu-item-content">
            <t-icon :name="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>
        <div v-if="index === 0" class="bottom-menu-divider"></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 移动端遮罩层 */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Apple 风格侧边栏 */
.sidebar {
  width: 260px;
  height: 100vh;
  background: var(--bg-gray-1);
  border-right: 1px solid var(--border-color-2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 桌面端隐藏状态 */
.sidebar-hidden {
  transform: translateX(-100%);
}

/* 移动端关闭按钮 */
.mobile-close-btn {
  display: none;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
}

.mobile-close-btn :deep(.t-icon) {
  font-size: 20px;
}

/* Apple 风格滚动条 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

.sidebar-header {
  padding: 24px 16px 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 折叠按钮 */
.collapse-btn {
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
  border-radius: 6px !important;
  transition: all var(--transition-fast);
}

.collapse-btn:hover {
  background: rgba(0, 0, 0, 0.06) !important;
}

.collapse-btn :deep(.t-icon) {
  font-size: 18px;
  color: var(--text-secondary);
}

/* 桌面端显示 */
.desktop-only {
  display: flex;
}

/* Logo 样式调整 */
.sidebar-header :deep(.logo) {
  cursor: pointer;
}

/* 个人信息区域 - 默认隐藏 */
.user-profile-section {
  display: none;
}

.user-profile-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--border-color-2);
}

.user-avatar {
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, #1677FF 100%);
  color: white;
  font-weight: 600;
  font-size: 20px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 12px;
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  width: 100%;
  justify-content: center;
  border-radius: var(--radius-small);
  transition: all var(--transition-fast);
  margin-top: 16px;
}

.logout-btn:hover {
  background: rgba(255, 77, 79, 0.08);
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.mobile-menu-list {
  display: none; /* 默认隐藏，移动端显示 */
  flex-direction: column;
  gap: 4px;
  padding: 0;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: var(--radius-small);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--border-color-2);
}

.mobile-menu-item:hover {
  background: rgba(0, 82, 217, 0.04);
  border-color: var(--primary-color);
  transform: translateX(2px);
}

.mobile-menu-item:active {
  background: rgba(0, 82, 217, 0.08);
  transform: scale(0.98);
}

.mobile-menu-icon {
  font-size: 20px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.mobile-menu-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.mobile-menu-arrow {
  font-size: 16px;
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.mobile-menu-item:hover .mobile-menu-arrow {
  transform: translateX(2px);
  color: var(--primary-color);
}

.sidebar-menu {
  padding: 12px 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.sidebar-bottom-menu {
  padding: 12px 20px 20px;
  border-top: 1px solid var(--border-color-2);
  margin-top: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
}

.sidebar-bottom-menu .menu-item {
  flex: 0 1 auto;
  margin-bottom: 0;
  max-width: 90px;
}

.sidebar-bottom-menu .menu-item-content {
  justify-content: center;
  padding: 4px 4px;
  flex-direction: column;
  gap: 1px;
  text-align: center;
  font-size: 10px;
}

.sidebar-bottom-menu .menu-item-content .t-icon {
  font-size: 14px;
}

.bottom-menu-divider {
  width: 1px;
  background: var(--border-color-2);
  margin: 0 4px;
  align-self: stretch;
}

.menu-item {
  padding: 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
  width: 100%;
}

.menu-item:hover .menu-item-content {
  background: rgba(0, 0, 0, 0.04);
}

.menu-item.active .menu-item-content {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-1);
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-small);
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
  transition: all var(--transition-fast);
  letter-spacing: -0.2px;
  justify-content: flex-start;
}

.menu-item-content .t-icon {
  font-size: 17px;
  transition: all var(--transition-fast);
  opacity: 0.9;
}

.menu-item.active .menu-item-content .t-icon {
  opacity: 1;
}

.expand-icon {
  font-size: 11px;
  transition: transform var(--transition-fast);
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 6px;
  margin: -6px 0;
  border-radius: 4px;
}

.expand-icon:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}

.folder-contents {
  padding-left: 24px;
  margin-top: 2px;
  margin-bottom: 6px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 1px 0;
}

.folder-item-main {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-small);
  transition: all var(--transition-fast);
  font-weight: 400;
}

.folder-item-main:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}

.folder-icon {
  font-size: 15px;
  color: var(--primary-color);
  transition: all var(--transition-fast);
  opacity: 0.8;
}

.folder-item-main:hover .folder-icon {
  opacity: 1;
}

.doc-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-tertiary);
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  font-weight: 600;
}

.team-folders {
  padding-left: 16px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.sub-folder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-small);
  margin: 1px 0;
  font-weight: 400;
}

.sub-folder-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}

.sub-folder-icon {
  font-size: 13px;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.sub-folder-item:hover .sub-folder-icon {
  color: var(--primary-color);
}

/* 子文档列表样式 */
.sub-docs {
  padding-left: 24px;
  margin-top: 2px;
  margin-bottom: 4px;
}

.sub-doc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin: 1px 0;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-small);
  transition: all var(--transition-fast);
  font-weight: 400;
}

.sub-doc-item:hover {
  background: rgba(0, 82, 217, 0.08);
  color: var(--text-primary);
}

.sub-doc-icon {
  font-size: 14px;
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.sub-doc-item:hover .sub-doc-icon {
  color: var(--primary-color);
}

/* ===== 移动端适配 (768px以下) ===== */
@media (max-width: 768px) {
  /* 显示遮罩层 */
  .sidebar-overlay {
    display: block;
  }

  /* 侧边栏默认隐藏在左侧 */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  /* 打开状态 */
  .sidebar-mobile-open {
    transform: translateX(0);
  }

  /* 隐藏折叠按钮 */
  .desktop-only {
    display: none !important;
  }

  /* 显示关闭按钮 */
  .mobile-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 调整 header 布局 */
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 隐藏个人信息区域（已移至我的页面） */
  .user-profile-section {
    display: none !important;
  }

  /* 显示侧边栏菜单 */
  .sidebar-menu {
    display: block !important;
  }
}
</style>
