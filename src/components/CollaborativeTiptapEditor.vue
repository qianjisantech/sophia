<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
// import Underline from '@tiptap/extension-underline'
// import TextAlign from '@tiptap/extension-text-align'
// import { TextStyle } from '@tiptap/extension-text-style'
// import { Color } from '@tiptap/extension-color'
// import { Highlight } from '@tiptap/extension-highlight'
// import { Link } from '@tiptap/extension-link'
// import { Image } from '@tiptap/extension-image'
// import { Table } from '@tiptap/extension-table'
// import { TableRow } from '@tiptap/extension-table-row'
// import { TableCell } from '@tiptap/extension-table-cell'
// import { TableHeader } from '@tiptap/extension-table-header'
// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import type { CollaborationUser } from '../services/collaboration'
// import { createCollaborationManager, type CollaborationUser } from '../services/collaboration'
// import type { CollaborationManager } from '../services/collaboration'

// 目录项接口
interface TocItem {
  id: string
  level: number
  text: string
  pos: number
}

// interface Props {
//   documentId: string
//   username?: string
//   wsUrl?: string
// }

// interface Emits {
//   (e: 'usersChanged', users: CollaborationUser[]): void
//   (e: 'connected'): void
//   (e: 'disconnected'): void
//   (e: 'synced', isSynced: boolean): void
// }

// const props = withDefaults(defineProps<Props>(), {
//   username: `User-${Math.floor(Math.random() * 1000)}`,
//   wsUrl: 'ws://localhost:1234'
// })

// const emit = defineEmits<Emits>()

// 协同管理器
// let collaborationManager: CollaborationManager | null = null

// 在线用户
// const onlineUsers = ref<CollaborationUser[]>([])
// const isConnected = ref(false)
// const isSynced = ref(false)

// 当前用户
// const currentUser = computed(() => collaborationManager?.getCurrentUser())

// 目录
const tocItems = ref<TocItem[]>([])
const showToc = ref(true)

// 提取文档标题生成目录
const extractToc = (editorInstance?: any) => {
  const currentEditor = editorInstance || editor.value
  if (!currentEditor) return

  const items: TocItem[] = []
  const doc = currentEditor.state.doc

  doc.descendants((node: any, pos: number) => {
    if (node.type.name === 'heading') {
      const level = node.attrs.level
      if (level >= 1 && level <= 4) {
        items.push({
          id: `heading-${pos}`,
          level,
          text: node.textContent,
          pos
        })
      }
    }
  })

  tocItems.value = items
  console.log('目录已更新:', items)
}

