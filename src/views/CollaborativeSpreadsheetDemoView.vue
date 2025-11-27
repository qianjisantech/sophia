<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CollaborativeSpreadsheetEditor from '../components/CollaborativeSpreadsheetEditor.vue'
import type { CollaborationUser } from '../services/collaboration'

const router = useRouter()

// 文档ID
const documentId = ref('spreadsheet-demo-001')

// 用户名
const username = ref(`用户-${Math.floor(Math.random() * 1000)}`)
const isEditingUsername = ref(false)
const tempUsername = ref(username.value)

// WebSocket 服务器地址
const wsUrl = ref('ws://localhost:1234')

// 在线用户列表
const onlineUsers = ref<CollaborationUser[]>([])

// 连接状态
const isConnected = ref(false)
const isSynced = ref(false)

// 修改用户名
const startEditUsername = () => {
  isEditingUsername.value = true
  tempUsername.value = username.value
}

const saveUsername = () => {
  if (tempUsername.value.trim()) {
    username.value = tempUsername.value.trim()
    isEditingUsername.value = false
    window.location.reload()
  }
}

const cancelEditUsername = () => {
  isEditingUsername.value = false
  tempUsername.value = username.value
}

// 处理协同事件
const handleUsersChanged = (users: CollaborationUser[]) => {
  onlineUsers.value = users
}

const handleConnected = () => {
  isConnected.value = true
}

const handleDisconnected = () => {
  isConnected.value = false
}

const handleSynced = (synced: boolean) => {
  isSynced.value = synced
}

// 返回首页
const goBack = () => {
  router.push('/')
}

// 复制链接
const copyDocumentLink = () => {
  const link = `${window.location.origin}/#/collaborative-spreadsheet-demo`
  navigator.clipboard.writeText(link).then(() => {
    alert('链接已复制到剪贴板！\n分享给其他人一起编辑表格吧！')
  })
}
</script>

<template>
  <div class="collaborative-spreadsheet-demo-view">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <t-button variant="text" @click="goBack" class="back-btn">
          <template #icon><t-icon name="chevron-left" /></template>
          返回首页
        </t-button>

        <div class="divider-vertical"></div>

        <h2 class="page-title">协同表格编辑演示</h2>
      </div>

      <div class="nav-right">
        <div class="user-info">
          <t-icon name="user" />
          <span v-if="!isEditingUsername" class="username">{{ username }}</span>
          <input
            v-else
            v-model="tempUsername"
            @keyup.enter="saveUsername"
            @keyup.esc="cancelEditUsername"
            class="username-input"
            autofocus
          />
          <t-button
            v-if="!isEditingUsername"
            variant="text"
            size="small"
            @click="startEditUsername"
          >
            修改
          </t-button>
          <div v-else class="edit-actions">
            <t-button variant="text" size="small" @click="saveUsername">保存</t-button>
            <t-button variant="text" size="small" @click="cancelEditUsername">取消</t-button>
          </div>
        </div>

        <t-button variant="outline" @click="copyDocumentLink">
          <template #icon><t-icon name="link" /></template>
          分享链接
        </t-button>
      </div>
    </div>

    <!-- 说明面板 -->
    <div class="info-panel">
      <div class="info-content">
        <h3>📊 欢迎体验多人协同表格编辑</h3>
        <p>
          <strong>如何测试：</strong>
        </p>
        <ol>
          <li>确保 WebSocket 服务器已启动（运行 <code>npm run server</code> 或 <code>npm run dev:all</code>）</li>
          <li>点击右上角"分享链接"按钮，复制链接</li>
          <li>在新浏览器窗口/标签页中打开链接（或分享给其他人）</li>
          <li>尝试编辑单元格、修改样式、添加公式等操作</li>
          <li>所有用户的修改会即时同步</li>
        </ol>
        <p>
          <strong>功能特性：</strong> 实时单元格编辑 | 样式同步 | 公式计算 | 多Sheet支持 | 无冲突合并
        </p>
      </div>
    </div>

    <!-- 协同表格编辑器 -->
    <div class="editor-container">
      <CollaborativeSpreadsheetEditor
        :document-id="documentId"
        :username="username"
        :ws-url="wsUrl"
        @users-changed="handleUsersChanged"
        @connected="handleConnected"
        @disconnected="handleDisconnected"
        @synced="handleSynced"
      />
    </div>
  </div>
</template>

<style scoped>
.collaborative-spreadsheet-demo-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid var(--border-color-2);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  font-size: 14px;
}

.divider-vertical {
  width: 1px;
  height: 24px;
  background: var(--border-color-2);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-gray-3);
  border-radius: 6px;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.username-input {
  padding: 4px 8px;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.edit-actions {
  display: flex;
  gap: 4px;
}

/* 说明面板 */
.info-panel {
  padding: 20px 24px;
  background: #E6FFFB;
  border-bottom: 1px solid #87E8DE;
}

.info-content h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #08979C;
}

.info-content p {
  margin: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.info-content ol {
  margin: 8px 0;
  padding-left: 24px;
}

.info-content li {
  margin: 6px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.info-content code {
  padding: 2px 6px;
  background: white;
  border: 1px solid #D9D9D9;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  color: #08979C;
}

/* 编辑器容器 */
.editor-container {
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.editor-container > * {
  flex: 1;
  min-height: 0;
}
</style>
