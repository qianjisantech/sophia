<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch, nextTick, computed, toRefs } from 'vue'
import { Editor } from '@wangeditor/editor-for-vue'
import { IEditorConfig } from '@wangeditor/editor'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  modelValue: string
  title?: string
  creator?: string
  updatedAt?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:title', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用 toRefs 保持响应性
const { creator, updatedAt } = toRefs(props)

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 标题
const titleValue = ref(props.title || '')

// 内容 HTML
const valueHtml = ref(props.modelValue || '<p>输入正文</p>')

// 工具菜单状态
const showToolMenu = ref(false)
const toolMenuPosition = ref({ top: 0, left: 0 })
const currentBlock = ref<HTMLElement | null>(null)

// 全屏状态
const isFullscreen = ref(false)

// 字数统计
const wordCount = computed(() => {
  const editor = editorRef.value
  if (!editor) return 0
  const text = editor.getText()
  return text.trim().length
})

// 图片上传文件输入
const imageInputRef = ref<HTMLInputElement | null>(null)

// 格式化时间
const formatTime = (timestamp?: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 1分钟内
  if (diff < 60000) {
    return '刚刚'
  }
  // 1小时内
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 今天
  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  // 其他
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 监听外部变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== valueHtml.value) {
    valueHtml.value = newValue || '<p>输入正文</p>'
    debouncedAttachBlockHandlers()
  }
})

watch(() => props.title, (newValue) => {
  if (newValue !== titleValue.value) {
    titleValue.value = newValue || ''
  }
})

// 标题输入处理
const handleTitleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  titleValue.value = target.value
  emit('update:title', target.value)
  // 自动调整高度
  autoResizeTextarea(target)
}

// 自动调整 textarea 高度
const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '输入正文',
  MENU_CONF: {}
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor
  debouncedAttachBlockHandlers()
}

const handleChange = (editor: any) => {
  const html = editor.getHtml()
  emit('update:modelValue', html)
  debouncedAttachBlockHandlers()
}

// 撤销
const handleUndo = () => {
  const editor = editorRef.value
  if (editor) {
    editor.undo()
  }
}

// 重做
const handleRedo = () => {
  const editor = editorRef.value
  if (editor) {
    editor.redo()
  }
}

// 全屏切换
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

// 图片上传
const handleImageUpload = () => {
  imageInputRef.value?.click()
}

const handleImageSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    // 创建本地预览 URL
    const url = URL.createObjectURL(file)
    const editor = editorRef.value
    if (editor) {
      // 插入图片
      editor.dangerouslyInsertHtml(`<img src="${url}" alt="${file.name}" />`)
    }
  }
  // 重置 input
  if (target) target.value = ''
}

// 拖拽上传
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      const editor = editorRef.value
      if (editor) {
        editor.dangerouslyInsertHtml(`<img src="${url}" alt="${file.name}" />`)
      }
    }
  }
}

// 附加块处理器（为每个块添加加号按钮）
const attachBlockHandlers = () => {
  const editorElement = document.querySelector('.wang-editor .w-e-text-container [data-slate-editor]')
  if (!editorElement) return

  // 移除旧的加号按钮
  document.querySelectorAll('.block-add-btn').forEach(btn => btn.remove())

  // 为每个块元素添加加号按钮
  const blocks = editorElement.querySelectorAll('p, h1, h2, h3, h4, h5, ul, ol, blockquote, pre')
  blocks.forEach((block: Element) => {
    const htmlBlock = block as HTMLElement

    // 避免重复添加
    if (htmlBlock.style.position === 'relative') return

    htmlBlock.style.position = 'relative'

    // 创建加号按钮
    const addBtn = document.createElement('div')
    addBtn.className = 'block-add-btn'
    addBtn.contentEditable = 'false'  // 让编辑器忽略这个元素
    addBtn.setAttribute('data-slate-void', 'true')  // Slate 专用标记
    addBtn.innerHTML = '<svg viewBox="0 0 1024 1024" width="16" height="16"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 213.333334a32 32 0 0 0-32 32v149.333333H330.666667a32 32 0 0 0 0 64h149.333333v149.333333a32 32 0 0 0 64 0v-149.333333h149.333333a32 32 0 0 0 0-64h-149.333333V330.666667a32 32 0 0 0-32-32z" fill="currentColor"></path></svg>'

    addBtn.addEventListener('mouseenter', (e) => {
      currentBlock.value = htmlBlock
      const rect = addBtn.getBoundingClientRect()
      const containerRect = document.querySelector('.wang-editor-container')?.getBoundingClientRect()

      if (containerRect) {
        // 菜单出现在按钮右侧，垂直居中对齐
        toolMenuPosition.value = {
          top: rect.top - containerRect.top,
          left: rect.right - containerRect.left + 8  // 按钮右边 + 8px 间距
        }
      }
      showToolMenu.value = true
    })

    htmlBlock.appendChild(addBtn)
  })
}

