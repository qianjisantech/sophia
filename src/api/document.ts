import { mockApi } from '../mock/api'
import type { Document } from '../stores/document'
import type { ApiResponse } from '../mock/api'

// 是否使用 Mock 数据
const USE_MOCK = true

// 文档 API 服务
export const documentApi = {
  /**
   * 获取文档列表
   * @param params 查询参数
   */
  async getList(params?: { keyword?: string; folder?: string }): Promise<ApiResponse<Document[]>> {
    if (USE_MOCK) {
      return mockApi.getDocuments(params)
    }

    // TODO: 调用真实 API
    // const response = await fetch('/api/documents?' + new URLSearchParams(params))
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 获取单个文档详情
   * @param id 文档 ID
   */
  async getById(id: string): Promise<ApiResponse<Document | null>> {
    if (USE_MOCK) {
      return mockApi.getDocumentById(id)
    }

    // TODO: 调用真实 API
    // const response = await fetch(`/api/documents/${id}`)
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 创建文档
   * @param data 文档数据
   */
  async create(data: {
    title: string
    type?: 'document' | 'spreadsheet'
    folder?: string
    content?: string
  }): Promise<ApiResponse<Document>> {
    if (USE_MOCK) {
      return mockApi.createDocument(data)
    }

    // TODO: 调用真实 API
    // const response = await fetch('/api/documents', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 更新文档
   * @param id 文档 ID
   * @param updates 更新数据
   */
  async update(id: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>): Promise<ApiResponse<Document>> {
    if (USE_MOCK) {
      return mockApi.updateDocument(id, updates)
    }

    // TODO: 调用真实 API
    // const response = await fetch(`/api/documents/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // })
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 删除文档
   * @param id 文档 ID
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    if (USE_MOCK) {
      return mockApi.deleteDocument(id)
    }

    // TODO: 调用真实 API
    // const response = await fetch(`/api/documents/${id}`, {
    //   method: 'DELETE'
    // })
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 批量删除文档
   * @param ids 文档 ID 数组
   */
  async batchDelete(ids: string[]): Promise<ApiResponse<number>> {
    if (USE_MOCK) {
      return mockApi.batchDeleteDocuments(ids)
    }

    // TODO: 调用真实 API
    // const response = await fetch('/api/documents/batch-delete', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ids })
    // })
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 获取文件夹列表
   */
  async getFolders(): Promise<ApiResponse<string[]>> {
    if (USE_MOCK) {
      return mockApi.getFolders()
    }

    // TODO: 调用真实 API
    // const response = await fetch('/api/folders')
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 移动文档到文件夹
   * @param id 文档 ID
   * @param folder 文件夹名称
   */
  async moveToFolder(id: string, folder: string): Promise<ApiResponse<Document>> {
    if (USE_MOCK) {
      return mockApi.moveToFolder(id, folder)
    }

    // TODO: 调用真实 API
    // const response = await fetch(`/api/documents/${id}/move`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ folder })
    // })
    // return response.json()

    throw new Error('Real API not implemented')
  },

  /**
   * 复制文档
   * @param id 文档 ID
   */
  async duplicate(id: string): Promise<ApiResponse<Document>> {
    if (USE_MOCK) {
      return mockApi.duplicateDocument(id)
    }

    // TODO: 调用真实 API
    // const response = await fetch(`/api/documents/${id}/duplicate`, {
    //   method: 'POST'
    // })
    // return response.json()

    throw new Error('Real API not implemented')
  }
}
