<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '../stores/document'
import { MessagePlugin } from 'tdesign-vue-next'
import WangEditor from '../components/WangEditor.vue'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()

// 接收来自Layout的props
const props = defineProps<{
  sidebarVisible?: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const docId = computed(() => route.params.id as string)
const currentDocument = computed(() => documentStore.documents.find(d => d.id === docId.value))

// 转换 updatedAt 为数字时间戳
const updatedAtTimestamp = computed(() => {
  if (!currentDocument.value?.updatedAt) return undefined

  const updatedAt = currentDocument.value.updatedAt

  // 如果已经是数字，直接返回
  if (typeof updatedAt === 'number') {
    return updatedAt
  }

  // 如果是字符串，转换为时间戳
  if (typeof updatedAt === 'string') {
    const date = new Date(updatedAt)
    return date.getTime()
  }

  return undefined
})

// 文件路径（面包屑）
const breadcrumbs = computed(() => {
  const crumbs: { name: string; path?: string }[] = []

  if (currentDocument.value) {
    // 如果有文件夹
    if (currentDocument.value.folder) {
      crumbs.push({
        name: currentDocument.value.folder,
        path: '/' // 可以点击回到首页
      })
    }

    // 添加当前文档名
    crumbs.push({
      name: currentDocument.value.title || '无标题文档'
    })
  }

  return crumbs
})

const title = ref('')
const content = ref('')
const isSaving = ref(false)
const lastSavedTime = ref<Date | null>(null)
const showOutline = ref(true)
const wordCount = ref(0)

// 大纲数据
interface OutlineItem {
  id: string
  level: number
  text: string
  tag: string
}
const outlineItems = ref<OutlineItem[]>([])

// 文档统计信息
const docStats = computed(() => {
  const text = content.value.replace(/<[^>]*>/g, '')
  const chars = text.length
  const charsNoSpace = text.replace(/\s+/g, '').length
  const paragraphs = content.value.split(/<\/p>/gi).length - 1
  const lines = text.split('\n').length

  return {
    chars,
    charsNoSpace,
    words: charsNoSpace,
    paragraphs,
    lines
  }
})

// UI状态
const showDocInfo = ref(false)
const showFindReplace = ref(false)
const showExportDialog = ref(false)
const showShareDialog = ref(false)
const isFullscreen = ref(false)
const isFocusMode = ref(false)

// 分享链接
const shareLink = computed(() => {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/document/${docId.value}`
  }
  return `https://your-domain.com/document/${docId.value}`
})

// 查找替换
const findText = ref('')
const replaceText = ref('')
const findResults = ref(0)

// 初始化文档内容
onMounted(async () => {
  // 如果本地没有，从 API 加载
  if (!currentDocument.value) {
    await documentStore.loadDocumentById(docId.value)
  }

  if (currentDocument.value) {
    title.value = currentDocument.value.title
    content.value = currentDocument.value.content
    documentStore.setCurrentDocument(docId.value)
    updateWordCount()
    // 初始化大纲
    extractOutline()
  } else {
    MessagePlugin.error('文档不存在')
    router.push('/home')
  }
})

// 自动保存
let saveTimer: number | null = null
let outlineTimer: number | null = null

watch([title, content], () => {
  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(() => {
    saveDocument()
  }, 1000)

  updateWordCount()

  // 延迟更新大纲，避免频繁解析
  if (outlineTimer) clearTimeout(outlineTimer)
  outlineTimer = setTimeout(() => {
    extractOutline()
  }, 500)
})

// 保存文档
const saveDocument = async () => {
  if (!currentDocument.value) return

  isSaving.value = true

  // 模拟保存延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  documentStore.updateDocument(docId.value, {
    title: title.value || '无标题文档',
    content: content.value
  })

  lastSavedTime.value = new Date()
  isSaving.value = false
}

// 计算字数
const updateWordCount = () => {
  const text = content.value.replace(/<[^>]*>/g, '').replace(/\s+/g, '')
  wordCount.value = text.length
}

