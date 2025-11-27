<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const content = ref(props.modelValue || '')

watch(() => props.modelValue, (newValue) => {
  content.value = newValue || ''
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="simple-editor">
    <div class="editor-info">
      <p>简单编辑器 - 测试用</p>
      <p style="color: #666; font-size: 12px;">如果你能看到这个，说明Vue组件正常工作</p>
    </div>
    <textarea
      :value="content"
      @input="handleInput"
      placeholder="请输入内容..."
      class="editor-textarea"
    />
  </div>
</template>

<style scoped>
.simple-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: white;
}

.editor-info {
  margin-bottom: 20px;
  padding: 20px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}

.editor-info p {
  margin: 5px 0;
}

.editor-textarea {
  flex: 1;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  resize: none;
}

.editor-textarea:focus {
  outline: none;
  border-color: #0052D9;
}
</style>
