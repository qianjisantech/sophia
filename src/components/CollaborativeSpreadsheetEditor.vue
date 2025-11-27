<template>
  <div class="collaborative-spreadsheet-wrapper">
    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="connection-status">
        <span v-if="isConnected && isSynced" class="status-indicator connected">
          <span class="dot"></span> 已连接并同步
        </span>
        <span v-else-if="isConnected" class="status-indicator syncing">
          <span class="dot"></span> 同步中...
        </span>
        <span v-else class="status-indicator disconnected">
          <span class="dot"></span> 未连接
        </span>
      </div>

      <div class="online-users">
        <span class="users-label">在线用户 ({{ onlineUsers.length }}):</span>
        <div class="user-avatars">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="user-avatar"
            :style="{ backgroundColor: user.color }"
            :title="user.name"
          >
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- 表格容器 -->
    <div ref="spreadsheetContainer" class="spreadsheet-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Spreadsheet from 'x-data-spreadsheet'
import 'x-data-spreadsheet/dist/locale/zh-cn'
import 'x-data-spreadsheet/dist/xspreadsheet.css'
import { createCollaborationManager, type CollaborationUser } from '../services/collaboration'
import type { CollaborationManager } from '../services/collaboration'
import * as Y from 'yjs'

interface Props {
  documentId: string
  username?: string
  wsUrl?: string
}

interface Emits {
  (e: 'usersChanged', users: CollaborationUser[]): void
  (e: 'connected'): void
  (e: 'disconnected'): void
  (e: 'synced', isSynced: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  username: `User-${Math.floor(Math.random() * 1000)}`,
  wsUrl: 'ws://localhost:1234'
})

const emit = defineEmits<Emits>()

const spreadsheetContainer = ref<HTMLDivElement | null>(null)
let spreadsheetInstance: any = null
let collaborationManager: CollaborationManager | null = null
let ymap: Y.Map<any> | null = null
let isLocalChange = false

// 在线用户
const onlineUsers = ref<CollaborationUser[]>([])
const isConnected = ref(false)
const isSynced = ref(false)

// 初始化表格
const initSpreadsheet = () => {
  if (!spreadsheetContainer.value) return

  const options = {
    mode: 'edit',
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    view: {
      height: () => window.innerHeight - 250,
      width: () => spreadsheetContainer.value?.clientWidth || 1000,
    },
    row: {
      len: 100,
      height: 25,
    },
    col: {
      len: 26,
      width: 100,
      indexWidth: 60,
      minWidth: 60,
    },
    style: {
      bgcolor: '#ffffff',
      align: 'left',
      valign: 'middle',
      textwrap: false,
      strike: false,
      underline: false,
      color: '#0a0a0a',
      font: {
        name: 'Arial',
        size: 10,
        bold: false,
        italic: false,
      },
    },
  }

  spreadsheetInstance = new Spreadsheet(spreadsheetContainer.value, options)

  // 监听变化并同步到 Yjs
  spreadsheetInstance.change((data: any) => {
    if (!ymap || isLocalChange) return

    isLocalChange = true
    const jsonData = spreadsheetInstance.getData()
    ymap.set('spreadsheetData', jsonData)
    isLocalChange = false
  })
}

// 初始化协同编辑
const initCollaboration = () => {
  // 创建协同管理器
  collaborationManager = createCollaborationManager({
    documentId: props.documentId,
    username: props.username,
    wsUrl: props.wsUrl,
    onConnected: () => {
      isConnected.value = true
      emit('connected')
    },
    onDisconnected: () => {
      isConnected.value = false
      emit('disconnected')
    },
    onUsersChanged: (users) => {
      onlineUsers.value = users
      emit('usersChanged', users)
    },
    onSynced: (synced) => {
      isSynced.value = synced
      emit('synced', synced)
    }
  })

  // 连接到服务器
  collaborationManager.connect()
  const ydoc = collaborationManager.getYDoc()

  // 获取或创建共享的 Map
  ymap = ydoc.getMap('spreadsheet')

  // 监听 Yjs 的变化
  ymap.observe(() => {
    if (!spreadsheetInstance || isLocalChange) return

    const data = ymap!.get('spreadsheetData')
    if (data) {
      isLocalChange = true
      try {
        spreadsheetInstance.loadData(data)
      } catch (e) {
        console.error('Failed to apply remote changes:', e)
      }
      isLocalChange = false
    }
  })

  // 加载初始数据
  const initialData = ymap.get('spreadsheetData')
  if (initialData && spreadsheetInstance) {
    spreadsheetInstance.loadData(initialData)
  } else if (spreadsheetInstance) {
    // 创建默认表格
    const defaultData = [{
      name: 'Sheet1',
      rows: {
        0: {
          cells: {
            0: { text: '姓名' },
            1: { text: '年龄' },
            2: { text: '城市' },
            3: { text: '职位' },
          }
        },
        1: {
          cells: {
            0: { text: '张三' },
            1: { text: '28' },
            2: { text: '北京' },
            3: { text: '工程师' },
          }
        },
        2: {
          cells: {
            0: { text: '李四' },
            1: { text: '32' },
            2: { text: '上海' },
            3: { text: '设计师' },
          }
        },
        3: {
          cells: {
            0: { text: '王五' },
            1: { text: '25' },
            2: { text: '深圳' },
            3: { text: '产品经理' },
          }
        },
      },
      styles: [
        {
          bgcolor: '#f0f0f0',
          bold: true,
        }
      ]
    }]
    spreadsheetInstance.loadData(defaultData)

    // 初始化时同步到 Yjs
    isLocalChange = true
    ymap.set('spreadsheetData', defaultData)
    isLocalChange = false
  }
}

onMounted(() => {
  initSpreadsheet()
  initCollaboration()

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (spreadsheetInstance && spreadsheetContainer.value) {
      spreadsheetInstance.resize()
    }
  })
})

onBeforeUnmount(() => {
  if (spreadsheetInstance) {
    spreadsheetInstance = null
  }
  if (collaborationManager) {
    collaborationManager.disconnect()
    collaborationManager = null
  }
})
</script>

<style scoped>
.collaborative-spreadsheet-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #fff;
  overflow: hidden;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #F5F7FA;
  border-bottom: 1px solid var(--border-color-2);
  font-size: 12px;
  flex-shrink: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.status-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.connected .dot {
  background: #52c41a;
  animation: pulse 2s ease-in-out infinite;
}

.status-indicator.syncing .dot {
  background: #faad14;
  animation: blink 1s ease-in-out infinite;
}

.status-indicator.disconnected .dot {
  background: #ff4d4f;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 在线用户 */
.online-users {
  display: flex;
  align-items: center;
  gap: 12px;
}

.users-label {
  color: var(--text-secondary);
}

.user-avatars {
  display: flex;
  gap: 4px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

/* 表格容器 */
.spreadsheet-container {
  flex: 1;
  width: 100%;
  min-height: 0;
}

/* 覆盖 x-spreadsheet 默认样式 */
.spreadsheet-container :deep(.x-spreadsheet) {
  background: #fff;
}

.spreadsheet-container :deep(.x-spreadsheet-toolbar) {
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  padding: 8px 16px;
}

.spreadsheet-container :deep(.x-spreadsheet-sheet) {
  background: #f5f5f5;
}

.spreadsheet-container :deep(.x-spreadsheet-table) {
  background: #fff;
}

.spreadsheet-container :deep(.x-spreadsheet-cell) {
  border-color: #e7e7e7;
}

.spreadsheet-container :deep(.x-spreadsheet-cell.selected) {
  border-color: #0052D9;
}
</style>