// 使用防抖优化块处理器的调用
const debouncedAttachBlockHandlers = useDebounceFn(() => {
  nextTick(() => {
    attachBlockHandlers()
  })
}, 300)

// 工具菜单项 - 增强版
const toolMenuItems = [
  { icon: '📝', label: '文本', command: 'paragraph', description: '普通文本段落' },
  { icon: 'H1', label: '标题 1', command: 'h1', description: '一级标题' },
  { icon: 'H2', label: '标题 2', command: 'h2', description: '二级标题' },
  { icon: 'H3', label: '标题 3', command: 'h3', description: '三级标题' },
  { icon: '●', label: '无序列表', command: 'bulletedList', description: '项目符号列表' },
  { icon: '1.', label: '有序列表', command: 'numberedList', description: '数字编号列表' },
  { icon: '❝', label: '引用', command: 'blockquote', description: '引用文本' },
  { icon: '<>', label: '代码块', command: 'codeBlock', description: '代码片段' },
  { icon: '—', label: '分割线', command: 'divider', description: '水平分割线' },
  { icon: '🖼️', label: '图片', command: 'image', description: '插入图片' },
]

// 执行工具命令
const executeCommand = (command: string) => {
  const editor = editorRef.value
  if (!editor || !currentBlock.value) return

  // 特殊命令处理
  if (command === 'image') {
    handleImageUpload()
    showToolMenu.value = false
    return
  }

  // 聚焦到当前块
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(currentBlock.value)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)

  // 执行不同的命令
  switch (command) {
    case 'paragraph':
      document.execCommand('formatBlock', false, 'p')
      break
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
      document.execCommand('formatBlock', false, command)
      break
    case 'bulletedList':
      document.execCommand('insertUnorderedList', false)
      break
    case 'numberedList':
      document.execCommand('insertOrderedList', false)
      break
    case 'bold':
      document.execCommand('bold', false)
      break
    case 'italic':
      document.execCommand('italic', false)
      break
    case 'underline':
      document.execCommand('underline', false)
      break
    case 'divider':
      document.execCommand('insertHorizontalRule', false)
      break
  }

  showToolMenu.value = false

  // 触发更新
  debouncedAttachBlockHandlers()
}

