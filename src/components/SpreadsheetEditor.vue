<template>
  <div class="spreadsheet-wrapper">
    <div ref="spreadsheetContainer" class="spreadsheet-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Spreadsheet from 'x-data-spreadsheet'
import 'x-data-spreadsheet/dist/locale/zh-cn'
import 'x-data-spreadsheet/dist/xspreadsheet.css'

interface Props {
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const spreadsheetContainer = ref<HTMLDivElement | null>(null)
let spreadsheetInstance: any = null

onMounted(() => {
  if (spreadsheetContainer.value) {
    // 初始化配置
    const options = {
      mode: 'edit',
      showToolbar: true,
      showGrid: true,
      showContextmenu: true,
      view: {
        height: () => window.innerHeight - 200,
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

    // 初始化表格
    spreadsheetInstance = new Spreadsheet(spreadsheetContainer.value, options)

    // 如果有初始数据，加载它
    if (props.modelValue) {
      try {
        const data = typeof props.modelValue === 'string'
          ? JSON.parse(props.modelValue)
          : props.modelValue

        console.log('Loading spreadsheet data:', data)

        // x-spreadsheet 期望的是数组格式
        if (Array.isArray(data)) {
          spreadsheetInstance.loadData(data)
        } else {
          // 如果是单个对象，包装成数组
          spreadsheetInstance.loadData([data])
        }
      } catch (e) {
        console.error('Failed to load spreadsheet data:', e)
        // 如果加载失败，设置默认数据
        spreadsheetInstance.loadData([{
          name: 'Sheet1',
          rows: {}
        }])
      }
    } else {
      // 设置默认数据
      spreadsheetInstance.loadData([{
        name: 'Sheet1',
        rows: {}
      }])
    }

    // 监听变化
    spreadsheetInstance.change((data: any) => {
      const jsonData = spreadsheetInstance.getData()
      emit('update:modelValue', JSON.stringify(jsonData))
    })
  }
})

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  if (spreadsheetInstance && newValue) {
    try {
      const data = typeof newValue === 'string' ? JSON.parse(newValue) : newValue
      const currentData = JSON.stringify(spreadsheetInstance.getData())
      const newData = JSON.stringify(data)

      if (currentData !== newData) {
        spreadsheetInstance.loadData(data)
      }
    } catch (e) {
      console.error('Failed to update spreadsheet data:', e)
    }
  }
})

onBeforeUnmount(() => {
  if (spreadsheetInstance) {
    // x-spreadsheet 没有显式的 destroy 方法，直接清空引用
    spreadsheetInstance = null
  }
})
</script>

<style scoped>
.spreadsheet-wrapper {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

.spreadsheet-container {
  width: 100%;
  height: 100%;
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
