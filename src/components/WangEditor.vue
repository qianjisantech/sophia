<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref(props.modelValue || '<p>请输入标题</p>')

// 监听外部变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== valueHtml.value) {
    valueHtml.value = newValue || '<p>请输入标题</p>'
  }
})

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    '|',
    'bold',
    'italic',
    'underline',
    'through',
    'clearStyle',
    '|',
    'color',
    'bgColor',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    {
      key: 'group-indent',
      title: '缩进',
      iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
      menuKeys: ['indent', 'delIndent']
    },
    '|',
    'blockquote',
    'codeBlock',
    '|',
    'insertLink',
    'insertImage',
    'insertTable',
    '|',
    'undo',
    'redo'
  ]
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入标题',
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
}

const handleChange = (editor: any) => {
  const html = editor.getHtml()
  emit('update:modelValue', html)
}
</script>

<template>
  <div class="wang-editor-container">
    <Toolbar
      class="wang-toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      class="wang-editor"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<style scoped>
.wang-editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.wang-toolbar {
  border: none !important;
  border-bottom: 1px solid #e8e8e8 !important;
  background: white !important;
}

.wang-editor {
  flex: 1;
  overflow-y: auto;
}

/* 编辑器内容区域样式 */
.wang-editor :deep(.w-e-text-container) {
  background: white !important;
}

.wang-editor :deep(.w-e-text-placeholder) {
  font-size: 36px !important;
  font-weight: 600 !important;
  color: #bfbfbf !important;
  top: 80px !important;
  left: 100px !important;
}

.wang-editor :deep(.w-e-scroll) {
  padding: 80px 100px 200px !important;
  min-height: calc(100vh - 280px) !important;
}

.wang-editor :deep(.w-e-text-container [data-slate-editor]) {
  font-size: 16px;
  line-height: 1.8;
  color: #262626;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.3px;
}

/* 段落样式 */
.wang-editor :deep(.w-e-text-container p) {
  margin: 0.8em 0 !important;
  line-height: 1.8 !important;
}

/* 标题样式 */
.wang-editor :deep(.w-e-text-container h1) {
  font-size: 36px !important;
  font-weight: 600 !important;
  margin: 1.8em 0 0.6em !important;
  line-height: 1.3 !important;
  color: #1a1a1a !important;
  letter-spacing: 0.5px !important;
}

.wang-editor :deep(.w-e-text-container h2) {
  font-size: 28px !important;
  font-weight: 600 !important;
  margin: 1.6em 0 0.6em !important;
  line-height: 1.3 !important;
  color: #1a1a1a !important;
  letter-spacing: 0.3px !important;
}

.wang-editor :deep(.w-e-text-container h3) {
  font-size: 22px !important;
  font-weight: 600 !important;
  margin: 1.4em 0 0.5em !important;
  line-height: 1.4 !important;
  color: #1a1a1a !important;
}

/* 列表样式 */
.wang-editor :deep(.w-e-text-container ul),
.wang-editor :deep(.w-e-text-container ol) {
  padding-left: 1.5em !important;
  margin: 0.8em 0 !important;
}

.wang-editor :deep(.w-e-text-container li) {
  margin: 0.3em 0 !important;
  line-height: 1.8 !important;
}

/* 引用样式 */
.wang-editor :deep(.w-e-text-container blockquote) {
  border-left: 4px solid #0052D9 !important;
  margin: 1.2em 0 !important;
  padding: 0.8em 1.2em !important;
  color: #595959 !important;
  background: #f7f9fc !important;
  border-radius: 0 6px 6px 0 !important;
}

/* 代码块样式 */
.wang-editor :deep(.w-e-text-container pre) {
  background: #2d2d2d !important;
  color: #f8f8f2 !important;
  padding: 1.5em !important;
  border-radius: 8px !important;
  margin: 1em 0 !important;
}

.wang-editor :deep(.w-e-text-container pre code) {
  background: transparent !important;
  color: #f8f8f2 !important;
}

/* 行内代码 */
.wang-editor :deep(.w-e-text-container code) {
  background: #f5f5f5 !important;
  padding: 0.2em 0.5em !important;
  border-radius: 4px !important;
  color: #e83e8c !important;
  border: 1px solid #e7e7e7 !important;
  font-family: 'Monaco', 'Menlo', monospace !important;
}

/* 链接样式 */
.wang-editor :deep(.w-e-text-container a) {
  color: #0052D9 !important;
  text-decoration: none !important;
  border-bottom: 1px solid #0052D9 !important;
}

.wang-editor :deep(.w-e-text-container a:hover) {
  color: #1677FF !important;
  border-bottom-color: #1677FF !important;
  background: #f5f8ff !important;
}

/* 图片样式 */
.wang-editor :deep(.w-e-text-container img) {
  max-width: 100% !important;
  border-radius: 8px !important;
  margin: 1em 0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 表格样式 */
.wang-editor :deep(.w-e-text-container table) {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 1em 0 !important;
  border: 1px solid #e7e7e7 !important;
  border-radius: 4px !important;
}

.wang-editor :deep(.w-e-text-container table td),
.wang-editor :deep(.w-e-text-container table th) {
  border: 1px solid #e7e7e7 !important;
  padding: 8px 12px !important;
}

.wang-editor :deep(.w-e-text-container table th) {
  background: #f5f5f5 !important;
  font-weight: 600 !important;
}

/* 滚动条 */
.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar {
  width: 8px;
}

.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
}

.wang-editor :deep(.w-e-scroll)::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