onMounted(() => {
  // 点击外部关闭菜单
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.tool-menu') && !target.closest('.block-add-btn')) {
      showToolMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)

  // 键盘快捷键
  const handleKeydown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + Z: 撤销
    if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      handleUndo()
    }
    // Cmd/Ctrl + Shift + Z: 重做
    else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      handleRedo()
    }
    // Cmd/Ctrl + F: 全屏
    else if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault()
      toggleFullscreen()
    }
  }
  document.addEventListener('keydown', handleKeydown)

  // 清理
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<template>
  <div class="wang-editor-container" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- 飞书风格标题输入区 -->
    <div class="document-header">
      <textarea
        v-model="titleValue"
        @input="handleTitleInput"
        class="title-input"
        placeholder="无标题"
        rows="1"
      ></textarea>

      <!-- 文档信息 -->
      <div class="document-meta" v-if="creator || updatedAt">
        <span v-if="creator" class="meta-item">
          <t-icon name="user" size="14px" />
          {{ creator }}
        </span>
        <span v-if="updatedAt" class="meta-item">
          <t-icon name="time" size="14px" />
          {{ formatTime(updatedAt) }}编辑
        </span>
      </div>
    </div>

    <!-- 正文编辑器 -->
    <div
      class="editor-wrapper"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <Editor
        class="wang-editor"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>

    <!-- 隐藏的图片上传 input -->
    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleImageSelected"
    />

    <!-- 工具菜单 - 增强版 -->
    <div
      v-if="showToolMenu"
      class="tool-menu"
      :style="{
        top: toolMenuPosition.top + 'px',
        left: toolMenuPosition.left + 'px'
      }"
      @mouseenter="showToolMenu = true"
      @mouseleave="showToolMenu = false"
    >
      <div class="tool-menu-header">
        <span>转换为</span>
      </div>
      <div class="tool-menu-items">
        <div
          v-for="item in toolMenuItems"
          :key="item.command"
          class="tool-menu-item"
          @click="executeCommand(item.command)"
        >
          <span class="tool-icon">{{ item.icon }}</span>
          <div class="tool-info">
            <span class="tool-label">{{ item.label }}</span>
            <span class="tool-description">{{ item.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wang-editor-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wang-editor-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: white;
}

/* 编辑器包装器 */
.editor-wrapper {
  flex: 1;
  overflow: visible;
  position: relative;
}

/* 飞书风格文档标题区域 */
.document-header {
  padding: 48px 48px 20px;
  background: white;
  border-bottom: none;
  animation: fadeInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: #1F2329;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  resize: none;
  overflow: hidden;
  background: transparent;
  padding: 0;
  letter-spacing: -0.5px;
  transition: all 0.2s ease;
}

.title-input::placeholder {
  color: #BBBFC4;
  font-weight: 700;
}

.title-input:focus::placeholder {
  color: #E3E5E8;
}

/* 文档元信息 */
.document-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px solid #F0F0F0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #8F959E;
  transition: color 0.2s ease;
}

.meta-item:hover {
  color: #646A73;
}

.meta-item :deep(.t-icon) {
  color: #C9CDD4;
}

/* 工具栏 */
.wang-toolbar {
  border: none !important;
  border-top: 1px solid #F0F0F0 !important;
  border-bottom: 1px solid #F0F0F0 !important;
  background: white !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
  padding: 8px 16px !important;
  box-shadow: none !important;
  transition: box-shadow 0.2s ease !important;
}

/* 工具栏内部容器 */
.wang-toolbar :deep(.w-e-toolbar) {
  padding: 0 !important;
  width: 100% !important;
  flex-wrap: wrap !important;
}

.wang-toolbar:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}

/* 正文编辑器 */
.wang-editor {
  flex: 1;
  overflow-y: visible;
}

/* 编辑器内容区域样式 */
.wang-editor :deep(.w-e-text-container) {
  background: white !important;
}

.wang-editor :deep(.w-e-text-placeholder) {
  font-size: 16px !important;
  font-weight: 400 !important;
  color: #BBBFC4 !important;
  top: 0 !important;
  left: 48px !important;
}

.wang-editor :deep(.w-e-scroll) {
  padding: 0 48px 200px !important;
  min-height: calc(100vh - 400px) !important;
}

.wang-editor :deep(.w-e-text-container [data-slate-editor]) {
  font-size: 16px;
  line-height: 1.75;
  color: #1F2329;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0;
}

/* 段落样式 */
.wang-editor :deep(.w-e-text-container p) {
  margin: 8px 0 !important;
  line-height: 1.75 !important;
  color: #1F2329 !important;
}

/* 第一个段落去掉顶部 margin */
.wang-editor :deep(.w-e-text-container [data-slate-editor] > p:first-child) {
  margin-top: 0 !important;
}