// 跳转到指定标题
const scrollToHeading = (item: TocItem) => {
  if (!editor.value) return

  // 设置光标到标题位置
  editor.value.chain().focus().setTextSelection(item.pos).run()

  // 滚动到标题位置
  const element = document.querySelector(`[data-position="${item.pos}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 切换目录显示
const toggleToc = () => {
  showToc.value = !showToc.value
}

// 初始化协同管理器 - 暂时注释掉
// collaborationManager = createCollaborationManager({
//   documentId: props.documentId,
//   username: props.username,
//   wsUrl: props.wsUrl,
//   onConnected: () => {
//     isConnected.value = true
//     emit('connected')
//   },
//   onDisconnected: () => {
//     isConnected.value = false
//     emit('disconnected')
//   },
//   onUsersChanged: (users) => {
//     onlineUsers.value = users
//     emit('usersChanged', users)
//   },
//   onSynced: (synced) => {
//     isSynced.value = synced
//     emit('synced', synced)
//   }
// })

// 连接到服务器 - 暂时注释掉
// const provider = collaborationManager.connect()
// const ydoc = collaborationManager.getYDoc()

// 获取当前用户颜色 - 暂时注释掉
// const userColor = collaborationManager.getCurrentUser().color

// 创建编辑器实例
const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '开始编辑...'
      }),
      // Yjs 协同扩展 - 暂时注释掉
      // Collaboration.configure({
      //   document: ydoc,
      // }),
      // 暂时移除 CollaborationCursor，因为它需要 provider 完全初始化
      // TODO: 后续添加协同光标功能
    ],
    onUpdate: ({ editor: editorInstance }) => {
      // 内容变化时更新目录
      extractToc(editorInstance)
    }
  })

// 监听编辑器初始化和内容变化
watch(editor, (newEditor) => {
  if (newEditor) {
    // 编辑器初始化完成后提取目录
    extractToc(newEditor)
  }
}, { immediate: true })

// 监听 Yjs 文档变化（其他用户的编辑）- 暂时注释掉
// ydoc.on('update', () => {
//   extractToc()
// })

// 清理
onBeforeUnmount(() => {
  editor.value?.destroy()
  // collaborationManager?.disconnect() // 暂时注释掉
})

// 工具栏方法
const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
// const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run()
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run()
// const toggleCode = () => editor.value?.chain().focus().toggleCode().run()

const setHeading = (level: 1 | 2 | 3 | 4) => {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run()
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run()
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run()
// const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run()

// const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
//   editor.value?.chain().focus().setTextAlign(alignment).run()
// }

// const setColor = (color: string) => {
//   editor.value?.chain().focus().setColor(color).run()
// }

// const toggleHighlight = (color?: string) => {
//   if (color) {
//     editor.value?.chain().focus().toggleHighlight({ color }).run()
//   } else {
//     editor.value?.chain().focus().toggleHighlight().run()
//   }
// }

// const setLink = () => {
//   const url = window.prompt('请输入链接地址:')
//   if (url) {
//     editor.value?.chain().focus().setLink({ href: url }).run()
//   }
// }

// const addImage = () => {
//   const url = window.prompt('请输入图片地址:')
//   if (url) {
//     editor.value?.chain().focus().setImage({ src: url }).run()
//   }
// }

// const insertTable = () => {
//   editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
// }

const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()
</script>

<template>
  <div class="collaborative-editor">
    <!-- 顶部状态栏 - 暂时注释掉 -->
    <!-- <div class="status-bar">
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
    </div> -->

    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 撤销重做 -->
      <div class="toolbar-group">
        <button @click="undo" class="toolbar-btn" title="撤销">
          <t-icon name="refresh-left" />
        </button>
        <button @click="redo" class="toolbar-btn" title="重做">
          <t-icon name="refresh-right" />
        </button>
      </div>

      <div class="divider"></div>

      <!-- 文本格式 -->
      <div class="toolbar-group">
        <button
          @click="toggleBold"
          :class="{ 'is-active': editor?.isActive('bold') }"
          class="toolbar-btn"
          title="粗体"
        >
          <t-icon name="format-bold" />
        </button>
        <button
          @click="toggleItalic"
          :class="{ 'is-active': editor?.isActive('italic') }"
          class="toolbar-btn"
          title="斜体"
        >
          <t-icon name="format-italic" />
        </button>
        <!-- <button
          @click="toggleUnderline"
          :class="{ 'is-active': editor?.isActive('underline') }"
          class="toolbar-btn"
          title="下划线"
        >
          <t-icon name="format-underline" />
        </button> -->
        <button
          @click="toggleStrike"
          :class="{ 'is-active': editor?.isActive('strike') }"
          class="toolbar-btn"
          title="删除线"
        >
          <t-icon name="format-strikethrough" />
        </button>
      </div>

      <div class="divider"></div>

      <!-- 标题 -->
      <div class="toolbar-group">
        <button @click="setHeading(1)" :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }" class="toolbar-btn" title="一级标题">
          H1
        </button>
        <button @click="setHeading(2)" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }" class="toolbar-btn" title="二级标题">
          H2
        </button>
        <button @click="setHeading(3)" :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }" class="toolbar-btn" title="三级标题">
          H3
        </button>
        <button @click="setHeading(4)" :class="{ 'is-active': editor?.isActive('heading', { level: 4 }) }" class="toolbar-btn" title="四级标题">
          H4
        </button>
      </div>

      <div class="divider"></div>

      <!-- 列表和引用 -->
      <div class="toolbar-group">
        <button @click="toggleBulletList" :class="{ 'is-active': editor?.isActive('bulletList') }" class="toolbar-btn">
          <t-icon name="format-list-bulleted" />
        </button>
        <button @click="toggleOrderedList" :class="{ 'is-active': editor?.isActive('orderedList') }" class="toolbar-btn">
          <t-icon name="format-list-numbered" />
        </button>
        <button @click="toggleBlockquote" :class="{ 'is-active': editor?.isActive('blockquote') }" class="toolbar-btn">
          <t-icon name="format-quote" />
        </button>
      </div>

      <!-- <div class="divider"></div> -->

      <!-- 插入 -->
      <!-- <div class="toolbar-group">
        <button @click="setLink" class="toolbar-btn" title="插入链接">
          <t-icon name="link" />
        </button>
        <button @click="addImage" class="toolbar-btn" title="插入图片">
          <t-icon name="image" />
        </button>
        <button @click="insertTable" class="toolbar-btn" title="插入表格">
          <t-icon name="table" />
        </button>
      </div> -->

      <div class="divider"></div>

      <!-- 目录按钮 -->
      <div class="toolbar-group">
        <button @click="toggleToc" :class="{ 'is-active': showToc }" class="toolbar-btn" title="显示/隐藏目录">
          <t-icon name="menu-fold" />
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 目录侧边栏 -->
      <div v-if="showToc" class="toc-sidebar">
        <div class="toc-header">
          <span class="toc-title">目录</span>
          <button @click="toggleToc" class="toc-close-btn">
            <t-icon name="close" />
          </button>
        </div>
        <div class="toc-content">
          <div v-if="tocItems.length === 0" class="toc-empty">
            暂无标题
          </div>
          <div
            v-for="item in tocItems"
            :key="item.id"
            :class="['toc-item', `toc-level-${item.level}`]"
            @click="scrollToHeading(item)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>

      <!-- 编辑器 -->
      <EditorContent :editor="editor" class="editor-content" />
    </div>
  </div>
</template>

<style scoped>
.collaborative-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
              0 2px 4px rgba(0, 0, 0, 0.05),
              0 12px 24px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
}

.collaborative-editor:hover {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
              0 4px 8px rgba(0, 0, 0, 0.07),
              0 16px 32px rgba(0, 0, 0, 0.07);
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

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 6px;
  background: #fafafa;
  border-bottom: 1px solid #eaeaea;
  flex-wrap: wrap;
  min-height: 56px;
}

.toolbar-group {
  display: flex;
  gap: 4px;
  padding: 0 4px;
}

.toolbar-btn {
  padding: 8px 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
}

.toolbar-btn:hover {
  background: #ffffff;
  border-color: #eaeaea;
  color: #000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toolbar-btn.is-active {
  background: #000;
  color: #fff;
  border-color: #000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.toolbar-btn:active {
  transform: scale(0.97);
}

.divider {
  width: 1px;
  height: 24px;
  background: #d4d4d4;
  margin: 0 8px;
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 目录侧边栏 */
.toc-sidebar {
  width: 280px;
  border-right: 1px solid #eaeaea;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.toc-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
}

.toc-title {
  font-weight: 600;
  font-size: 13px;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toc-close-btn {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-close-btn:hover {
  background: #f5f5f5;
  color: #000;
}

.toc-close-btn:active {
  transform: scale(0.95);
}

.toc-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
}

.toc-content::-webkit-scrollbar {
  width: 6px;
}

.toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.toc-content::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 3px;
}

.toc-content::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

.toc-empty {
  padding: 48px 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.toc-item {
  padding: 8px 12px;
  margin: 2px 0;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 2px solid transparent;
  border-radius: 6px;
  line-height: 1.5;
  user-select: none;
}

.toc-item:hover {
  background: #ffffff;
  color: #000;
  border-left-color: #000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 不同层级的缩进 */
.toc-level-1 {
  font-weight: 600;
  padding-left: 12px;
  margin-top: 8px;
}

.toc-level-2 {
  font-weight: 500;
  padding-left: 28px;
}

.toc-level-3 {
  padding-left: 44px;
  font-size: 12px;
}

.toc-level-4 {
  padding-left: 60px;
  font-size: 12px;
  color: #999;
}

/* 编辑器内容 */
.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 48px 64px;
  background: #ffffff;
}

.editor-content::-webkit-scrollbar {
  width: 8px;
}

.editor-content::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 4px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 600px;
  max-width: 900px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: #000;
}

.editor-content :deep(.ProseMirror p) {
  margin: 0 0 1em 0;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 2.5em;
  font-weight: 700;
  line-height: 1.2;
  margin: 1.5em 0 0.5em 0;
  color: #000;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 2em;
  font-weight: 600;
  line-height: 1.3;
  margin: 1.3em 0 0.4em 0;
  color: #000;
}

.editor-content :deep(.ProseMirror h3) {
  font-size: 1.5em;
  font-weight: 600;
  line-height: 1.4;
  margin: 1.2em 0 0.4em 0;
  color: #000;
}

.editor-content :deep(.ProseMirror h4) {
  font-size: 1.25em;
  font-weight: 600;
  line-height: 1.5;
  margin: 1em 0 0.3em 0;
  color: #333;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid #000;
  padding-left: 1em;
  margin: 1.5em 0;
  color: #666;
  font-style: italic;
}

.editor-content :deep(.ProseMirror code) {
  background: #f5f5f5;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 0.2em 0.4em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.editor-content :deep(.ProseMirror pre) {
  background: #000;
  color: #fff;
  border-radius: 8px;
  padding: 1em;
  overflow-x: auto;
  margin: 1.5em 0;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #999;
  pointer-events: none;
  height: 0;
}

/* 协同光标样式 */
.editor-content :deep(.collaboration-cursor__caret) {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

.editor-content :deep(.collaboration-cursor__label) {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
</style>
