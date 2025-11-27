<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '请输入标题'
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
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
</script>

<template>
  <div class="editor-container">
    <!-- 编辑器 -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  overflow: hidden;
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

.editor-content :deep(.ProseMirror h4) {
  font-size: 18px;
  font-weight: 600;
  margin: 1.2em 0 0.5em;
  line-height: 1.4;
  color: #262626;
}

/* 列表样式 */
.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 0.75em 0;
}

.editor-content :deep(.ProseMirror li) {
  margin: 0.3em 0;
  line-height: 1.75;
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

/* 粗体、斜体、删除线样式 */
.editor-content :deep(.ProseMirror strong) {
  font-weight: 600;
  color: #1f1f1f;
}

.editor-content :deep(.ProseMirror em) {
  font-style: italic;
}

.editor-content :deep(.ProseMirror s) {
  text-decoration: line-through;
  color: #8a8a8a;
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
