/**
 * Sophia-Vue WebSocket 协同编辑服务器
 * 基于 Yjs + WebSocket 实现多人实时协同编辑
 */

import { WebSocketServer } from 'ws'
import * as Y from 'yjs'
import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as map from 'lib0/map'
import http from 'http'

const PORT = process.env.WS_PORT || 1234

// 文档存储（内存中）
const docs = new Map()

// 消息类型
const messageSync = 0
const messageAwareness = 1

/**
 * 获取或创建文档
 */
function getYDoc(docName) {
  return map.setIfUndefined(docs, docName, () => {
    const doc = new Y.Doc()
    doc.conns = new Map()
    console.log(`📄 创建新文档: ${docName}`)
    return doc
  })
}

/**
 * 处理 WebSocket 消息
 */
function messageListener(conn, doc, message) {
  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)

    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn)

        // 如果 encoder 有内容，发送回客户端
        if (encoding.length(encoder) > 1) {
          conn.send(encoding.toUint8Array(encoder))
        }
        break

      case messageAwareness:
        awarenessProtocol.applyAwarenessUpdate(
          doc.awareness,
          decoding.readVarUint8Array(decoder),
          conn
        )
        break
    }
  } catch (err) {
    console.error('处理消息时出错:', err)
  }
}

/**
 * 关闭连接
 */
function closeConn(doc, conn) {
  if (doc.conns.has(conn)) {
    doc.conns.delete(conn)
    console.log(`❌ 连接关闭 (剩余: ${doc.conns.size})`)
  }

  // 更新 awareness 状态
  awarenessProtocol.removeAwarenessStates(
    doc.awareness,
    [doc.conns.get(conn)],
    null
  )
}

/**
 * 设置 WebSocket 连接
 */
function setupWSConnection(conn, req, docName) {
  conn.binaryType = 'arraybuffer'

  // 获取文档
  const doc = getYDoc(docName)
  doc.conns.set(conn, new Set())

  // 初始化 awareness（如果还没有）
  if (!doc.awareness) {
    doc.awareness = new awarenessProtocol.Awareness(doc)
  }

  // 处理 awareness 更新
  const awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
    const changedClients = added.concat(updated).concat(removed)
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageAwareness)
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(doc.awareness, changedClients)
    )
    const buff = encoding.toUint8Array(encoder)

    // 广播给所有连接
    doc.conns.forEach((_, c) => {
      if (c !== origin && c.readyState === 1) {
        c.send(buff)
      }
    })
  }
  doc.awareness.on('update', awarenessUpdateHandler)

  // 处理文档更新
  const updateHandler = (update, origin) => {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeUpdate(encoder, update)
    const message = encoding.toUint8Array(encoder)

    // 广播给所有连接（除了发起者）
    doc.conns.forEach((_, c) => {
      if (c !== origin && c.readyState === 1) {
        c.send(message)
      }
    })
  }
  doc.on('update', updateHandler)

  // 监听消息
  conn.on('message', (message) => messageListener(conn, doc, new Uint8Array(message)))

  // 监听关闭
  conn.on('close', () => {
    closeConn(doc, conn)
    doc.off('update', updateHandler)
    doc.awareness.off('update', awarenessUpdateHandler)
  })

  // 发送初始同步消息
  {
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeSyncStep1(encoder, doc)
    conn.send(encoding.toUint8Array(encoder))

    // 发送 awareness 状态
    const awarenessStates = doc.awareness.getStates()
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(
          doc.awareness,
          Array.from(awarenessStates.keys())
        )
      )
      conn.send(encoding.toUint8Array(encoder))
    }
  }
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Sophia-Vue WebSocket Server is running')
})

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ server })

console.log('🚀 Sophia-Vue 协同编辑服务器启动中...')

wss.on('connection', (conn, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const docName = url.pathname.slice(1) // 移除开头的 '/'

  console.log(`🔗 新连接: 文档 "${docName}"`)
  console.log(`👥 当前活跃文档数: ${docs.size}`)

  // 设置 WebSocket 连接
  setupWSConnection(conn, req, docName)
})

// 定期清理无连接的文档（避免内存泄漏）
setInterval(() => {
  docs.forEach((doc, docName) => {
    if (doc.conns.size === 0) {
      docs.delete(docName)
      console.log(`🗑️  清理空文档: ${docName}`)
    }
  })
}, 60000) // 每分钟检查一次

// 启动服务器
server.listen(PORT, () => {
  console.log('✅ WebSocket 服务器成功启动!')
  console.log(`📡 监听端口: ${PORT}`)
  console.log(`🔗 连接地址: ws://localhost:${PORT}/[documentId]`)
  console.log('─'.repeat(50))
})

// 错误处理
server.on('error', (error) => {
  console.error('❌ 服务器错误:', error)
})

process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...')
  wss.close(() => {
    server.close(() => {
      console.log('✅ 服务器已关闭')
      process.exit(0)
    })
  })
})
