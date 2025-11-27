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

// 加载文档数据
onMounted(async () => {
  await documentStore.loadDocuments()
})

// 从 localStorage 恢复展开状态
const expandedFolders = ref<string[]>(
  JSON.parse(localStorage.getItem('expandedFolders') || '[]')
)

const menuItems = [
  { key: 'home', label: '首页', icon: 'home' },
  { key: 'favorites', label: '我的收藏', icon: 'star' },
  { key: 'my-docs', label: '我的文档', icon: 'folder', expandable: true },
  { key: 'shared', label: '共享文档', icon: 'usergroup', expandable: true },
  { key: 'trash', label: '回收站', icon: 'delete' }
]

// 计算每个文件夹内的文档数量
const getFolderDocCount = (folderId: string) => {
  return documentStore.documents.filter(doc =>
    doc.folderId === folderId && doc.type !== 'folder'
  ).length
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

  // 所有菜单项都跳转到 /
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  MessagePlugin.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <Logo size="medium" :showText="true" />
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
          <div
            v-for="folder in documentStore.myFolders"
            :key="folder.id"
            class="folder-item"
            @click="router.push(`/folder/${folder.id}`)"
          >
            <t-icon name="folder" class="folder-icon" />
            <span>{{ folder.title }}</span>
            <span class="doc-count">{{ getFolderDocCount(folder.id) }}</span>
          </div>
        </div>

        <!-- Shared documents contents -->
        <div v-if="item.key === 'shared' && expandedFolders.includes('shared')" class="folder-contents">
          <div
            v-for="folder in documentStore.sharedFolders"
            :key="folder.id"
            class="folder-item"
            @click="router.push(`/folder/${folder.id}`)"
          >
            <t-icon name="folder" class="folder-icon" />
            <span>{{ folder.title }}</span>
            <span class="doc-count">{{ getFolderDocCount(folder.id) }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
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
  cursor: pointer;
  flex-shrink: 0;
}

.sidebar-menu {
  padding: 12px 12px;
  flex: 1;
}

.menu-item {
  padding: 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
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
  padding: 8px 12px;
  border-radius: var(--radius-small);
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
  transition: all var(--transition-fast);
  letter-spacing: -0.2px;
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
}

.folder-contents {
  padding-left: 32px;
  margin-top: 2px;
  margin-bottom: 6px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin: 1px 0;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-small);
  transition: all var(--transition-fast);
  font-weight: 400;
}

.folder-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}

.folder-icon {
  font-size: 15px;
  color: var(--primary-color);
  transition: all var(--transition-fast);
  opacity: 0.8;
}

.folder-item:hover .folder-icon {
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
</style>
