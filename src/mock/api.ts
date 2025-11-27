import type { Document } from '../stores/document'
import { getDB, setDB } from './data'

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 模拟网络延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 生成 ID
const generateId = () => Date.now().toString()

// Mock API 服务
export const mockApi = {
  // 获取文档列表
  async getDocuments(params?: { keyword?: string; folder?: string }): Promise<ApiResponse<Document[]>> {
    await delay()

    let documents = getDB()

    // 搜索过滤
    if (params?.keyword) {
      const keyword = params.keyword.toLowerCase()
      documents = documents.filter(doc =>
        doc.title.toLowerCase().includes(keyword) ||
        doc.content.toLowerCase().includes(keyword)
      )
    }

    // 文件夹过滤
    if (params?.folder) {
      documents = documents.filter(doc => doc.folder === params.folder)
    }

    return {
      code: 200,
      message: 'success',
      data: documents
    }
  },

  // 获取单个文档
  async getDocumentById(id: string): Promise<ApiResponse<Document | null>> {
    await delay()

    const documents = getDB()
    const document = documents.find(doc => doc.id === id)

    if (!document) {
      return {
        code: 404,
        message: '文档不存在',
        data: null
      }
    }

    return {
      code: 200,
      message: 'success',
      data: document
    }
  },

  // 创建文档
  async createDocument(data: {
    title: string
    type?: 'document' | 'spreadsheet'
    folder?: string
    content?: string
  }): Promise<ApiResponse<Document>> {
    await delay()

    const documents = getDB()
    const newDoc: Document = {
      id: generateId(),
      title: data.title || '无标题文档',
      type: data.type || 'document',
      content: data.content || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      folder: data.folder
    }

    documents.unshift(newDoc)
    setDB(documents)

    return {
      code: 200,
      message: '创建成功',
      data: newDoc
    }
  },

  // 更新文档
  async updateDocument(id: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>): Promise<ApiResponse<Document>> {
    await delay()

    const documents = getDB()
    const index = documents.findIndex(doc => doc.id === id)

    if (index === -1) {
      return {
        code: 404,
        message: '文档不存在',
        data: null as any
      }
    }

    const current = documents[index]
    const updated: Document = {
      ...current,
      ...updates,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: Date.now()
    }

    documents[index] = updated
    setDB(documents)

    return {
      code: 200,
      message: '更新成功',
      data: updated
    }
  },

  // 删除文档
  async deleteDocument(id: string): Promise<ApiResponse<boolean>> {
    await delay()

    const documents = getDB()
    const index = documents.findIndex(doc => doc.id === id)

    if (index === -1) {
      return {
        code: 404,
        message: '文档不存在',
        data: false
      }
    }

    documents.splice(index, 1)
    setDB(documents)

    return {
      code: 200,
      message: '删除成功',
      data: true
    }
  },

  // 批量删除文档
  async batchDeleteDocuments(ids: string[]): Promise<ApiResponse<number>> {
    await delay()

    const documents = getDB()
    const filtered = documents.filter(doc => !ids.includes(doc.id))
    const deletedCount = documents.length - filtered.length

    setDB(filtered)

    return {
      code: 200,
      message: `成功删除 ${deletedCount} 个文档`,
      data: deletedCount
    }
  },

  // 获取文件夹列表
  async getFolders(): Promise<ApiResponse<string[]>> {
    await delay()

    const documents = getDB()
    const folders = new Set<string>()

    documents.forEach(doc => {
      if (doc.folder) {
        folders.add(doc.folder)
      }
    })

    return {
      code: 200,
      message: 'success',
      data: Array.from(folders)
    }
  },

  // 移动文档到文件夹
  async moveToFolder(id: string, folder: string): Promise<ApiResponse<Document>> {
    await delay()

    return mockApi.updateDocument(id, { folder })
  },

  // 复制文档
  async duplicateDocument(id: string): Promise<ApiResponse<Document>> {
    await delay()

    const documents = getDB()
    const original = documents.find(doc => doc.id === id)

    if (!original) {
      return {
        code: 404,
        message: '文档不存在',
        data: null as any
      }
    }

    const duplicate: Document = {
      ...original,
      id: generateId(),
      title: `${original.title} (副本)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    documents.unshift(duplicate)
    setDB(documents)

    return {
      code: 200,
      message: '复制成功',
      data: duplicate
    }
  }
}
