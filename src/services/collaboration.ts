/**
 * 协同编辑服务
 * 管理 Yjs 文档和 WebSocket 连接
 */

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export interface CollaborationUser {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
}

export interface CollaborationOptions {
  documentId: string
  username?: string
  wsUrl?: string
  onConnected?: () => void
  onDisconnected?: () => void
  onUsersChanged?: (users: CollaborationUser[]) => void
  onSynced?: (isSynced: boolean) => void
}

/**
 * 协同编辑管理器
 */
export class CollaborationManager {
  private ydoc: Y.Doc
  private provider: WebsocketProvider | null = null
  private documentId: string
  private wsUrl: string
  private username: string
  private userColor: string
  private options: CollaborationOptions

  constructor(options: CollaborationOptions) {
    this.options = options
    this.documentId = options.documentId
    this.wsUrl = options.wsUrl || 'ws://localhost:1234'
    this.username = options.username || `User-${Math.floor(Math.random() * 1000)}`
    this.userColor = this.generateUserColor()

    // 创建 Yjs 文档
    this.ydoc = new Y.Doc()
  }

  /**
   * 连接到协同服务器
   */
  connect(): WebsocketProvider {
    if (this.provider) {
      console.warn('Already connected')
      return this.provider
    }

    console.log(`🔗 Connecting to ${this.wsUrl}/${this.documentId}`)

    // 创建 WebSocket 提供者
    this.provider = new WebsocketProvider(
      this.wsUrl,
      this.documentId,
      this.ydoc
    )

    // 设置用户信息到 awareness
    if (this.provider.awareness) {
      this.provider.awareness.setLocalStateField('user', {
        name: this.username,
        color: this.userColor
      })
    }

    // 监听连接状态
    this.provider.on('status', (event: { status: string }) => {
      console.log('WebSocket status:', event.status)

      if (event.status === 'connected') {
        console.log('✅ Connected to collaboration server')
        this.options.onConnected?.()
      } else if (event.status === 'disconnected') {
        console.log('❌ Disconnected from collaboration server')
        this.options.onDisconnected?.()
      }
    })

    // 监听同步状态
    this.provider.on('sync', (isSynced: boolean) => {
      console.log('Sync status:', isSynced ? '✅ Synced' : '⏳ Syncing...')
      this.options.onSynced?.(isSynced)
    })

    // 监听用户变化
    if (this.provider.awareness) {
      this.provider.awareness.on('change', () => {
        const users = this.getOnlineUsers()
        this.options.onUsersChanged?.(users)
      })
    }

    return this.provider
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.provider) {
      this.provider.disconnect()
      this.provider.destroy()
      this.provider = null
      console.log('🔌 Disconnected')
    }
  }

  /**
   * 获取 Yjs 文档
   */
  getYDoc(): Y.Doc {
    return this.ydoc
  }

  /**
   * 获取 Provider
   */
  getProvider(): WebsocketProvider | null {
    return this.provider
  }

  /**
   * 获取在线用户列表
   */
  getOnlineUsers(): CollaborationUser[] {
    if (!this.provider?.awareness) {
      return []
    }

    const users: CollaborationUser[] = []
    const states = this.provider.awareness.getStates()

    states.forEach((state: any, clientId: number) => {
      if (state.user) {
        users.push({
          id: String(clientId),
          name: state.user.name || 'Anonymous',
          color: state.user.color || '#000000',
          cursor: state.cursor
        })
      }
    })

    return users
  }

  /**
   * 更新当前用户信息
   */
  updateUser(updates: Partial<{ name: string; color: string; cursor: any }>) {
    if (!this.provider?.awareness) return

    const current = this.provider.awareness.getLocalState() || {}
    this.provider.awareness.setLocalState({
      ...current,
      user: {
        ...(current.user || {}),
        ...updates
      }
    })
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): CollaborationUser {
    return {
      id: 'local',
      name: this.username,
      color: this.userColor
    }
  }

  /**
   * 生成用户颜色
   */
  private generateUserColor(): string {
    const colors = [
      '#FF6B6B', // 红色
      '#4ECDC4', // 青色
      '#45B7D1', // 蓝色
      '#FFA07A', // 橙色
      '#98D8C8', // 绿色
      '#F7DC6F', // 黄色
      '#BB8FCE', // 紫色
      '#85C1E2', // 浅蓝
      '#F8B88B', // 浅橙
      '#A8E6CF'  // 浅绿
    ]

    return colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.provider !== null && this.provider.wsconnected
  }

  /**
   * 检查是否已同步
   */
  isSynced(): boolean {
    return this.provider?.synced || false
  }
}

/**
 * 创建协同编辑管理器
 */
export function createCollaborationManager(options: CollaborationOptions): CollaborationManager {
  return new CollaborationManager(options)
}
