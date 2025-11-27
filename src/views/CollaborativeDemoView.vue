<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CollaborativeTiptapEditor from '../components/CollaborativeTiptapEditor.vue'
import type { CollaborationUser } from '../services/collaboration'

const router = useRouter()

// 文档ID - 所有用户连接到同一个文档进行协同编辑
const documentId = ref('demo-doc-001')

// 用户名 - 可以让用户自定义
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
    // 重新加载页面以使用新用户名
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

// 复制文档链接
const copyDocumentLink = () => {
  const link = `${window.location.origin}/#/collaborative-demo`
  navigator.clipboard.writeText(link).then(() => {
    // 这里可以加个提示
    alert('链接已复制到剪贴板！\n分享给其他人一起编辑吧！')
  })
}
</script>

<template>
  <div class="collaborative-demo-view">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <t-button variant="text" @click="goBack" class="back-btn">
          <template #icon><t-icon name="chevron-left" /></template>
          返回首页
        </t-button>

        <div class="divider-vertical"></div>

        <h2 class="page-title">协同编辑演示</h2>
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
        <h3>🎉 欢迎体验多人协同编辑</h3>
        <p>
          <strong>如何测试：</strong>
        </p>
        <ol>
          <li>确保 WebSocket 服务器已启动（运行 <code>npm run server</code> 或 <code>npm run dev:all</code>）</li>
          <li>点击右上角"分享链接"按钮，复制链接</li>
          <li>在新浏览器窗口/标签页中打开链接（或分享给其他人）</li>
          <li>开始同时编辑文档，观察实时同步效果</li>
          <li>你可以看到其他用户的光标位置和选择内容</li>
        </ol>
        <p>
          <strong>技术实现：</strong> 基于 Yjs（CRDT）+ WebSocket + Tiptap 实现的无冲突实时协同编辑
        </p>
      </div>
    </div>

    <!-- 协同编辑器 -->
    <div class="editor-container">
      <CollaborativeTiptapEditor
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
.collaborative-demo-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eaeaea;
  height: 64px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: color 0.15s ease;
}

.back-btn:hover {
  color: #000;
}

.divider-vertical {
  width: 1px;
  height: 24px;
  background: #d4d4d4;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #000;
  letter-spacing: -0.01em;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.user-info:hover {
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.username {
  font-size: 13px;
  font-weight: 500;
  color: #000;
}

.username-input {
  padding: 6px 10px;
  border: 1px solid #000;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  transition: all 0.15s ease;
}

.username-input:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.edit-actions {
  display: flex;
  gap: 6px;
}

/* 说明面板 */
.info-panel {
  padding: 24px 32px;
  background: #fafafa;
  border-bottom: 1px solid #eaeaea;
}

.info-content {
  max-width: 900px;
  margin: 0 auto;
}

.info-content h3 {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.01em;
}

.info-content p {
  margin: 12px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.info-content strong {
  color: #000;
  font-weight: 600;
}

.info-content ol {
  margin: 12px 0;
  padding-left: 24px;
}

.info-content li {
  margin: 8px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.7;
}

.info-content code {
  padding: 3px 8px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  font-family: 'Monaco', 'Menlo', 'Consolas', 'SF Mono', monospace;
  font-size: 12px;
  color: #000;
  font-weight: 500;
}

/* 编辑器容器 */
.editor-container {
  flex: 1;
  padding: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.editor-container > * {
  flex: 1;
  min-height: 0;
}
</style>
