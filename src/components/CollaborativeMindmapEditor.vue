<template>
  <div class="collaborative-mindmap-wrapper">
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

    <!-- 思维导图容器 -->
    <div ref="containerRef" class="mindmap-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Graph } from '@antv/x6'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
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

const containerRef = ref<HTMLDivElement | null>(null)
let graph: Graph | null = null
let collaborationManager: CollaborationManager | null = null
let ymap: Y.Map<any> | null = null
let isLocalChange = false

// 在线用户
const onlineUsers = ref<CollaborationUser[]>([])
const isConnected = ref(false)
const isSynced = ref(false)

// 初始化图形编辑器
const initGraph = () => {
  if (!containerRef.value) return

  graph = new Graph({
    container: containerRef.value,
    width: containerRef.value.clientWidth,
    height: containerRef.value.clientHeight,
    grid: {
      size: 10,
      visible: true,
      type: 'dot',
      args: {
        color: '#e0e0e0',
        thickness: 1,
      },
    },
    panning: {
      enabled: true,
      modifiers: 'shift',
    },
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: 'smooth',
      router: {
        name: 'er',
        args: {
          offset: 25,
        },
      },
      createEdge() {
        return graph!.createEdge({
          attrs: {
            line: {
              stroke: '#0052D9',
              strokeWidth: 2,
              targetMarker: null,
            },
          },
        })
      },
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#0052D9',
            stroke: '#0052D9',
          },
        },
      },
    },
  })

  // 注册插件
  graph.use(new Clipboard({ enabled: true }))
  graph.use(new History({ enabled: true }))
  graph.use(new Keyboard({ enabled: true }))
  graph.use(new Selection({ enabled: true, rubberband: true, showNodeSelectionBox: true }))

  // 键盘快捷键
  graph.bindKey('ctrl+c', () => {
    const cells = graph!.getSelectedCells()
    if (cells.length) graph!.copy(cells)
    return false
  })

  graph.bindKey('ctrl+v', () => {
    if (!graph!.isClipboardEmpty()) {
      const cells = graph!.paste({ offset: 32 })
      graph!.cleanSelection()
      graph!.select(cells)
    }
    return false
  })

  graph.bindKey('delete', () => {
    const cells = graph!.getSelectedCells()
    if (cells.length) graph!.removeCells(cells)
    return false
  })

  graph.bindKey('ctrl+z', () => {
    graph!.undo()
    return false
  })

  graph.bindKey('ctrl+y', () => {
    graph!.redo()
    return false
  })

  // 监听变化并同步到 Yjs
  const syncToYjs = () => {
    if (!graph || !ymap || isLocalChange) return

    isLocalChange = true
    const data = graph.toJSON()
    ymap.set('graphData', data)
    isLocalChange = false
  }

  graph.on('node:added', syncToYjs)
  graph.on('node:removed', syncToYjs)
  graph.on('node:changed', syncToYjs)
  graph.on('edge:added', syncToYjs)
  graph.on('edge:removed', syncToYjs)
  graph.on('edge:changed', syncToYjs)
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
  ymap = ydoc.getMap('mindmap')

  // 监听 Yjs 的变化
  ymap.observe(() => {
    if (!graph || isLocalChange) return

    const data = ymap!.get('graphData')
    if (data) {
      isLocalChange = true
      try {
        graph.fromJSON(data)
      } catch (e) {
        console.error('Failed to apply remote changes:', e)
      }
      isLocalChange = false
    }
  })

  // 加载初始数据
  const initialData = ymap.get('graphData')
  if (initialData && graph) {
    graph.fromJSON(initialData)
  } else if (graph) {
    // 创建默认思维导图
    createDefaultMindmap()
  }
}

// 创建默认思维导图
const createDefaultMindmap = () => {
  if (!graph) return

  const centerNode = graph.addNode({
    x: 400,
    y: 300,
    width: 180,
    height: 60,
    label: '中心主题',
    attrs: {
      body: {
        fill: '#0052D9',
        stroke: '#0052D9',
        strokeWidth: 2,
        rx: 6,
        ry: 6,
      },
      label: {
        fill: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
  })

  // 添加子节点
  const topics = [
    { label: '主题 1', color: '#52c41a', x: 200, y: 150 },
    { label: '主题 2', color: '#1890ff', x: 200, y: 300 },
    { label: '主题 3', color: '#faad14', x: 200, y: 450 },
    { label: '主题 4', color: '#f5222d', x: 600, y: 150 },
    { label: '主题 5', color: '#722ed1', x: 600, y: 450 },
  ]

  topics.forEach((topic) => {
    const node = graph!.addNode({
      x: topic.x,
      y: topic.y,
      width: 140,
      height: 50,
      label: topic.label,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: topic.color,
          strokeWidth: 2,
          rx: 6,
          ry: 6,
        },
        label: {
          fill: '#000000',
          fontSize: 14,
        },
      },
    })

    graph!.addEdge({
      source: centerNode.id,
      target: node.id,
      attrs: {
        line: {
          stroke: topic.color,
          strokeWidth: 2,
          targetMarker: null,
        },
      },
    })
  })

  graph.centerContent()
}

onMounted(() => {
  initGraph()
  initCollaboration()

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (graph && containerRef.value) {
      graph.resize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    }
  })
})

onBeforeUnmount(() => {
  if (graph) {
    graph.dispose()
    graph = null
  }
  if (collaborationManager) {
    collaborationManager.disconnect()
    collaborationManager = null
  }
})
</script>

<style scoped>
.collaborative-mindmap-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #f5f5f5;
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

/* 思维导图容器 */
.mindmap-container {
  flex: 1;
  width: 100%;
  min-height: 0;
}

/* X6 样式覆盖 */
.mindmap-container :deep(.x6-graph) {
  background: #fafafa;
}

.mindmap-container :deep(.x6-graph-svg) {
  background: linear-gradient(90deg, #f5f5f5 1px, transparent 0),
              linear-gradient(#f5f5f5 1px, transparent 0);
  background-size: 20px 20px;
}

.mindmap-container :deep(.x6-node) {
  cursor: move;
}

.mindmap-container :deep(.x6-node:hover) {
  opacity: 0.9;
}

.mindmap-container :deep(.x6-node-selected rect) {
  stroke: #0052D9;
  stroke-width: 3;
}

.mindmap-container :deep(.x6-edge:hover path) {
  stroke-width: 3;
}

.mindmap-container :deep(.x6-edge-selected path) {
  stroke: #0052D9;
  stroke-width: 3;
}
</style>