// 提取大纲
const extractOutline = () => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content.value, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5')

  const items: OutlineItem[] = []
  headings.forEach((heading, index) => {
    const tag = heading.tagName.toLowerCase()
    const level = parseInt(tag.charAt(1))
    const text = heading.textContent?.trim() || ''

    if (text) {
      items.push({
        id: `heading-${index}`,
        level,
        text,
        tag
      })
    }
  })

  outlineItems.value = items
}

// 跳转到标题
const scrollToHeading = (id: string) => {
  // 从编辑器中查找对应的标题元素
  const editorElement = document.querySelector('.wang-editor .w-e-scroll')
  if (!editorElement) return

  const headings = editorElement.querySelectorAll('h1, h2, h3, h4, h5')
  const index = parseInt(id.replace('heading-', ''))

  if (headings[index]) {
    const element = headings[index] as HTMLElement
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // 高亮效果
    const originalBg = element.style.backgroundColor
    element.style.backgroundColor = 'rgba(51, 112, 255, 0.1)'
    element.style.transition = 'background-color 0.3s ease'

    setTimeout(() => {
      element.style.backgroundColor = originalBg
      setTimeout(() => {
        element.style.transition = ''
      }, 300)
    }, 1000)
  }
}

// 切换大纲显示
const toggleOutline = () => {
  showOutline.value = !showOutline.value
}

// 切换文档信息面板
const toggleDocInfo = () => {
  showDocInfo.value = !showDocInfo.value
}

// 切换查找替换
const toggleFindReplace = () => {
  showFindReplace.value = !showFindReplace.value
}

// 查找功能
const handleFind = () => {
  if (!findText.value) return
  const text = content.value.replace(/<[^>]*>/g, '')
  const regex = new RegExp(findText.value, 'gi')
  const matches = text.match(regex)
  findResults.value = matches ? matches.length : 0

  if (findResults.value > 0) {
    MessagePlugin.success(`找到 ${findResults.value} 个匹配项`)
  } else {
    MessagePlugin.warning('未找到匹配项')
  }
}

// 替换功能
const handleReplace = () => {
  if (!findText.value) return
  const regex = new RegExp(findText.value, 'g')
  content.value = content.value.replace(regex, replaceText.value)
  MessagePlugin.success('替换完成')
  findText.value = ''
  replaceText.value = ''
  showFindReplace.value = false
}

// 导出功能
const handleExport = (format: string) => {
  const docTitle = title.value || '未命名文档'

  switch (format) {
    case 'html':
      exportAsHtml(docTitle)
      break
    case 'markdown':
      exportAsMarkdown(docTitle)
      break
    case 'txt':
      exportAsText(docTitle)
      break
    case 'pdf':
      MessagePlugin.info('PDF导出功能开发中...')
      break
    case 'word':
      MessagePlugin.info('Word导出功能开发中...')
      break
  }
  showExportDialog.value = false
}

// 导出为HTML
const exportAsHtml = (filename: string) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { font-size: 32px; font-weight: 600; margin: 32px 0 16px; }
    h2 { font-size: 24px; font-weight: 600; margin: 28px 0 14px; }
    h3 { font-size: 20px; font-weight: 600; margin: 24px 0 12px; }
    p { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>${title.value}</h1>
  ${content.value}
</body>
</html>
  `
  downloadFile(htmlContent, `${filename}.html`, 'text/html')
}

// 导出为Markdown
const exportAsMarkdown = (filename: string) => {
  // 简单的HTML到Markdown转换
  let markdown = `# ${title.value}\n\n`
  markdown += content.value
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n')
    .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<[^>]*>/g, '')

  downloadFile(markdown, `${filename}.md`, 'text/markdown')
}

// 导出为纯文本
const exportAsText = (filename: string) => {
  const text = `${title.value}\n\n` + content.value.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n\n')
  downloadFile(text, `${filename}.txt`, 'text/plain')
}

// 下载文件
const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  MessagePlugin.success('导出成功')
}

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

// 切换专注模式
const toggleFocusMode = () => {
  isFocusMode.value = !isFocusMode.value
}

// 分享文档
const handleShare = () => {
  showShareDialog.value = true
}

