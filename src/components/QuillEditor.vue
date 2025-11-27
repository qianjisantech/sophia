<script setup lang="ts">
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const content = ref(props.modelValue || '')

// 监听外部内容变化
watch(() => props.modelValue, (newValue) => {
  if (content.value !== newValue) {
    content.value = newValue || ''
  }
})

// 监听编辑器内容变化
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})

const editorOptions = {
  theme: 'snow',
  placeholder: '请输入标题'
}
</script>

<template>
  <div class="quill-editor-container">
    <QuillEditor
      v-model:content="content"
      :options="editorOptions"
      contentType="html"
      class="quill-editor"
    />
  </div>
</template>

<style scoped>
.quill-editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.quill-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Quill工具栏样式 */
.quill-editor :deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid #e7e7e7;
  padding: 12px 100px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.quill-editor :deep(.ql-container) {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
  border: none;
}

.quill-editor :deep(.ql-editor) {
  padding: 80px 100px 200px;
  min-height: calc(100vh - 280px);
  color: #262626;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* 占位符样式 */
.quill-editor :deep(.ql-editor.ql-blank::before) {
  color: #bfbfbf;
  font-size: 36px;
  font-weight: 600;
  font-style: normal;
  left: 100px;
  right: 100px;
}

/* 标题样式 */
.quill-editor :deep(.ql-editor h1) {
  font-size: 36px;
  font-weight: 600;
  margin: 1.8em 0 0.6em;
  line-height: 1.3;
  color: #1a1a1a;
  letter-spacing: 0.5px;
}

.quill-editor :deep(.ql-editor h2) {
  font-size: 28px;
  font-weight: 600;
  margin: 1.6em 0 0.6em;
  line-height: 1.3;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.quill-editor :deep(.ql-editor h3) {
  font-size: 22px;
  font-weight: 600;
  margin: 1.4em 0 0.5em;
  line-height: 1.4;
  color: #1a1a1a;
}

.quill-editor :deep(.ql-editor h4) {
  font-size: 18px;
  font-weight: 600;
  margin: 1.2em 0 0.5em;
  line-height: 1.4;
  color: #262626;
}

/* 段落样式 */
.quill-editor :deep(.ql-editor p) {
  margin: 0.8em 0;
  line-height: 1.8;
}

/* 列表样式 */
.quill-editor :deep(.ql-editor ul),
.quill-editor :deep(.ql-editor ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.quill-editor :deep(.ql-editor li) {
  margin: 0.3em 0;
  line-height: 1.8;
}

/* 引用样式 */
.quill-editor :deep(.ql-editor blockquote) {
  border-left: 4px solid #0052D9;
  margin: 1.2em 0;
  padding: 0.8em 1.2em;
  color: #595959;
  background: #f7f9fc;
  border-radius: 0 6px 6px 0;
  font-size: 15px;
}

/* 代码块样式 */
.quill-editor :deep(.ql-editor pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1.5em;
  border-radius: 8px;
  margin: 1em 0;
  overflow-x: auto;
}

.quill-editor :deep(.ql-editor code) {
  background: #f5f5f5;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  color: #e83e8c;
  border: 1px solid #e7e7e7;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}

.quill-editor :deep(.ql-editor pre.ql-syntax) {
  background: #2d2d2d;
  color: #f8f8f2;
}

/* 链接样式 */
.quill-editor :deep(.ql-editor a) {
  color: #0052D9;
  text-decoration: none;
  border-bottom: 1px solid #0052D9;
  transition: all 0.2s;
}

.quill-editor :deep(.ql-editor a:hover) {
  color: #1677FF;
  border-bottom-color: #1677FF;
  background: #f5f8ff;
}

/* 图片样式 */
.quill-editor :deep(.ql-editor img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 分割线 */
.quill-editor :deep(.ql-editor hr) {
  border: none;
  border-top: 2px solid #e7e7e7;
  margin: 2em 0;
}

/* 滚动条样式 */
.quill-editor :deep(.ql-editor)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.quill-editor :deep(.ql-editor)::-webkit-scrollbar-track {
  background: transparent;
}

.quill-editor :deep(.ql-editor)::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
}

.quill-editor :deep(.ql-editor)::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
