<template>
  <div class="mindmap-wrapper">
    <div ref="containerRef" class="mindmap-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Graph } from '@antv/x6'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const containerRef = ref<HTMLDivElement | null>(null)
let graph: Graph | null = null

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
  graph.use(
    new Clipboard({
      enabled: true,
    })
  )

  graph.use(
    new History({
      enabled: true,
    })
  )

  graph.use(
    new Keyboard({
      enabled: true,
    })
  )

  graph.use(
    new Selection({
      enabled: true,
      rubberband: true,
      showNodeSelectionBox: true,
    })
  )

  // 键盘快捷键
  graph.bindKey('ctrl+c', () => {
    const cells = graph!.getSelectedCells()
    if (cells.length) {
      graph!.copy(cells)
    }
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
    if (cells.length) {
      graph!.removeCells(cells)
    }
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

  // 监听变化
  graph.on('node:added', () => {
    saveData()
  })

  graph.on('node:removed', () => {
    saveData()
  })

  graph.on('node:changed', () => {
    saveData()
  })

  graph.on('edge:added', () => {
    saveData()
  })

  graph.on('edge:removed', () => {
    saveData()
  })

  // 加载初始数据
  loadData()
}

// 加载数据
const loadData = () => {
  if (!graph) return

  try {
    if (props.modelValue) {
      const data = JSON.parse(props.modelValue)
      graph.fromJSON(data)
    } else {
      // 创建默认的中心节点
      createDefaultMindmap()
    }
  } catch (e) {
    console.error('Failed to load mindmap data:', e)
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
  saveData()
}

// 保存数据
const saveData = () => {
  if (!graph) return

  const data = graph.toJSON()
  emit('update:modelValue', JSON.stringify(data))
}

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  if (!graph || !newValue) return

  try {
    const data = JSON.parse(newValue)
    const currentData = JSON.stringify(graph.toJSON())
    const newData = JSON.stringify(data)

    if (currentData !== newData) {
      graph.fromJSON(data)
    }
  } catch (e) {
    console.error('Failed to update mindmap data:', e)
  }
})

onMounted(() => {
  initGraph()

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
})
</script>

<style scoped>
.mindmap-wrapper {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
}

.mindmap-container {
  width: 100%;
  height: 100%;
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