// 退出登录
const handleLogout = () => {
  // 清除本地存储的用户信息
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')

  // 显示提示
  MessagePlugin.success('已退出登录')

  // 跳转到登录页面
  setTimeout(() => {
    router.push('/login')
  }, 500)
}

// 复制分享链接
const copyShareLink = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareLink.value)
      MessagePlugin.success('链接已复制到剪贴板')
    } else {
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = shareLink.value
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      MessagePlugin.success('链接已复制到剪贴板')
    }
  } catch (error) {
    console.error('复制失败:', error)
    MessagePlugin.error('复制失败，请手动复制链接')
  }
}

// 格式化日期时间
const formatDateTime = (timestamp: number | string | undefined) => {
  if (!timestamp) return '-'

  // 支持字符串和数字两种格式
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="document-editor-page" v-if="currentDocument">
      <!-- 顶部导航栏 -->
      <div class="top-nav">
        <div class="nav-left">
          <!-- 面包屑导航 -->
          <div class="breadcrumb-nav">
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <span
                v-if="crumb.path"
                class="breadcrumb-item clickable"
                @click="router.push(crumb.path)"
              >
                {{ crumb.name }}
              </span>
              <span v-else class="breadcrumb-item current">
                {{ crumb.name }}
              </span>
              <t-icon
                v-if="index < breadcrumbs.length - 1"
                name="chevron-right"
                size="16px"
                class="breadcrumb-separator"
              />
            </template>
          </div>
      </div>

      <div class="nav-right">
        <span class="word-count" @click="toggleDocInfo" style="cursor: pointer;">
          {{ docStats.words }} 字
        </span>

        <!-- 查找替换 -->
        <t-button variant="text" shape="square" title="查找替换" @click="toggleFindReplace">
          <t-icon name="search" />
        </t-button>

        <!-- 导出 -->
        <t-dropdown
          :options="[
            { content: '导出为 HTML', value: 'html', prefixIcon: () => $h('t-icon', { name: 'file-copy' }) },
            { content: '导出为 Markdown', value: 'markdown', prefixIcon: () => $h('t-icon', { name: 'file-word' }) },
            { content: '导出为 TXT', value: 'txt', prefixIcon: () => $h('t-icon', { name: 'file' }) },
            { divider: true },
            { content: '导出为 PDF', value: 'pdf', prefixIcon: () => $h('t-icon', { name: 'file-pdf' }) },
            { content: '导出为 Word', value: 'word', prefixIcon: () => $h('t-icon', { name: 'file-word' }) }
          ]"
          @click="(data: any) => handleExport(data.value)"
        >
          <t-button variant="text" shape="square" title="导出">
            <t-icon name="download" />
          </t-button>
        </t-dropdown>

        <!-- 专注模式 -->
        <t-button
          variant="text"
          shape="square"
          title="专注模式"
          @click="toggleFocusMode"
          :class="{ 'active-btn': isFocusMode }"
        >
          <t-icon name="fullscreen" />
        </t-button>

        <!-- 保存按钮 -->
        <t-button
          theme="primary"
          variant="outline"
          @click="saveDocument"
          :loading="isSaving"
        >
          保存
        </t-button>

        <!-- 分享 -->
        <t-button variant="outline" @click="handleShare">
          <template #icon><t-icon name="share" /></template>
          分享
        </t-button>

        <t-button variant="text" shape="square">
          <t-icon name="ellipsis" />
        </t-button>

        <!-- 用户头像下拉菜单 -->
        <t-dropdown :min-column-width="160" trigger="click">
          <t-avatar size="32px" style="cursor: pointer;">User</t-avatar>
          <template #dropdown>
            <t-dropdown-menu>
              <t-dropdown-item>
                <t-icon name="user" />
                个人中心
              </t-dropdown-item>
              <t-dropdown-item>
                <t-icon name="setting" />
                设置
              </t-dropdown-item>
              <t-dropdown-item divider />
              <t-dropdown-item @click="handleLogout">
                <t-icon name="poweroff" />
                退出登录
              </t-dropdown-item>
            </t-dropdown-menu>
          </template>
        </t-dropdown>
      </div>
    </div>


    <!-- 编辑器主体 -->
    <div class="editor-main">
      <!-- 左侧大纲 -->
      <div v-if="showOutline" class="outline-sidebar">
        <div class="outline-content">
          <div class="outline-list" v-if="outlineItems.length > 0">
            <div
              v-for="item in outlineItems"
              :key="item.id"
              :class="['outline-item', `outline-level-${item.level}`]"
              @click="scrollToHeading(item.id)"
            >
              <span class="outline-item-text">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑器内容区 -->
      <div class="editor-content-wrapper">
        <div class="editor-container">
          <WangEditor
            v-model="content"
            v-model:title="title"
            :creator="currentDocument?.creator"
            :updated-at="updatedAtTimestamp"
          />
        </div>
      </div>
    </div>

    <!-- 查找替换面板 -->
    <div v-if="showFindReplace" class="find-replace-panel">
      <div class="panel-header">
        <span>查找和替换</span>
        <t-button variant="text" size="small" @click="showFindReplace = false">
          <t-icon name="close" />
        </t-button>
      </div>
      <div class="panel-content">
        <t-input
          v-model="findText"
          placeholder="查找内容"
          clearable
          @enter="handleFind"
        >
          <template #prefix-icon>
            <t-icon name="search" />
          </template>
        </t-input>
        <t-input
          v-model="replaceText"
          placeholder="替换为"
          clearable
          style="margin-top: 8px;"
        />
        <div class="panel-actions">
          <t-button size="small" variant="outline" @click="handleFind">
            查找
          </t-button>
          <t-button size="small" theme="primary" @click="handleReplace">
            全部替换
          </t-button>
        </div>
        <div v-if="findResults > 0" class="find-results">
          找到 {{ findResults }} 个匹配项
        </div>
      </div>
    </div>

    <!-- 文档信息面板 -->
    <t-drawer
      v-model:visible="showDocInfo"
      header="文档信息"
      size="360px"
      placement="right"
      :footer="false"
    >
      <div class="doc-info-panel">
        <div class="info-section">
          <div class="info-title">文档统计</div>
          <div class="info-item">
            <span class="info-label">字数</span>
            <span class="info-value">{{ docStats.words }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">字符数（含空格）</span>
            <span class="info-value">{{ docStats.chars }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">字符数（不含空格）</span>
            <span class="info-value">{{ docStats.charsNoSpace }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">段落数</span>
            <span class="info-value">{{ docStats.paragraphs }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">标题数</span>
            <span class="info-value">{{ outlineItems.length }}</span>
          </div>
        </div>

        <t-divider />

        <div class="info-section">
          <div class="info-title">文档属性</div>
          <div class="info-item">
            <span class="info-label">创建时间</span>
            <span class="info-value">{{ formatDateTime(currentDocument?.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">修改时间</span>
            <span class="info-value">{{ formatDateTime(currentDocument?.updatedAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建者</span>
            <span class="info-value">{{ currentDocument?.creator || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最后修改者</span>
            <span class="info-value">{{ currentDocument?.updater || '未知' }}</span>
          </div>
        </div>

        <t-divider />

        <div class="info-section">
          <div class="info-title">文档位置</div>
          <div class="info-item">
            <span class="info-label">文件夹</span>
            <span class="info-value">{{ currentDocument?.folder || '我的文档' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">文档ID</span>
            <span class="info-value" style="font-family: monospace; font-size: 11px;">{{ currentDocument?.id }}</span>
          </div>
        </div>
      </div>
    </t-drawer>

    <!-- 分享对话框 -->
    <t-dialog
      v-model:visible="showShareDialog"
      header="分享文档"
      width="500px"
      :footer="false"
    >
      <div class="share-dialog-content">
        <div class="share-link-section">
          <div class="share-label">分享链接</div>
          <div class="share-link-input">
            <t-input
              :value="shareLink"
              readonly
            />
            <t-button theme="primary" @click="copyShareLink">
              <template #icon><t-icon name="link" /></template>
              复制链接
            </t-button>
          </div>
        </div>

        <t-divider />

        <div class="share-qr-section">
          <div class="share-label">扫码分享</div>
          <div class="share-qr-placeholder">
            <t-icon name="qrcode" size="48px" style="color: #BBBFC4;" />
            <p>二维码生成功能开发中</p>
          </div>
        </div>

        <t-divider />

        <div class="share-permissions-section">
          <div class="share-label">权限设置</div>
          <t-radio-group value="view" style="margin-top: 12px;">
            <t-radio value="view">仅查看</t-radio>
            <t-radio value="comment">可评论</t-radio>
            <t-radio value="edit">可编辑</t-radio>
          </t-radio-group>
        </div>
      </div>
    </t-dialog>
  </div>
</template>


<style scoped>
.document-editor-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #FAFBFC;
}

/* 面包屑导航 */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.breadcrumb-item {
  font-size: 14px;
  color: #646A73;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.breadcrumb-item.clickable {
  cursor: pointer;
  color: #646A73;
}

.breadcrumb-item.clickable:hover {
  color: #3370FF;
}

.breadcrumb-item.current {
  color: #1F2329;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #C9CDD4;
  flex-shrink: 0;
}

/* 飞书风格的顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #E3E6EB;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0; /* 允许面包屑在空间不足时收缩 */
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-right :deep(.t-button) {
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-right :deep(.t-button--primary) {
  background: linear-gradient(135deg, #0052D9 0%, #1677FF 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.2);
}

.nav-right :deep(.t-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.3);
}

.word-count {
  font-size: 13px;
  color: #646A73;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.word-count:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #3370FF;
}

/* 用户下拉菜单样式 */
.nav-right :deep(.t-dropdown-menu) {
  padding: 4px;
}

.nav-right :deep(.t-dropdown-item) {
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-right :deep(.t-dropdown-item:hover) {
  background: #F2F3F5;
}

.nav-right :deep(.t-dropdown-item .t-icon) {
  font-size: 16px;
  color: #646A73;
}

.nav-right :deep(.t-dropdown-item:last-child) {
  color: #E34D59;
}

.nav-right :deep(.t-dropdown-item:last-child:hover) {
  background: #FEF0F0;
  color: #E34D59;
}

.nav-right :deep(.t-dropdown-item:last-child .t-icon) {
  color: #E34D59;
}

.active-btn {
  background: rgba(51, 112, 255, 0.1) !important;
  color: #3370FF !important;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #FFFFFF;
}

/* 飞书风格的目录侧边栏 */
.outline-sidebar {
  width: 240px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
}

.outline-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 飞书风格滚动条 */
.outline-content::-webkit-scrollbar {
  width: 6px;
}

.outline-content::-webkit-scrollbar-track {
  background: transparent;
}

.outline-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
}

.outline-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

/* 大纲列表 */
.outline-list {
  padding: 8px 0;
}

.outline-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 2px 8px;
  font-size: 13px;
  color: #1F2329;
  line-height: 1.6;
  border-left: 2px solid transparent;
  position: relative;
}

.outline-item:hover {
  background: #F2F3F5;
  border-left-color: #3370FF;
}

.outline-item-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 不同层级的缩进 */
.outline-level-1 {
  padding-left: 16px;
  font-weight: 600;
  font-size: 14px;
  color: #1F2329;
}

.outline-level-2 {
  padding-left: 28px;
  font-weight: 500;
  color: #1F2329;
}

.outline-level-3 {
  padding-left: 40px;
  font-weight: 400;
  color: #646A73;
}

.outline-level-4 {
  padding-left: 52px;
  font-weight: 400;
  color: #646A73;
  font-size: 12px;
}

.outline-level-5 {
  padding-left: 64px;
  font-weight: 400;
  color: #8F959E;
  font-size: 12px;
}

.editor-content-wrapper {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 0;
  background: #FFFFFF;
}

/* 飞书风格滚动条 */
.editor-content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.editor-content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

.editor-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

.editor-container {
  width: 100%;
  max-width: 900px;
  background: white;
  min-height: 100%;
  margin: 0 auto;
  border-radius: 0;
  box-shadow: none;
  border: none;
  height: auto;
}

/* ===== 移动端适配 (768px以下) ===== */
@media (max-width: 768px) {
  .document-editor-page {
    overflow: hidden;
  }

  /* 顶部导航栏适配 */
  .top-nav {
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav-left {
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  /* 移动端面包屑样式 */
  .breadcrumb-nav {
    gap: 4px;
    overflow: hidden;
  }

  .breadcrumb-item {
    font-size: 13px;
    max-width: 120px;
  }

  .breadcrumb-separator {
    font-size: 14px;
  }

  .document-title-section {
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  .title-input {
    font-size: 14px;
    padding: 3px 6px;
    min-width: 0;
    width: 100%;
  }

  .doc-meta {
    font-size: 11px;
    gap: 4px;
  }

  .nav-right {
    gap: 6px;
  }

  /* 隐藏不必要的按钮 */
  .word-count {
    display: none;
  }

  .nav-right :deep(.t-button:not(:first-child):not(:last-child)) {
    display: none;
  }

  .nav-right :deep(.t-dropdown) {
    display: none;
  }

  /* 编辑器主体适配 */
  .editor-main {
    position: relative;
  }

  /* 隐藏左侧大纲 */
  .outline-sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 1000;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  .outline-sidebar.show {
    left: 0;
  }

  /* 编辑器内容区域全宽 */
  .editor-content-wrapper {
    padding: 0;
    background: white;
  }

  .editor-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
    min-height: calc(100vh - 60px);
  }

  /* WangEditor 内部样式调整 */
  .editor-container :deep(.w-e-text-container) {
    padding: 12px;
  }

  .editor-container :deep(.w-e-toolbar) {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    border-bottom: 1px solid #E3E6EB;
  }
}

/* ===== 查找替换面板 ===== */
.find-replace-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E3E6EB;
  font-weight: 600;
  color: #1F2329;
}

.panel-content {
  padding: 20px;
}

.panel-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.find-results {
  margin-top: 12px;
  font-size: 12px;
  color: #646A73;
  text-align: center;
}

/* ===== 文档信息面板 ===== */
.doc-info-panel {
  padding: 20px;
}

.info-section {
  margin-bottom: 20px;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #1F2329;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #F2F3F5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: #646A73;
}

.info-value {
  font-size: 13px;
  color: #1F2329;
  font-weight: 500;
}

/* ===== 分享对话框 ===== */
.share-dialog-content {
  padding: 20px;
}

.share-label {
  font-size: 14px;
  font-weight: 600;
  color: #1F2329;
  margin-bottom: 12px;
}

.share-link-section {
  margin-bottom: 24px;
}

.share-link-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.share-link-input :deep(.t-input) {
  flex: 1;
}

.share-qr-section {
  margin-bottom: 24px;
}

.share-qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #F7F8FA;
  border-radius: 8px;
  border: 2px dashed #DEE0E3;
}

.share-qr-placeholder p {
  margin-top: 12px;
  font-size: 13px;
  color: #8F959E;
}

.share-permissions-section {
  margin-bottom: 0;
}

/* ===== 专注模式样式 ===== */
.document-editor-page.focus-mode .outline-sidebar {
  display: none;
}

.document-editor-page.focus-mode .editor-content-wrapper {
  max-width: 100%;
}

/* ===== 超小屏幕适配 (480px以下) ===== */
@media (max-width: 480px) {
  .top-nav {
    padding: 6px 10px;
  }

  /* 超小屏面包屑样式 */
  .breadcrumb-nav {
    gap: 3px;
  }

  .breadcrumb-item {
    font-size: 12px;
    max-width: 80px;
  }

  .breadcrumb-separator {
    font-size: 12px;
  }

  .title-input {
    font-size: 13px;
    padding: 2px 4px;
  }

  .doc-meta {
    font-size: 10px;
    gap: 3px;
  }

  .nav-right {
    gap: 4px;
  }

  .nav-right :deep(.t-button) {
    padding: 4px 8px;
    font-size: 12px;
  }

  .editor-container :deep(.w-e-text-container) {
    padding: 10px;
  }

  /* 简化工具栏图标 */
  .editor-container :deep(.w-e-toolbar) {
    flex-wrap: wrap;
    padding: 4px;
  }

  .editor-container :deep(.w-e-toolbar .w-e-bar-item) {
    padding: 4px;
  }
}
</style>
