import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { documentApi } from '../api/document'

export interface Document {
  id: string
  title: string
  content: string
  createdAt: string | number
  updatedAt: string | number
  folder?: string
  folderId?: string // 所属文件夹ID
  parentId?: string // 父文件夹ID（用于层级结构）
  type?: 'document' | 'spreadsheet' | 'mindmap' | 'folder' | 'slide' | 'flowchart' | 'whiteboard' // 文档类型
  creator?: string // 创建者
  updater?: string // 更新者
  isShared?: boolean // 是否为共享文档
  isFavorite?: boolean // 是否收藏
  isDeleted?: boolean // 是否已删除
}

export const useDocumentStore = defineStore('document', () => {
  // 状态
  const documents = ref<Document[]>([])
  const currentDocumentId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentDocument = computed(() => {
    return documents.value.find(doc => doc.id === currentDocumentId.value)
  })

  const documentsByFolder = computed(() => {
    const grouped: Record<string, Document[]> = {}
    documents.value.forEach(doc => {
      const folder = doc.folder || '未分类'
      if (!grouped[folder]) {
        grouped[folder] = []
      }
      grouped[folder].push(doc)
    })
    return grouped
  })

  // 获取所有文件夹（包括我的文档和共享文档）
  const folders = computed(() => {
    return documents.value.filter(doc => doc.type === 'folder')
  })

  // 获取我的文档文件夹
  const myFolders = computed(() => {
    const currentUser = localStorage.getItem('username') || 'demo'
    return folders.value.filter(folder =>
      !folder.isShared && (folder.creator === currentUser || !folder.creator)
    )
  })

  // 获取共享文档文件夹
  const sharedFolders = computed(() => {
    return folders.value.filter(folder => folder.isShared)
  })

  // 方法

  /**
   * 加载文档列表
   */
  const loadDocuments = async (params?: { keyword?: string; folder?: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await documentApi.getList(params)

      if (response.code === 200) {
        documents.value = response.data
      } else {
        error.value = response.message
      }
    } catch (e: any) {
      error.value = e.message || '加载文档失败'
      console.error('Failed to load documents:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载单个文档
   */
  const loadDocumentById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await documentApi.getById(id)

      if (response.code === 200 && response.data) {
        // 更新或添加到列表中
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value[index] = response.data
        } else {
          documents.value.push(response.data)
        }
        return response.data
      } else {
        error.value = response.message
        return null
      }
    } catch (e: any) {
      error.value = e.message || '加载文档失败'
      console.error('Failed to load document:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建文档
   */
  const createDocument = async (
    title: string = '无标题文档',
    type: 'document' | 'spreadsheet' = 'document',
    folder?: string
  ): Promise<Document | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await documentApi.create({
        title,
        type,
        folder,
        content: type === 'document' ? '' : JSON.stringify([{ name: 'Sheet1', rows: {} }])
      })

      if (response.code === 200) {
        documents.value.unshift(response.data)
        return response.data
      } else {
        error.value = response.message
        return null
      }
    } catch (e: any) {
      error.value = e.message || '创建文档失败'
      console.error('Failed to create document:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新文档
   */
  const updateDocument = async (id: string, updates: Partial<Omit<Document, 'id'>>) => {
    try {
      const response = await documentApi.update(id, updates)

      if (response.code === 200) {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value[index] = response.data
        }
      } else {
        error.value = response.message
      }
    } catch (e: any) {
      error.value = e.message || '更新文档失败'
      console.error('Failed to update document:', e)
    }
  }

  /**
   * 删除文档
   */
  const deleteDocument = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await documentApi.delete(id)

      if (response.code === 200) {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value.splice(index, 1)
        }
      } else {
        error.value = response.message
      }
    } catch (e: any) {
      error.value = e.message || '删除文档失败'
      console.error('Failed to delete document:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除文档
   */
  const batchDeleteDocuments = async (ids: string[]) => {
    loading.value = true
    error.value = null

    try {
      const response = await documentApi.batchDelete(ids)

      if (response.code === 200) {
        documents.value = documents.value.filter(doc => !ids.includes(doc.id))
      } else {
        error.value = response.message
      }
    } catch (e: any) {
      error.value = e.message || '批量删除失败'
      console.error('Failed to batch delete documents:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 复制文档
   */
  const duplicateDocument = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await documentApi.duplicate(id)

      if (response.code === 200) {
        documents.value.unshift(response.data)
        return response.data
      } else {
        error.value = response.message
        return null
      }
    } catch (e: any) {
      error.value = e.message || '复制文档失败'
      console.error('Failed to duplicate document:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置当前文档
   */
  const setCurrentDocument = (id: string | null) => {
    currentDocumentId.value = id
  }

  /**
   * 搜索文档（本地搜索）
   */
  const searchDocuments = (keyword: string): Document[] => {
    if (!keyword) return documents.value
    return documents.value.filter(doc =>
      doc.title.toLowerCase().includes(keyword.toLowerCase()) ||
      doc.content.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  /**
   * 获取文件夹下的所有文档和子文件夹
   */
  const getDocumentsByFolderId = (folderId: string): Document[] => {
    return documents.value.filter(doc => doc.folderId === folderId || doc.parentId === folderId)
  }

  /**
   * 根据ID获取文档
   */
  const getDocumentById = (id: string): Document | undefined => {
    return documents.value.find(doc => doc.id === id)
  }

  return {
    documents,
    currentDocumentId,
    currentDocument,
    documentsByFolder,
    folders,
    myFolders,
    sharedFolders,
    loading,
    error,
    loadDocuments,
    loadDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    batchDeleteDocuments,
    duplicateDocument,
    setCurrentDocument,
    searchDocuments,
    getDocumentsByFolderId,
    getDocumentById
  }
})
