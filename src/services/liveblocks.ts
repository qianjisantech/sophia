/**
 * Liveblocks 协同编辑服务
 * 使用 Liveblocks 云服务，无需自建 WebSocket 服务器
 */

import { createClient } from '@liveblocks/client'
import { LiveblocksProvider } from '@liveblocks/yjs'
import * as Y from 'yjs'

// TODO: 替换为你的 Liveblocks Public API Key
// 获取方式：
// 1. 访问 https://liveblocks.io/
// 2. 注册并创建项目
// 3. 在项目设置中找到 Public API Key (pk_dev_xxxx 或 pk_prod_xxxx)
const LIVEBLOCKS_PUBLIC_KEY = 'pk_dev_YOUR_KEY_HERE' // 👈 替换这里

export interface LiveblocksUser {
  id: string
  name: string
  color: string
}

export interface LiveblocksOptions {
  roomId: string
  username?: string
  onConnected?: () => void
  onDisconnected?: () => void
  onUsersChanged?: (users: LiveblocksUser[]) => void
  onSynced?: (isSynced: boolean) => void
}

/**
 * Liveblocks 协同管理器
 */
export class LiveblocksManager {
  private client: any
  private room: any
  private provider: LiveblocksProvider | null = null
  private ydoc: Y.Doc
  private roomId: string
  private username: string
  private userColor: string
  private options: LiveblocksOptions

  constructor(options: LiveblocksOptions) {
    this.options = options
    this.roomId = options.roomId
    this.username = options.username || `User-${Math.floor(Math.random() * 1000)}`
    this.userColor = this.generateUserColor()
    this.ydoc = new Y.Doc()

    // 创建 Liveblocks 客户端
    this.client = createClient({
      publicApiKey: LIVEBLOCKS_PUBLIC_KEY,
    })
  }

  /**
   * 连接到 Liveblocks 房间
   */
  async connect(): Promise<LiveblocksProvider> {
    if (this.provider) {
      console.warn('Already connected')
      return this.provider
    }

    console.log(`🔗 Connecting to Liveblocks room: ${this.roomId}`)

    try {
      // 进入房间
      this.room = this.client.enter(this.roomId, {
        initialPresence: {
          user: {
            name: this.username,
            color: this.userColor,
          },
        },
      })

      // 创建 Yjs Provider
      this.provider = new LiveblocksProvider(this.room, this.ydoc)

      // 监听连接状态
      this.room.subscribe('status', (status: string) => {
        console.log('Liveblocks status:', status)

        if (status === 'connected') {
          console.log('✅ Connected to Liveblocks')
          this.options.onConnected?.()
        } else if (status === 'disconnected') {
          console.log('❌ Disconnected from Liveblocks')
          this.options.onDisconnected?.()
        }
      })

      // 监听同步状态
      this.provider.on('sync', (isSynced: boolean) => {
        console.log('Sync status:', isSynced ? '✅ Synced' : '⏳ Syncing...')
        this.options.onSynced?.(isSynced)
      })

      // 监听在线用户变化
      this.room.subscribe('others', () => {
        const users = this.getOnlineUsers()
        this.options.onUsersChanged?.(users)
      })

      return this.provider
    } catch (error) {
      console.error('Failed to connect to Liveblocks:', error)
      throw error
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.room) {
      this.client.leave(this.roomId)
      this.room = null
      console.log('🔌 Disconnected from Liveblocks')
    }
    if (this.provider) {
      this.provider.destroy()
      this.provider = null
    }
  }

  /**
   * 获取 Yjs 文档
   */
  getYDoc(): Y.Doc {
    return this.ydoc
  }

  /**
   * 获取在线用户列表
   */
  getOnlineUsers(): LiveblocksUser[] {
    if (!this.room) return []

    const users: LiveblocksUser[] = []

    // 添加当前用户
    users.push({
      id: 'me',
      name: this.username,
      color: this.userColor,
    })

    // 添加其他用户
    const others = this.room.getOthers()
    others.forEach((other: any) => {
      if (other.presence?.user) {
        users.push({
          id: other.connectionId,
          name: other.presence.user.name || 'Anonymous',
          color: other.presence.user.color || '#000000',
        })
      }
    })

    return users
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): LiveblocksUser {
    return {
      id: 'me',
      name: this.username,
      color: this.userColor,
    }
  }

  /**
   * 更新当前用户信息
   */
  updateUser(updates: Partial<{ name: string; color: string }>) {
    if (!this.room) return

    this.room.updatePresence({
      user: {
        name: updates.name || this.username,
        color: updates.color || this.userColor,
      },
    })
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
      '#A8E6CF', // 浅绿
    ]

    return colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.room !== null
  }
}

/**
 * 创建 Liveblocks 管理器
 */
export function createLiveblocksManager(options: LiveblocksOptions): LiveblocksManager {
  return new LiveblocksManager(options)
}