/* 标题样式 - 飞书风格 */
.wang-editor :deep(.w-e-text-container h1) {
  font-size: 32px !important;
  font-weight: 600 !important;
  margin: 32px 0 16px !important;
  line-height: 1.4 !important;
  color: #1F2329 !important;
  letter-spacing: -0.5px !important;
}

.wang-editor :deep(.w-e-text-container h2) {
  font-size: 24px !important;
  font-weight: 600 !important;
  margin: 28px 0 14px !important;
  line-height: 1.4 !important;
  color: #1F2329 !important;
  letter-spacing: -0.3px !important;
}

.wang-editor :deep(.w-e-text-container h3) {
  font-size: 20px !important;
  font-weight: 600 !important;
  margin: 24px 0 12px !important;
  line-height: 1.5 !important;
  color: #1F2329 !important;
}

.wang-editor :deep(.w-e-text-container h4) {
  font-size: 18px !important;
  font-weight: 600 !important;
  margin: 20px 0 10px !important;
  line-height: 1.5 !important;
  color: #1F2329 !important;
}

/* 列表样式 */
.wang-editor :deep(.w-e-text-container ul),
.wang-editor :deep(.w-e-text-container ol) {
  padding-left: 24px !important;
  margin: 8px 0 !important;
}

.wang-editor :deep(.w-e-text-container li) {
  margin: 4px 0 !important;
  line-height: 1.75 !important;
  color: #1F2329 !important;
}

/* 引用样式 - 飞书风格 */
.wang-editor :deep(.w-e-text-container blockquote) {
  border-left: 4px solid #3370FF !important;
  margin: 16px 0 !important;
  padding: 12px 16px !important;
  color: #646A73 !important;
  background: #F7F8FA !important;
  border-radius: 0 4px 4px 0 !important;
  font-size: 15px !important;
}

/* 代码块样式 - 飞书风格 */
.wang-editor :deep(.w-e-text-container pre) {
  background: #1F2329 !important;
  color: #E8EAED !important;
  padding: 16px 20px !important;
  border-radius: 6px !important;
  margin: 16px 0 !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
}

.wang-editor :deep(.w-e-text-container pre code) {
  background: transparent !important;
  color: #E8EAED !important;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace !important;
}

/* 行内代码 - 飞书风格 */
.wang-editor :deep(.w-e-text-container code) {
  background: #F2F3F5 !important;
  padding: 2px 6px !important;
  border-radius: 3px !important;
  color: #F54A45 !important;
  border: none !important;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace !important;
  font-size: 14px !important;
}

/* 链接样式 - 飞书风格 */
.wang-editor :deep(.w-e-text-container a) {
  color: #3370FF !important;
  text-decoration: none !important;
  border-bottom: 1px solid transparent !important;
  transition: all 0.2s ease !important;
}

.wang-editor :deep(.w-e-text-container a:hover) {
  color: #1456F0 !important;
  border-bottom-color: #1456F0 !important;
}

/* 图片样式 */
.wang-editor :deep(.w-e-text-container img) {
  max-width: 100% !important;
  border-radius: 4px !important;
  margin: 16px 0 !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
}

/* 表格样式 - 飞书风格 */
.wang-editor :deep(.w-e-text-container table) {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 16px 0 !important;
  border: 1px solid #DEE0E3 !important;
  border-radius: 4px !important;
  overflow: hidden !important;
}

.wang-editor :deep(.w-e-text-container table td),
.wang-editor :deep(.w-e-text-container table th) {
  border: 1px solid #DEE0E3 !important;
  padding: 10px 12px !important;
  color: #1F2329 !important;
}

.wang-editor :deep(.w-e-text-container table th) {
  background: #F7F8FA !important;
  font-weight: 600 !important;
  color: #646A73 !important;
}

.wang-editor :deep(.w-e-text-container table tr:hover) {
  background: #F7F8FA !important;
}

