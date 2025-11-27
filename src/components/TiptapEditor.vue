<script setup lang="ts">
import { onBeforeUnmount, watch, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showToolbar = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '请输入标题'
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true
    }),
    Link.configure({
      openOnClick: false,
    }),
    Image,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  onSelectionUpdate: () => {
    showToolbar.value = !editor.value?.state.selection.empty || false
  }
})

// 监听外部内容变化
watch(() => props.modelValue, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue
  if (!isSame && editor.value) {
    editor.value.commands.setContent(newValue)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// 工具栏操作
const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run()
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run()
const toggleCode = () => editor.value?.chain().focus().toggleCode().run()
const toggleHighlight = () => editor.value?.chain().focus().toggleHighlight().run()
const setHeading = (level: 1 | 2 | 3) => editor.value?.chain().focus().toggleHeading({ level }).run()
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run()
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run()
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run()
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run()
const setLink = () => {
  const url = prompt('输入链接URL:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}
const addImage = () => {
  const url = prompt('输入图片URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// 检查按钮状态
const isActive = (name: string, attrs?: any) => {
  return editor.value?.isActive(name, attrs) || false
}
</script>

<template>
  <div class="tiptap-editor-container">
    <!-- 浮动工具栏 -->
    <div v-if="showToolbar && editor" class="floating-toolbar">
      <t-button-group size="small">
        <t-button :variant="isActive('bold') ? 'base' : 'outline'" @click="toggleBold" title="粗体">
          <strong>B</strong>
        </t-button>
        <t-button :variant="isActive('italic') ? 'base' : 'outline'" @click="toggleItalic" title="斜体">
          <em>I</em>
        </t-button>
        <t-button :variant="isActive('underline') ? 'base' : 'outline'" @click="toggleUnderline" title="下划线">
          <u>U</u>
        </t-button>
        <t-button :variant="isActive('strike') ? 'base' : 'outline'" @click="toggleStrike" title="删除线">
          <s>S</s>
        </t-button>
      </t-button-group>

      <t-divider layout="vertical" style="margin: 0 8px" />

      <t-button-group size="small">
        <t-button :variant="isActive('heading', { level: 1 }) ? 'base' : 'outline'" @click="() => setHeading(1)" title="标题1">
          H1
        </t-button>
        <t-button :variant="isActive('heading', { level: 2 }) ? 'base' : 'outline'" @click="() => setHeading(2)" title="标题2">
          H2
        </t-button>
        <t-button :variant="isActive('heading', { level: 3 }) ? 'base' : 'outline'" @click="() => setHeading(3)" title="标题3">
          H3
        </t-button>
      </t-button-group>

      <t-divider layout="vertical" style="margin: 0 8px" />

      <t-button-group size="small">
        <t-button :variant="isActive('bulletList') ? 'base' : 'outline'" @click="toggleBulletList" title="无序列表">
          <t-icon name="format-list-bulleted" />
        </t-button>
        <t-button :variant="isActive('orderedList') ? 'base' : 'outline'" @click="toggleOrderedList" title="有序列表">
          <t-icon name="format-list-numbered" />
        </t-button>
      </t-button-group>

      <t-divider layout="vertical" style="margin: 0 8px" />

      <t-button-group size="small">
        <t-button :variant="isActive('blockquote') ? 'base' : 'outline'" @click="toggleBlockquote" title="引用">
          <t-icon name="format-quote" />
        </t-button>
        <t-button :variant="isActive('code') ? 'base' : 'outline'" @click="toggleCode" title="行内代码">
          <t-icon name="code" />
        </t-button>
        <t-button :variant="isActive('codeBlock') ? 'base' : 'outline'" @click="toggleCodeBlock" title="代码块">
          <t-icon name="terminal" />
        </t-button>
      </t-button-group>

      <t-divider layout="vertical" style="margin: 0 8px" />

      <t-button-group size="small">
        <t-button :variant="isActive('highlight') ? 'base' : 'outline'" @click="toggleHighlight" title="高亮">
          <t-icon name="format-color-fill" />
        </t-button>
        <t-button :variant="isActive('link') ? 'base' : 'outline'" @click="setLink" title="链接">
          <t-icon name="link" />
        </t-button>
        <t-button variant="outline" @click="addImage" title="图片">
          <t-icon name="image" />
        </t-button>
      </t-button-group>
    </div>

    <!-- 编辑器内容 -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.tiptap-editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  overflow: hidden;
}

.floating-toolbar {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 80px 100px 200px;
}

.editor-content :deep(.ProseMirror) {
  min-height: calc(100vh - 280px);
  outline: none;
  font-size: 16px;
  line-height: 1.8;
  color: #262626;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.3px;
}

/* Placeholder 样式 */
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #bfbfbf;
  pointer-events: none;
  height: 0;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 段落样式 */
.editor-content :deep(.ProseMirror p) {
  margin: 0.8em 0;
  line-height: 1.8;
}

.editor-content :deep(.ProseMirror p:first-child) {
  margin-top: 0;
}

.editor-content :deep(.ProseMirror p:empty) {
  min-height: 1.8em;
}

/* 标题样式 */
.editor-content :deep(.ProseMirror h1) {
  font-size: 36px;
  font-weight: 600;
  margin: 1.8em 0 0.6em;
  line-height: 1.3;
  color: #1a1a1a;
  padding-bottom: 0.3em;
  letter-spacing: 0.5px;
}

.editor-content :deep(.ProseMirror h1:first-child) {
  margin-top: 0;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 28px;
  font-weight: 600;
  margin: 1.6em 0 0.6em;
  line-height: 1.3;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.editor-content :deep(.ProseMirror h3) {
  font-size: 22px;
  font-weight: 600;
  margin: 1.4em 0 0.5em;
  line-height: 1.4;
  color: #1a1a1a;
}

/* 列表样式 */
.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.editor-content :deep(.ProseMirror li) {
  margin: 0.3em 0;
  line-height: 1.8;
}

.editor-content :deep(.ProseMirror li p) {
  margin: 0;
}

/* 引用样式 */
.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid #0052D9;
  margin: 1.2em 0;
  padding: 0.8em 1.2em;
  color: #595959;
  background: #f7f9fc;
  border-radius: 0 6px 6px 0;
  font-size: 15px;
}

.editor-content :deep(.ProseMirror blockquote p) {
  margin: 0.5em 0;
}

/* 代码样式 */
.editor-content :deep(.ProseMirror code) {
  background: #f5f5f5;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.9em;
  color: #e83e8c;
  border: 1px solid #e7e7e7;
}

.editor-content :deep(.ProseMirror pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1.5em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
  border: 1px solid #404040;
}

.editor-content :deep(.ProseMirror pre code) {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 14px;
  color: #f8f8f2;
  border: none;
}

/* 分割线样式 */
.editor-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid #e7e7e7;
  margin: 2em 0;
}

/* 链接样式 */
.editor-content :deep(.ProseMirror a) {
  color: #0052D9;
  text-decoration: none;
  border-bottom: 1px solid #0052D9;
  transition: all 0.2s;
}

.editor-content :deep(.ProseMirror a:hover) {
  color: #1677FF;
  border-bottom-color: #1677FF;
  background: #f5f8ff;
}

/* 高亮样式 */
.editor-content :deep(.ProseMirror mark) {
  background-color: #fff3cd;
  border-radius: 3px;
  padding: 0.1em 0.2em;
}

/* 图片样式 */
.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 表格样式 */
.editor-content :deep(.ProseMirror table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 1em 0;
  overflow: hidden;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
}

.editor-content :deep(.ProseMirror table td),
.editor-content :deep(.ProseMirror table th) {
  min-width: 1em;
  border: 1px solid #e7e7e7;
  padding: 8px 12px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

.editor-content :deep(.ProseMirror table th) {
  font-weight: 600;
  text-align: left;
  background-color: #f5f5f5;
}

/* 选中状态 */
.editor-content :deep(.ProseMirror .ProseMirror-selectednode) {
  outline: 2px solid #0052D9;
  border-radius: 4px;
}

/* 滚动条样式 */
.editor-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.editor-content::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