/* 分割线 */
.wang-editor :deep(.w-e-text-container hr) {
  border: none !important;
  border-top: 1px solid #DEE0E3 !important;
  margin: 24px 0 !important;
}

/* 滚动条 - 飞书风格 */
.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar-track {
  background: transparent;
}

.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar-thumb {
  background: #DEE0E3;
  border-radius: 3px;
}

.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar-thumb:hover {
  background: #C9CDD4;
}

/* 工具栏样式优化 */
.wang-toolbar :deep(.w-e-bar-item) {
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

.wang-toolbar :deep(.w-e-bar-item:hover) {
  background: #F2F3F5 !important;
}

.wang-toolbar :deep(.w-e-bar-item.active) {
  background: #E8F3FF !important;
  color: #3370FF !important;
}

/* 块级加号按钮 - 始终显示版 */
:deep(.block-add-btn) {
  position: absolute;
  left: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.25;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #C9CDD4;
  background: transparent;
  border-radius: 4px;
  z-index: 10;
}

/* 悬停在行上时，加号更明显 */
:deep(p:hover .block-add-btn),
:deep(h1:hover .block-add-btn),
:deep(h2:hover .block-add-btn),
:deep(h3:hover .block-add-btn),
:deep(h4:hover .block-add-btn),
:deep(h5:hover .block-add-btn),
:deep(ul:hover .block-add-btn),
:deep(ol:hover .block-add-btn),
:deep(blockquote:hover .block-add-btn),
:deep(pre:hover .block-add-btn) {
  opacity: 0.6;
  color: #8F959E;
}

/* 直接悬停在加号上时，完全显示并高亮 */
:deep(.block-add-btn:hover) {
  opacity: 1 !important;
  color: #3370FF;
  background: #F2F3F5;
  transform: translateY(-50%) scale(1.15);
}

:deep(.block-add-btn svg) {
  width: 16px;
  height: 16px;
}

/* 工具菜单 - 全新设计 */
.tool-menu {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(31, 35, 41, 0.12),
              0 0 1px rgba(31, 35, 41, 0.08);
  z-index: 1000;
  min-width: 260px;
  max-width: 280px;
  overflow: hidden;
  animation: toolMenuSlideIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

@keyframes toolMenuSlideIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tool-menu-header {
  padding: 10px 14px;
  border-bottom: 1px solid #F0F0F0;
  font-size: 11px;
  font-weight: 600;
  color: #8F959E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #FAFBFC;
}

/* 工具菜单箭头（指向左侧的按钮） */
.tool-menu::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 12px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid white;
  filter: drop-shadow(-2px 0 2px rgba(31, 35, 41, 0.08));
}

.tool-menu-items {
  padding: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.tool-menu-items::-webkit-scrollbar {
  width: 6px;
}

.tool-menu-items::-webkit-scrollbar-track {
  background: transparent;
}

.tool-menu-items::-webkit-scrollbar-thumb {
  background: #DEE0E3;
  border-radius: 3px;
}

.tool-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.tool-menu-item:hover {
  background: #F2F3F5;
  transform: translateX(2px);
}

.tool-menu-item:active {
  background: #E8EAED;
  transform: translateX(2px) scale(0.98);
}

.tool-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: #F7F8FA;
  border-radius: 6px;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-menu-item:hover .tool-icon {
  background: white;
  box-shadow: 0 2px 4px rgba(31, 35, 41, 0.08);
}

.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.tool-label {
  font-size: 14px;
  font-weight: 500;
  color: #1F2329;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-description {
  font-size: 12px;
  color: #8F959E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .editor-toolbar {
    padding: 8px 16px;
  }

  .document-header {
    padding: 32px 16px 16px;
  }

  .wang-editor :deep(.w-e-scroll) {
    padding: 24px 16px 120px !important;
  }

  .wang-editor :deep(.w-e-text-placeholder) {
    left: 16px !important;
  }

  .title-input {
    font-size: 32px;
  }

  .tool-menu {
    max-width: calc(100vw - 32px);
  }
}
</style>
