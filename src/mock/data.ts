import type { Document } from '../stores/document'
import type { Wiki } from '../types/wiki'

// Mock 文档数据
export const mockDocuments: Document[] = [
  // 我的文档 - 文件夹
  {
    id: 'folder-1',
    title: '默认文件夹',
    type: 'folder',
    content: '',
    createdAt: '2025-11-20 10:00:00',
    updatedAt: '2025-11-20 10:00:00',
    creator: 'demo',
    updater: 'demo',
    isShared: false
  },
  {
    id: 'folder-2',
    title: '工作笔记',
    type: 'folder',
    content: '',
    createdAt: '2025-11-21 09:00:00',
    updatedAt: '2025-11-21 09:00:00',
    creator: 'demo',
    updater: 'demo',
    isShared: false
  },
  {
    id: 'folder-3',
    title: '项目文档',
    type: 'folder',
    content: '',
    createdAt: '2025-11-22 08:00:00',
    updatedAt: '2025-11-22 08:00:00',
    creator: 'demo',
    updater: 'demo',
    isShared: false
  },

  // 共享文档 - 文件夹
  {
    id: 'folder-shared-1',
    title: '技术文档',
    type: 'folder',
    content: '',
    createdAt: '2025-11-15 10:00:00',
    updatedAt: '2025-11-15 10:00:00',
    creator: '张三',
    updater: '张三',
    isShared: true
  },
  {
    id: 'folder-shared-2',
    title: '客户管理',
    type: 'folder',
    content: '',
    createdAt: '2025-11-16 11:00:00',
    updatedAt: '2025-11-16 11:00:00',
    creator: '李四',
    updater: '李四',
    isShared: true
  },
  {
    id: 'folder-shared-3',
    title: '产品规划',
    type: 'folder',
    content: '',
    createdAt: '2025-11-17 12:00:00',
    updatedAt: '2025-11-17 12:00:00',
    creator: '王五',
    updater: '王五',
    isShared: true
  },
  {
    id: 'folder-shared-4',
    title: '团队协作',
    type: 'folder',
    content: '',
    createdAt: '2025-11-18 13:00:00',
    updatedAt: '2025-11-18 13:00:00',
    creator: '赵六',
    updater: '赵六',
    isShared: true
  },

  // 文档数据

  // ========== 最近访问（我的文档）==========
  {
    id: 'recent-1',
    title: '2025年度工作总结',
    type: 'document',
    content: '<h1>2025年度工作总结</h1><p>本年度主要完成了以下工作...</p><ul><li>完成Sophia平台开发</li><li>优化性能提升30%</li><li>用户量增长200%</li></ul>',
    createdAt: Date.now() - 3600000, // 1小时前
    updatedAt: Date.now() - 1800000, // 30分钟前
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'recent-2',
    title: 'Vue3项目最佳实践',
    type: 'document',
    content: '<h1>Vue3项目最佳实践</h1><h2>组件设计原则</h2><p>1. 单一职责原则</p><p>2. 组合优于继承</p><h2>状态管理</h2><p>推荐使用Pinia进行状态管理...</p>',
    createdAt: Date.now() - 7200000, // 2小时前
    updatedAt: Date.now() - 3600000, // 1小时前
    folder: '项目文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'recent-3',
    title: '产品需求分析文档',
    type: 'document',
    content: '<h1>产品需求分析</h1><h2>用户痛点</h2><p>当前用户在使用过程中遇到的主要问题...</p><h2>解决方案</h2><p>提供更便捷的操作方式...</p>',
    createdAt: Date.now() - 86400000, // 1天前
    updatedAt: Date.now() - 7200000, // 2小时前
    folder: '项目文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'recent-4',
    title: '数据库优化方案',
    type: 'document',
    content: '<h1>数据库优化方案</h1><h2>当前问题</h2><p>查询速度慢，索引使用不合理</p><h2>优化建议</h2><ul><li>添加复合索引</li><li>分表分库</li><li>使用缓存</li></ul>',
    createdAt: Date.now() - 172800000, // 2天前
    updatedAt: Date.now() - 86400000, // 1天前
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'recent-5',
    title: 'TypeScript高级技巧',
    type: 'document',
    content: '<h1>TypeScript高级技巧</h1><h2>泛型的使用</h2><pre><code>function identity<T>(arg: T): T { return arg; }</code></pre><h2>类型推导</h2><p>TypeScript的类型推导非常强大...</p>',
    createdAt: Date.now() - 259200000, // 3天前
    updatedAt: Date.now() - 172800000, // 2天前
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },

  // ========== 与我共享 ==========
  {
    id: 'shared-1',
    title: '团队协作规范【共享】',
    type: 'document',
    content: '<h1>团队协作规范</h1><h2>代码规范</h2><p>1. 统一使用ESLint</p><p>2. 遵循Airbnb规范</p><h2>提交规范</h2><p>使用Conventional Commits...</p>',
    createdAt: Date.now() - 86400000 * 2, // 2天前
    updatedAt: Date.now() - 86400000, // 1天前
    folder: '团队协作',
    creator: '张三',
    updater: '张三',
    isShared: true,
    isFavorite: false
  },
  {
    id: 'shared-2',
    title: 'Q1季度目标与规划【共享】',
    type: 'document',
    content: '<h1>Q1季度目标</h1><h2>整体目标</h2><p>用户增长50%，营收提升40%</p><h2>关键任务</h2><ul><li>产品迭代</li><li>市场推广</li><li>团队建设</li></ul>',
    createdAt: Date.now() - 86400000 * 3, // 3天前
    updatedAt: Date.now() - 86400000 * 2, // 2天前
    folder: '产品规划',
    creator: '李四',
    updater: '李四',
    isShared: true,
    isFavorite: false
  },
  {
    id: 'shared-3',
    title: 'API接口文档【共享】',
    type: 'document',
    content: '<h1>API接口文档</h1><h2>用户模块</h2><p><strong>登录接口</strong></p><p>POST /api/login</p><pre><code>{ "username": "demo", "password": "123456" }</code></pre>',
    createdAt: Date.now() - 86400000 * 4, // 4天前
    updatedAt: Date.now() - 86400000 * 3, // 3天前
    folder: '技术文档',
    creator: '王五',
    updater: '王五',
    isShared: true,
    isFavorite: false
  },
  {
    id: 'shared-4',
    title: '设计规范V2.0【共享】',
    type: 'document',
    content: '<h1>设计规范V2.0</h1><h2>色彩系统</h2><p>主色：#0052D9</p><p>辅助色：#00A870</p><h2>字体系统</h2><p>标题：PingFang SC</p><p>正文：14px/1.5</p>',
    createdAt: Date.now() - 86400000 * 5, // 5天前
    updatedAt: Date.now() - 86400000 * 4, // 4天前
    folder: '产品规划',
    creator: '赵六',
    updater: '赵六',
    isShared: true,
    isFavorite: false
  },
  {
    id: 'shared-5',
    title: '会议纪要-产品评审【共享】',
    type: 'document',
    content: '<h1>产品评审会议纪要</h1><p><strong>时间：</strong>2025-11-28 14:00</p><p><strong>参会人：</strong>产品、开发、设计</p><h2>讨论内容</h2><ul><li>新版本功能优先级</li><li>技术方案评审</li></ul>',
    createdAt: Date.now() - 86400000 * 6, // 6天前
    updatedAt: Date.now() - 86400000 * 5, // 5天前
    folder: '团队协作',
    creator: '钱七',
    updater: '钱七',
    isShared: true,
    isFavorite: false
  },

  // ========== 收藏文档 ==========
  {
    id: 'favorite-1',
    title: 'React vs Vue对比分析 ⭐',
    type: 'document',
    content: '<h1>React vs Vue对比分析</h1><h2>语法差异</h2><p>React使用JSX，Vue使用模板语法</p><h2>性能对比</h2><p>两者在性能上各有优势...</p>',
    createdAt: Date.now() - 86400000 * 7, // 7天前
    updatedAt: Date.now() - 86400000 * 6, // 6天前
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'favorite-2',
    title: '前端性能优化完整指南 ⭐',
    type: 'document',
    content: '<h1>前端性能优化完整指南</h1><h2>资源优化</h2><ul><li>图片压缩</li><li>代码分割</li><li>懒加载</li></ul><h2>渲染优化</h2><p>减少重排重绘...</p>',
    createdAt: Date.now() - 86400000 * 8, // 8天前
    updatedAt: Date.now() - 86400000 * 7, // 7天前
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'favorite-3',
    title: 'Git工作流最佳实践 ⭐',
    type: 'document',
    content: '<h1>Git工作流最佳实践</h1><h2>分支管理</h2><p>master: 生产分支</p><p>develop: 开发分支</p><p>feature: 功能分支</p><h2>提交规范</h2><p>feat、fix、docs、style...</p>',
    createdAt: Date.now() - 86400000 * 9, // 9天前
    updatedAt: Date.now() - 86400000 * 8, // 8天前
    folder: '项目文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'favorite-4',
    title: '微服务架构设计模式 ⭐',
    type: 'document',
    content: '<h1>微服务架构设计模式</h1><h2>服务拆分原则</h2><p>按业务能力拆分</p><p>按子域拆分</p><h2>服务通信</h2><p>REST、gRPC、消息队列</p>',
    createdAt: Date.now() - 86400000 * 10, // 10天前
    updatedAt: Date.now() - 86400000 * 9, // 9天前
    folder: '项目文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'favorite-5',
    title: 'SQL优化技巧大全 ⭐',
    type: 'document',
    content: '<h1>SQL优化技巧大全</h1><h2>索引优化</h2><ul><li>选择合适的索引类型</li><li>避免索引失效</li></ul><h2>查询优化</h2><p>避免SELECT *</p><p>使用EXISTS代替IN</p>',
    createdAt: Date.now() - 86400000 * 11, // 11天前
    updatedAt: Date.now() - 86400000 * 10, // 10天前
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },

  {
    id: '1',
    title: '欢迎使用 Sophia',
    type: 'document',
    folderId: 'folder-1',
    content: '<h1>欢迎使用 Sophia</h1><p>这是一个基于 Vue3 + TypeScript + TDesign 的在线文档编辑器。</p><h2>主要功能</h2><ul><li>富文本编辑</li><li>在线表格</li><li>实时保存</li><li>多人协作</li></ul>',
    createdAt: '2025-11-25 11:10:54',
    updatedAt:'2025-11-25 11:10:54',
    folder: '默认文件夹',
    creator: '张三',
    updater: '李四'
  },
  {
    id: '2',
    title: '2024年度产品需求规划表',
    type: 'spreadsheet',
    folderId: 'folder-shared-3',
    content: JSON.stringify([{
      name: '产品需求',
      freeze: 'A1',
      styles: [
        { bgcolor: '#0052D9', color: '#ffffff', bold: true }
      ],
      merges: [],
      rows: {
        0: {
          cells: {
            0: { text: '需求ID', style: 0 },
            1: { text: '功能模块', style: 0 },
            2: { text: '优先级', style: 0 },
            3: { text: '负责人', style: 0 },
            4: { text: '开发周期', style: 0 },
            5: { text: '状态', style: 0 },
            6: { text: '开始时间', style: 0 },
            7: { text: '完成时间', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: 'REQ-2024-001' },
            1: { text: '用户权限管理系统' },
            2: { text: 'P0' },
            3: { text: '张三' },
            4: { text: '4周' },
            5: { text: '进行中' },
            6: { text: '2024-01-15' },
            7: { text: '2024-02-12' }
          }
        },
        2: {
          cells: {
            0: { text: 'REQ-2024-002' },
            1: { text: '数据导出功能' },
            2: { text: 'P1' },
            3: { text: '李四' },
            4: { text: '2周' },
            5: { text: '已完成' },
            6: { text: '2024-01-08' },
            7: { text: '2024-01-22' }
          }
        },
        3: {
          cells: {
            0: { text: 'REQ-2024-003' },
            1: { text: '移动端适配' },
            2: { text: 'P0' },
            3: { text: '王五' },
            4: { text: '6周' },
            5: { text: '待开始' },
            6: { text: '2024-02-01' },
            7: { text: '2024-03-15' }
          }
        },
        4: {
          cells: {
            0: { text: 'REQ-2024-004' },
            1: { text: '多语言支持' },
            2: { text: 'P2' },
            3: { text: '赵六' },
            4: { text: '3周' },
            5: { text: '待开始' },
            6: { text: '2024-02-15' },
            7: { text: '2024-03-08' }
          }
        },
        5: {
          cells: {
            0: { text: 'REQ-2024-005' },
            1: { text: '智能推荐引擎' },
            2: { text: 'P1' },
            3: { text: '张三' },
            4: { text: '8周' },
            5: { text: '规划中' },
            6: { text: '2024-03-01' },
            7: { text: '2024-04-26' }
          }
        },
        6: {
          cells: {
            0: { text: 'REQ-2024-006' },
            1: { text: '实时协作编辑' },
            2: { text: 'P0' },
            3: { text: '李四' },
            4: { text: '10周' },
            5: { text: '规划中' },
            6: { text: '2024-03-15' },
            7: { text: '2024-05-24' }
          }
        },
        7: {
          cells: {
            0: { text: 'REQ-2024-007' },
            1: { text: '高级搜索功能' },
            2: { text: 'P2' },
            3: { text: '王五' },
            4: { text: '4周' },
            5: { text: '规划中' },
            6: { text: '2024-04-01' },
            7: { text: '2024-04-29' }
          }
        }
      },
      cols: {
        len: 8
      }
    }]),
      createdAt: '2025-11-25 11:10:54',
      updatedAt:'2025-11-25 11:10:54',
    folder: '产品规划',
    creator: '王五',
    updater: '张三'
  },
  {
    id: '3',
    title: '技术架构设计文档',
    type: 'document',
    content: '<p style="font-size: 13px;"><strong>文档版本：</strong>v2.0 &nbsp;&nbsp;|&nbsp;&nbsp; <strong>负责人：</strong>李四 &nbsp;&nbsp;|&nbsp;&nbsp; <strong>更新时间：</strong>2025-11-25</p><hr/><h2>📐 系统架构概览</h2><p>本系统采用<mark style="background-color: #e3f2fd;">前后端分离</mark>的微服务架构，基于<mark style="background-color: #fff9c4;">云原生</mark>理念设计，支持水平扩展和高可用部署。</p><blockquote style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 10px 14px; margin: 12px 0; font-size: 13px;"><p><strong>架构设计原则：</strong></p><ul style="margin: 4px 0;"><li>高内聚、低耦合</li><li>可扩展、易维护</li><li>安全第一、性能优先</li><li>微服务化、模块化</li></ul></blockquote><h2>🎨 前端架构设计</h2><h3>核心技术栈</h3><table style="font-size: 13px; border-collapse: collapse; width: 100%;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5;">技术分类</th><th style="padding: 6px 10px; background-color: #f5f5f5;">选型方案</th><th style="padding: 6px 10px; background-color: #f5f5f5;">版本</th><th style="padding: 6px 10px; background-color: #f5f5f5;">选型理由</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; padding: 2px 6px;">框架</mark></td><td style="padding: 6px 10px;">Vue 3</td><td style="padding: 6px 10px; text-align: center;">3.4.x</td><td style="padding: 6px 10px;">Composition API、性能优异、生态完善</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; padding: 2px 6px;">语言</mark></td><td style="padding: 6px 10px;">TypeScript</td><td style="padding: 6px 10px; text-align: center;">5.3.x</td><td style="padding: 6px 10px;">类型安全、IDE支持好、提升代码质量</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; padding: 2px 6px;">状态管理</mark></td><td style="padding: 6px 10px;">Pinia</td><td style="padding: 6px 10px; text-align: center;">2.1.x</td><td style="padding: 6px 10px;">轻量级、类型安全、Vue3官方推荐</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; padding: 2px 6px;">路由</mark></td><td style="padding: 6px 10px;">Vue Router</td><td style="padding: 6px 10px; text-align: center;">4.2.x</td><td style="padding: 6px 10px;">官方路由、功能完善</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e8f5e9; padding: 2px 6px;">UI组件库</mark></td><td style="padding: 6px 10px;">TDesign Vue Next</td><td style="padding: 6px 10px; text-align: center;">1.8.x</td><td style="padding: 6px 10px;">企业级、组件丰富、设计规范</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e8f5e9; padding: 2px 6px;">构建工具</mark></td><td style="padding: 6px 10px;">Vite</td><td style="padding: 6px 10px; text-align: center;">5.0.x</td><td style="padding: 6px 10px;">开发速度快、HMR即时响应</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fce4ec; padding: 2px 6px;">HTTP客户端</mark></td><td style="padding: 6px 10px;">Axios</td><td style="padding: 6px 10px; text-align: center;">1.6.x</td><td style="padding: 6px 10px;">功能强大、拦截器支持、易于封装</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fce4ec; padding: 2px 6px;">CSS方案</mark></td><td style="padding: 6px 10px;">Less / CSS Modules</td><td style="padding: 6px 10px; text-align: center;">-</td><td style="padding: 6px 10px;">预处理器、样式隔离</td></tr></tbody></table><h3>前端工程化</h3><ul><li><strong>代码规范：</strong>ESLint + Prettier + Stylelint</li><li><strong>Git Hooks：</strong>Husky + lint-staged 提交前检查</li><li><strong>版本管理：</strong>语义化版本 + Conventional Commits</li><li><strong>CI/CD：</strong>GitHub Actions 自动化构建部署</li><li><strong>监控：</strong>Sentry 错误监控 + Google Analytics</li></ul><h3>前端模块划分</h3><pre style="background: #f5f5f5; padding: 12px; font-size: 12px; margin: 12px 0;"><code>src/\n├── api/              # API接口封装\n├── assets/           # 静态资源\n├── components/       # 公共组件\n│   ├── common/      # 通用基础组件\n│   └── business/    # 业务组件\n├── composables/      # 组合式函数\n├── layouts/          # 布局组件\n├── router/           # 路由配置\n├── stores/           # Pinia状态管理\n├── styles/           # 全局样式\n├── types/            # TypeScript类型定义\n├── utils/            # 工具函数\n└── views/            # 页面组件</code></pre><h2>⚙️ 后端架构设计</h2><h3>核心技术栈</h3><table style="font-size: 13px; border-collapse: collapse; width: 100%;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5;">技术分类</th><th style="padding: 6px 10px; background-color: #f5f5f5;">选型方案</th><th style="padding: 6px 10px; background-color: #f5f5f5;">版本</th><th style="padding: 6px 10px; background-color: #f5f5f5;">选型理由</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; padding: 2px 6px;">运行时</mark></td><td style="padding: 6px 10px;">Node.js</td><td style="padding: 6px 10px; text-align: center;">20.x LTS</td><td style="padding: 6px 10px;">高性能、生态丰富、前后端统一语言</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; padding: 2px 6px;">Web框架</mark></td><td style="padding: 6px 10px;">Express / Koa</td><td style="padding: 6px 10px; text-align: center;">4.x / 2.x</td><td style="padding: 6px 10px;">轻量级、中间件机制灵活</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; padding: 2px 6px;">数据库</mark></td><td style="padding: 6px 10px;">MongoDB</td><td style="padding: 6px 10px; text-align: center;">7.0.x</td><td style="padding: 6px 10px;">文档型数据库、灵活的Schema设计</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; padding: 2px 6px;">ORM</mark></td><td style="padding: 6px 10px;">Mongoose</td><td style="padding: 6px 10px; text-align: center;">8.x</td><td style="padding: 6px 10px;">MongoDB对象建模、Schema验证</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e8f5e9; padding: 2px 6px;">缓存</mark></td><td style="padding: 6px 10px;">Redis</td><td style="padding: 6px 10px; text-align: center;">7.2.x</td><td style="padding: 6px 10px;">高性能、支持多种数据结构</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e8f5e9; padding: 2px 6px;">消息队列</mark></td><td style="padding: 6px 10px;">RabbitMQ / Kafka</td><td style="padding: 6px 10px; text-align: center;">-</td><td style="padding: 6px 10px;">异步处理、削峰填谷</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fce4ec; padding: 2px 6px;">认证授权</mark></td><td style="padding: 6px 10px;">JWT + OAuth2.0</td><td style="padding: 6px 10px; text-align: center;">-</td><td style="padding: 6px 10px;">无状态认证、支持第三方登录</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fce4ec; padding: 2px 6px;">API文档</mark></td><td style="padding: 6px 10px;">Swagger / Apifox</td><td style="padding: 6px 10px; text-align: center;">-</td><td style="padding: 6px 10px;">自动生成API文档、在线调试</td></tr></tbody></table><h3>微服务划分</h3><table style="font-size: 13px; border-collapse: collapse; width: 100%;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5; width: 20%;">服务名称</th><th style="padding: 6px 10px; background-color: #f5f5f5; width: 35%;">职责说明</th><th style="padding: 6px 10px; background-color: #f5f5f5; width: 25%;">依赖服务</th><th style="padding: 6px 10px; background-color: #f5f5f5; width: 20%;">端口</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><strong>Gateway Service</strong></td><td style="padding: 6px 10px;">API网关、路由转发、鉴权、限流</td><td style="padding: 6px 10px;">Redis、Auth Service</td><td style="padding: 6px 10px; text-align: center;">8080</td></tr><tr><td style="padding: 6px 10px;"><strong>Auth Service</strong></td><td style="padding: 6px 10px;">用户认证、权限管理、Token颁发</td><td style="padding: 6px 10px;">MongoDB、Redis</td><td style="padding: 6px 10px; text-align: center;">8081</td></tr><tr><td style="padding: 6px 10px;"><strong>Document Service</strong></td><td style="padding: 6px 10px;">文档CRUD、版本管理、协同编辑</td><td style="padding: 6px 10px;">MongoDB、Redis、OSS</td><td style="padding: 6px 10px; text-align: center;">8082</td></tr><tr><td style="padding: 6px 10px;"><strong>File Service</strong></td><td style="padding: 6px 10px;">文件上传、存储、CDN加速</td><td style="padding: 6px 10px;">OSS、CDN</td><td style="padding: 6px 10px; text-align: center;">8083</td></tr><tr><td style="padding: 6px 10px;"><strong>Notification Service</strong></td><td style="padding: 6px 10px;">消息通知、邮件、站内信</td><td style="padding: 6px 10px;">RabbitMQ、邮件服务</td><td style="padding: 6px 10px; text-align: center;">8084</td></tr><tr><td style="padding: 6px 10px;"><strong>Search Service</strong></td><td style="padding: 6px 10px;">全文搜索、索引管理</td><td style="padding: 6px 10px;">Elasticsearch</td><td style="padding: 6px 10px; text-align: center;">8085</td></tr></tbody></table><h2>🗄️ 数据库设计</h2><h3>核心数据表</h3><table style="font-size: 13px; border-collapse: collapse; width: 100%;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5;">Collection</th><th style="padding: 6px 10px; background-color: #f5f5f5;">说明</th><th style="padding: 6px 10px; background-color: #f5f5f5;">关键字段</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><code style="background: #f5f5f5; padding: 2px 4px;">users</code></td><td style="padding: 6px 10px;">用户表</td><td style="padding: 6px 10px; font-size: 12px;">id, username, email, password, avatar, role, status</td></tr><tr><td style="padding: 6px 10px;"><code style="background: #f5f5f5; padding: 2px 4px;">documents</code></td><td style="padding: 6px 10px;">文档表</td><td style="padding: 6px 10px; font-size: 12px;">id, title, content, type, folderId, creator, updater, version</td></tr><tr><td style="padding: 6px 10px;"><code style="background: #f5f5f5; padding: 2px 4px;">folders</code></td><td style="padding: 6px 10px;">文件夹表</td><td style="padding: 6px 10px; font-size: 12px;">id, name, parentId, creator, isShared, permissions</td></tr><tr><td style="padding: 6px 10px;"><code style="background: #f5f5f5; padding: 2px 4px;">versions</code></td><td style="padding: 6px 10px;">版本历史</td><td style="padding: 6px 10px; font-size: 12px;">id, documentId, version, content, creator, createdAt</td></tr><tr><td style="padding: 6px 10px;"><code style="background: #f5f5f5; padding: 2px 4px;">comments</code></td><td style="padding: 6px 10px;">评论表</td><td style="padding: 6px 10px; font-size: 12px;">id, documentId, userId, content, parentId, createdAt</td></tr><tr><td style="padding: 6px 10px;"><code style="background: #f5f5f5; padding: 2px 4px;">shares</code></td><td style="padding: 6px 10px;">分享记录</td><td style="padding: 6px 10px; font-size: 12px;">id, documentId, shareLink, expireAt, permissions</td></tr></tbody></table><h3>Redis缓存策略</h3><ul><li><strong>用户Session：</strong><code style="background: #f5f5f5; padding: 2px 4px;">user:session:{userId}</code> - 30分钟过期</li><li><strong>文档缓存：</strong><code style="background: #f5f5f5; padding: 2px 4px;">doc:{docId}</code> - 10分钟过期</li><li><strong>热点数据：</strong><code style="background: #f5f5f5; padding: 2px 4px;">hot:docs</code> - 有序集合，按访问量排序</li><li><strong>限流计数：</strong><code style="background: #f5f5f5; padding: 2px 4px;">rate:limit:{userId}</code> - 滑动窗口</li></ul><h2>☁️ 部署架构</h2><blockquote style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 10px 14px; margin: 12px 0; font-size: 13px;"><p><strong>部署环境：</strong></p><ul style="margin: 4px 0;"><li><mark style="background-color: #fff9c4;">开发环境（Dev）：</mark>本地开发、快速迭代</li><li><mark style="background-color: #c5e1a5;">测试环境（Test）：</mark>功能测试、集成测试</li><li><mark style="background-color: #ffcc80;">预发布环境（Staging）：</mark>性能测试、上线前验证</li><li><mark style="background-color: #ef9a9a;">生产环境（Prod）：</mark>正式服务、高可用</li></ul></blockquote><h3>容器化部署</h3><pre style="background: #f5f5f5; padding: 12px; font-size: 12px; margin: 12px 0;"><code># Docker Compose 示例\nservices:\n  nginx:\n    image: nginx:alpine\n    ports: ["80:80", "443:443"]\n  \n  frontend:\n    build: ./frontend\n    environment:\n      - NODE_ENV=production\n  \n  backend:\n    build: ./backend\n    depends_on: [mongodb, redis]\n  \n  mongodb:\n    image: mongo:7.0\n    volumes: [./data/mongo:/data/db]\n  \n  redis:\n    image: redis:7.2-alpine\n    command: redis-server --appendonly yes</code></pre><h2>🚀 性能优化方案</h2><table style="font-size: 13px; border-collapse: collapse; width: 100%;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5; width: 20%;">优化维度</th><th style="padding: 6px 10px; background-color: #f5f5f5; width: 40%;">优化措施</th><th style="padding: 6px 10px; background-color: #f5f5f5; width: 40%;">预期效果</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; padding: 2px 6px;">前端性能</mark></td><td style="padding: 6px 10px;">代码分割、懒加载、Tree Shaking</td><td style="padding: 6px 10px;">首屏加载时间 &lt; 1.5s</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; padding: 2px 6px;">资源优化</mark></td><td style="padding: 6px 10px;">CDN加速、Gzip压缩、图片懒加载</td><td style="padding: 6px 10px;">资源加载提速50%</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; padding: 2px 6px;">接口性能</mark></td><td style="padding: 6px 10px;">Redis缓存、接口聚合、异步处理</td><td style="padding: 6px 10px;">API响应时间 &lt; 200ms</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; padding: 2px 6px;">数据库优化</mark></td><td style="padding: 6px 10px;">索引优化、查询优化、读写分离</td><td style="padding: 6px 10px;">查询性能提升3倍</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e8f5e9; padding: 2px 6px;">渲染优化</mark></td><td style="padding: 6px 10px;">虚拟滚动、防抖节流、Web Worker</td><td style="padding: 6px 10px;">大数据渲染流畅</td></tr></tbody></table><h2>🔒 安全设计</h2><ul><li><strong>认证安全：</strong>JWT + RefreshToken双Token机制、密码加密（bcrypt）</li><li><strong>传输安全：</strong>HTTPS全站加密、HSTS策略</li><li><strong>XSS防护：</strong>输入过滤、输出转义、CSP策略</li><li><strong>CSRF防护：</strong>Token验证、SameSite Cookie</li><li><strong>SQL注入防护：</strong>参数化查询、ORM框架</li><li><strong>权限控制：</strong>RBAC角色权限模型、接口级权限校验</li><li><strong>敏感信息：</strong>数据脱敏、日志脱敏、环境变量隔离</li></ul><h2>📊 监控与运维</h2><table style="font-size: 13px; border-collapse: collapse; width: 100%;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5;">监控类型</th><th style="padding: 6px 10px; background-color: #f5f5f5;">工具方案</th><th style="padding: 6px 10px; background-color: #f5f5f5;">监控指标</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><strong>应用监控</strong></td><td style="padding: 6px 10px;">Sentry、ELK</td><td style="padding: 6px 10px;">错误率、响应时间、吞吐量</td></tr><tr><td style="padding: 6px 10px;"><strong>服务器监控</strong></td><td style="padding: 6px 10px;">Prometheus + Grafana</td><td style="padding: 6px 10px;">CPU、内存、磁盘、网络</td></tr><tr><td style="padding: 6px 10px;"><strong>日志监控</strong></td><td style="padding: 6px 10px;">ELK Stack</td><td style="padding: 6px 10px;">访问日志、错误日志、业务日志</td></tr><tr><td style="padding: 6px 10px;"><strong>用户行为</strong></td><td style="padding: 6px 10px;">Google Analytics</td><td style="padding: 6px 10px;">PV/UV、转化率、用户路径</td></tr></tbody></table><hr/><p style="text-align: center; color: #999; font-size: 12px;">技术架构文档 v2.0 · 最后更新：2025-11-25 · 负责人：李四</p>',
      createdAt: '2025-11-25 11:10:54',
      updatedAt:'2025-11-25 11:10:54',
    folder: '技术文档',
    creator: '李四',
    updater: '李四'
  },
  {
    id: '4',
    title: '2024年Q1销售数据',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '销售数据',
      freeze: 'A1',
      styles: [
        { bgcolor: '#52c41a', color: '#ffffff', bold: true }
      ],
      rows: {
        0: {
          cells: {
            0: { text: '月份', style: 0 },
            1: { text: '销售额(万元)', style: 0 },
            2: { text: '增长率', style: 0 },
            3: { text: '客户数', style: 0 },
            4: { text: '备注', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '2024-01' },
            1: { text: '523.5' },
            2: { text: '15.2%' },
            3: { text: '1,245' },
            4: { text: '春节促销' }
          }
        },
        2: {
          cells: {
            0: { text: '2024-02' },
            1: { text: '487.3' },
            2: { text: '8.7%' },
            3: { text: '1,156' },
            4: { text: '正常' }
          }
        },
        3: {
          cells: {
            0: { text: '2024-03' },
            1: { text: '612.8' },
            2: { text: '22.5%' },
            3: { text: '1,398' },
            4: { text: '新品上市' }
          }
        }
      },
      cols: {
        len: 5
      }
    }]),
      createdAt: '2025-11-25 11:10:54',
      updatedAt:'2025-11-25 11:10:54',
    folder: '数据报表',
    creator: '赵六',
    updater: '王五'
  },
  {
    id: '5',
    title: '会议纪要 - 产品评审会',
    type: 'document',
    content: '<h1>产品评审会议纪要</h1><p><strong>时间：</strong>2024年11月20日 14:00-16:00</p><p><strong>地点：</strong>会议室A</p><p><strong>参会人员：</strong>产品团队、研发团队、设计团队</p><h2>会议议题</h2><ol><li>新功能需求评审</li><li>UI/UX 设计讨论</li><li>技术方案评估</li></ol><h2>决议事项</h2><blockquote><p>通过用户权限管理系统的设计方案，计划下周开始开发。</p></blockquote>',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 14400000,
    folder: '会议纪要',
    creator: '张三',
    updater: '张三'
  },
  {
    id: '6',
    title: '项目架构思维导图',
    type: 'mindmap',
    content: '',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 10800000,
    folder: '技术文档',
    creator: '李四',
    updater: '王五'
  },
  {
    id: '7',
    title: '用户研究报告 - 2024Q4',
    type: 'document',
    content: '<h1>用户研究报告</h1><h2>研究背景</h2><p>本次研究针对产品核心功能进行用户体验调研。</p><h2>研究结论</h2><ul><li>用户满意度：85%</li><li>核心功能使用率：72%</li><li>改进建议：优化移动端体验</li></ul>',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 7200000,
    folder: '产品规划',
    creator: '赵六',
    updater: '赵六'
  },
  {
    id: '8',
    title: '开发规范文档',
    type: 'document',
    content: '<h1>开发规范</h1><h2>代码规范</h2><ul><li>使用 ESLint + Prettier</li><li>遵循 Airbnb 规范</li><li>组件命名使用 PascalCase</li></ul><h2>Git 规范</h2><ul><li>提交信息格式：type(scope): message</li><li>分支命名：feature/xxx, bugfix/xxx</li></ul>',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 18000000,
    folder: '技术文档',
    creator: '李四',
    updater: '张三'
  },
  {
    id: '9',
    title: '2024年营销计划',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '营销计划',
      freeze: 'A1',
      styles: [{ bgcolor: '#ff9800', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '活动名称', style: 0 },
            1: { text: '预算(万元)', style: 0 },
            2: { text: '开始日期', style: 0 },
            3: { text: '结束日期', style: 0 },
            4: { text: '负责人', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '春节促销' },
            1: { text: '50' },
            2: { text: '2024-01-20' },
            3: { text: '2024-02-10' },
            4: { text: '王五' }
          }
        },
        2: {
          cells: {
            0: { text: '618大促' },
            1: { text: '80' },
            2: { text: '2024-06-01' },
            3: { text: '2024-06-18' },
            4: { text: '赵六' }
          }
        }
      },
      cols: { len: 5 }
    }]),
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 5400000,
    folder: '营销策划',
    creator: '王五',
    updater: '赵六'
  },
  {
    id: '10',
    title: 'API 接口设计文档',
    type: 'document',
    content: '<h1>API 接口设计</h1><h2>用户模块</h2><ul><li>POST /api/user/login - 用户登录</li><li>GET /api/user/info - 获取用户信息</li><li>PUT /api/user/profile - 更新用户资料</li></ul><h2>文档模块</h2><ul><li>GET /api/documents - 获取文档列表</li><li>POST /api/documents - 创建文档</li><li>PUT /api/documents/:id - 更新文档</li></ul>',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 9000000,
    folder: '技术文档',
    creator: '张三',
    updater: '李四'
  },
  {
    id: '11',
    title: '竞品分析报告',
    type: 'document',
    content: '<h1>竞品分析</h1><h2>主要竞品</h2><ul><li>竞品A：市场份额 35%</li><li>竞品B：市场份额 28%</li><li>竞品C：市场份额 15%</li></ul><h2>我们的优势</h2><p>产品体验更优、技术更先进、服务更完善</p>',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 21600000,
    folder: '产品规划',
    creator: '赵六',
    updater: '王五'
  },
  {
    id: '12',
    title: '员工培训计划',
    type: 'document',
    content: '<h1>2024年员工培训计划</h1><h2>技术培训</h2><ul><li>Vue3 进阶培训</li><li>TypeScript 实战</li><li>微服务架构</li></ul><h2>软技能培训</h2><ul><li>沟通技巧</li><li>项目管理</li><li>团队协作</li></ul>',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 12600000,
    folder: '人力资源',
    creator: '李四',
    updater: '李四'
  },
  {
    id: '13',
    title: '项目进度跟踪表',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '进度跟踪',
      freeze: 'A1',
      styles: [{ bgcolor: '#9c27b0', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '项目名称', style: 0 },
            1: { text: '进度', style: 0 },
            2: { text: '状态', style: 0 },
            3: { text: '预计完成', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '移动端适配' },
            1: { text: '60%' },
            2: { text: '进行中' },
            3: { text: '2024-03-15' }
          }
        },
        2: {
          cells: {
            0: { text: '性能优化' },
            1: { text: '30%' },
            2: { text: '进行中' },
            3: { text: '2024-02-28' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 1800000,
    folder: '项目管理',
    creator: '张三',
    updater: '张三'
  },
  {
    id: '14',
    title: '品牌策略规划',
    type: 'document',
    content: '<h1>品牌策略</h1><h2>品牌定位</h2><p>打造行业领先的智能协作平台</p><h2>核心价值</h2><ul><li>高效协作</li><li>智能助手</li><li>安全可靠</li></ul><h2>传播策略</h2><p>社交媒体营销 + KOL合作 + 内容营销</p>',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 25200000,
    folder: '营销策划',
    creator: '王五',
    updater: '王五'
  },
  {
    id: '15',
    title: '系统架构优化方案',
    type: 'mindmap',
    content: '',
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 16200000,
    folder: '技术文档',
    creator: '李四',
    updater: '张三'
  },
  {
    id: '16',
    title: '客户反馈汇总',
    type: 'document',
    content: '<h1>客户反馈汇总</h1><h2>功能建议</h2><ul><li>增加批量导出功能</li><li>优化移动端体验</li><li>支持更多文件格式</li></ul>',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 8000000,
    folder: '客户服务',
    creator: '王五',
    updater: '王五'
  },
  {
    id: '17',
    title: '财务预算表Q1',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '预算',
      freeze: 'A1',
      styles: [{ bgcolor: '#f44336', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '部门', style: 0 },
            1: { text: '预算(万元)', style: 0 },
            2: { text: '实际支出', style: 0 },
            3: { text: '差异', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '研发部' },
            1: { text: '200' },
            2: { text: '185' },
            3: { text: '-15' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 6000000,
    folder: '财务管理',
    creator: '赵六',
    updater: '赵六'
  },
  {
    id: '18',
    title: '设计规范文档v2.0',
    type: 'document',
    content: '<h1>设计规范</h1><h2>颜色规范</h2><p>主色：#0052D9</p><p>辅助色：#52c41a</p><h2>字体规范</h2><p>标题：PingFang SC Medium</p>',
    createdAt: Date.now() - 86400000 * 11,
    updatedAt: Date.now() - 11000000,
    folder: '设计文档',
    creator: '李四',
    updater: '张三'
  },
  {
    id: '19',
    title: '招聘计划2024',
    type: 'document',
    content: '<h1>2024年招聘计划</h1><h2>技术岗位</h2><ul><li>前端工程师 x 3</li><li>后端工程师 x 5</li><li>测试工程师 x 2</li></ul>',
    createdAt: Date.now() - 86400000 * 13,
    updatedAt: Date.now() - 13000000,
    folder: '人力资源',
    creator: '王五',
    updater: '李四'
  },
  {
    id: '20',
    title: '市场调研报告',
    type: 'document',
    content: '<h1>市场调研报告</h1><h2>市场规模</h2><p>目标市场规模：500亿元</p><h2>竞争态势</h2><p>主要竞争对手分析...</p>',
    createdAt: Date.now() - 86400000 * 16,
    updatedAt: Date.now() - 15000000,
    folder: '市场分析',
    creator: '赵六',
    updater: '王五'
  },
  {
    id: '21',
    title: '测试用例集',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '测试用例',
      freeze: 'A1',
      styles: [{ bgcolor: '#9c27b0', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '用例ID', style: 0 },
            1: { text: '用例名称', style: 0 },
            2: { text: '优先级', style: 0 },
            3: { text: '状态', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: 'TC-001' },
            1: { text: '登录功能测试' },
            2: { text: 'P0' },
            3: { text: '通过' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 4000000,
    folder: '测试文档',
    creator: '张三',
    updater: '李四'
  },
  {
    id: '22',
    title: '运营数据周报',
    type: 'document',
    content: '<h1>运营周报</h1><h2>本周数据</h2><ul><li>新增用户：1,234</li><li>活跃用户：8,567</li><li>留存率：78%</li></ul>',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 2000000,
    folder: '运营报告',
    creator: '王五',
    updater: '王五'
  },
  // ===== 我的文档 (creator: 'demo') =====
  {
    id: '23',
    title: '我的工作笔记',
    type: 'document',
    content: '<h1>工作笔记</h1><h2>本周工作</h2><ul><li>完成用户模块开发</li><li>修复3个bug</li><li>代码review</li></ul><h2>下周计划</h2><ul><li>开发支付模块</li><li>性能优化</li></ul>',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000,
    folder: '个人笔记',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: '24',
    title: '个人学习计划 - Vue3进阶',
    type: 'document',
    content: '<h1>Vue3进阶学习计划</h1><h2>学习目标</h2><ul><li>深入理解Composition API</li><li>掌握Pinia状态管理</li><li>学习Vue3性能优化</li></ul><h2>学习资源</h2><p>官方文档、视频教程、实战项目</p>',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 7200000,
    folder: '学习资料',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: '25',
    title: '我的项目任务清单',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '任务清单',
      freeze: 'A1',
      styles: [{ bgcolor: '#1890ff', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '任务名称', style: 0 },
            1: { text: '优先级', style: 0 },
            2: { text: '状态', style: 0 },
            3: { text: '截止日期', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '完成登录功能' },
            1: { text: 'P0' },
            2: { text: '已完成' },
            3: { text: '2025-11-20' }
          }
        },
        2: {
          cells: {
            0: { text: '开发文档管理模块' },
            1: { text: 'P1' },
            2: { text: '进行中' },
            3: { text: '2025-11-28' }
          }
        },
        3: {
          cells: {
            0: { text: '编写单元测试' },
            1: { text: 'P2' },
            2: { text: '待开始' },
            3: { text: '2025-12-05' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 5000000,
    folder: '项目管理',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: '26',
    title: '前端开发规范 - 我的总结',
    type: 'document',
    content: '<h1>前端开发规范</h1><h2>命名规范</h2><ul><li>组件名使用PascalCase</li><li>变量名使用camelCase</li><li>常量使用UPPER_CASE</li></ul><h2>代码风格</h2><ul><li>使用ESLint</li><li>使用Prettier格式化</li><li>遵循Vue3官方风格指南</li></ul>',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 10800000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: '27',
    title: 'Sophia项目开发日志',
    type: 'document',
    content: '<h1>Sophia项目开发日志</h1><h2>2025-11-26</h2><p>完成了菜单状态管理优化，使用Pinia替代URL参数</p><h2>2025-11-25</h2><p>实现了侧边栏展开功能，添加了文档分类</p><h2>2025-11-24</h2><p>搭建项目基础框架，集成TDesign组件库</p>',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 1800000,
    folder: '项目管理',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: '28',
    title: '我的待办事项',
    type: 'document',
    content: '<h1>待办事项</h1><h2>今日必做</h2><ul><li>完成代码review</li><li>修复bug #234</li><li>更新文档</li></ul><h2>本周计划</h2><ul><li>完成用户模块</li><li>准备周会汇报</li></ul>',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 1200000,
    folder: '个人笔记',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: '29',
    title: '技术调研 - 状态管理方案',
    type: 'document',
    content: '<h1>状态管理方案调研</h1><h2>Pinia</h2><p>优点：轻量、类型安全、组合式API友好</p><h2>Vuex</h2><p>优点：成熟稳定、生态完善</p><h2>结论</h2><p>推荐使用Pinia，更适合Vue3项目</p>',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 14400000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: '30',
    title: '我的周报 - 第47周',
    type: 'document',
    content: '<h1>第47周工作总结</h1><h2>本周完成</h2><ul><li>完成3个功能模块</li><li>修复5个bug</li><li>代码review 8次</li></ul><h2>下周计划</h2><ul><li>开发新功能</li><li>性能优化</li></ul>',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 8600000,
    folder: '工作汇报',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-1',
    title: 'React vs Vue 技术选型分析',
    type: 'document',
    content: '<h1>React vs Vue 技术选型分析</h1><h2>React优势</h2><ul><li>生态系统完善</li><li>灵活性高</li><li>大公司背书</li></ul><h2>Vue优势</h2><ul><li>上手简单</li><li>文档清晰</li><li>国内生态好</li></ul><h2>结论</h2><p>根据团队技术栈和项目特点，推荐使用Vue3</p>',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 4800000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-2',
    title: '个人财务管理表',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '月度预算',
      freeze: 'A1',
      styles: [{ bgcolor: '#52c41a', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '项目', style: 0 },
            1: { text: '预算金额', style: 0 },
            2: { text: '实际支出', style: 0 },
            3: { text: '差额', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '房租' },
            1: { text: '3000' },
            2: { text: '3000' },
            3: { text: '0' }
          }
        },
        2: {
          cells: {
            0: { text: '餐饮' },
            1: { text: '2000' },
            2: { text: '1800' },
            3: { text: '200' }
          }
        },
        3: {
          cells: {
            0: { text: '交通' },
            1: { text: '500' },
            2: { text: '450' },
            3: { text: '50' }
          }
        },
        4: {
          cells: {
            0: { text: '娱乐' },
            1: { text: '1000' },
            2: { text: '1200' },
            3: { text: '-200' }
          }
        },
        5: {
          cells: {
            0: { text: '总计' },
            1: { text: '6500' },
            2: { text: '6450' },
            3: { text: '50' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 3600000,
    folder: '个人管理',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'demo-3',
    title: 'TypeScript 学习笔记',
    type: 'document',
    content: '<h1>TypeScript 学习笔记</h1><h2>基础类型</h2><pre><code>let num: number = 123;\nlet str: string = "hello";\nlet bool: boolean = true;</code></pre><h2>接口定义</h2><pre><code>interface User {\n  id: number;\n  name: string;\n  email?: string;\n}</code></pre><h2>泛型</h2><pre><code>function identity&lt;T&gt;(arg: T): T {\n  return arg;\n}</code></pre>',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 7200000,
    folder: '学习资料',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-4',
    title: 'H5移动端适配方案',
    type: 'document',
    content: '<h1>H5移动端适配方案</h1><h2>viewport设置</h2><pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</code></pre><h2>rem适配</h2><ul><li>使用postcss-pxtorem自动转换</li><li>设置根元素font-size</li></ul><h2>媒体查询</h2><pre><code>@media (max-width: 768px) {\n  /* 移动端样式 */\n}</code></pre>',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 5400000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'demo-5',
    title: '读书笔记 - 代码整洁之道',
    type: 'document',
    content: '<h1>代码整洁之道 - 读书笔记</h1><h2>核心原则</h2><ul><li>命名要有意义</li><li>函数要小而专注</li><li>注释要少而精</li><li>代码格式要统一</li></ul><h2>重要观点</h2><blockquote><p>整洁的代码应该像是由关注此事的专业人员编写的。</p></blockquote><h2>实践建议</h2><ul><li>遵循单一职责原则</li><li>减少代码重复</li><li>保持代码简洁</li></ul>',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 10800000,
    folder: '学习资料',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-6',
    title: '每日任务清单 - 11月',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '任务清单',
      freeze: 'A1',
      styles: [{ bgcolor: '#ff9800', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '日期', style: 0 },
            1: { text: '任务内容', style: 0 },
            2: { text: '状态', style: 0 },
            3: { text: '备注', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '11-26' },
            1: { text: '完成H5适配' },
            2: { text: '✓ 完成' },
            3: { text: '已上线' }
          }
        },
        2: {
          cells: {
            0: { text: '11-27' },
            1: { text: '优化搜索功能' },
            2: { text: '进行中' },
            3: { text: '预计明天完成' }
          }
        },
        3: {
          cells: {
            0: { text: '11-28' },
            1: { text: '编写单元测试' },
            2: { text: '待开始' },
            3: { text: '' }
          }
        },
        4: {
          cells: {
            0: { text: '11-29' },
            1: { text: '代码review' },
            2: { text: '待开始' },
            3: { text: '' }
          }
        },
        5: {
          cells: {
            0: { text: '11-30' },
            1: { text: '周会准备' },
            2: { text: '待开始' },
            3: { text: '' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 1800000,
    folder: '个人笔记',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-7',
    title: 'Git 常用命令速查',
    type: 'document',
    content: '<h1>Git 常用命令速查</h1><h2>基本操作</h2><pre><code># 克隆仓库\ngit clone &lt;url&gt;\n\n# 查看状态\ngit status\n\n# 添加文件\ngit add .\n\n# 提交\ngit commit -m "message"</code></pre><h2>分支操作</h2><pre><code># 创建分支\ngit branch &lt;name&gt;\n\n# 切换分支\ngit checkout &lt;name&gt;\n\n# 合并分支\ngit merge &lt;name&gt;</code></pre>',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 14400000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-8',
    title: '健身计划表',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '周计划',
      freeze: 'A1',
      styles: [{ bgcolor: '#722ed1', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '星期', style: 0 },
            1: { text: '运动项目', style: 0 },
            2: { text: '时长', style: 0 },
            3: { text: '完成情况', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '周一' },
            1: { text: '跑步' },
            2: { text: '30分钟' },
            3: { text: '✓' }
          }
        },
        2: {
          cells: {
            0: { text: '周三' },
            1: { text: '游泳' },
            2: { text: '45分钟' },
            3: { text: '✓' }
          }
        },
        3: {
          cells: {
            0: { text: '周五' },
            1: { text: '力量训练' },
            2: { text: '60分钟' },
            3: { text: '待完成' }
          }
        },
        4: {
          cells: {
            0: { text: '周日' },
            1: { text: '瑜伽' },
            2: { text: '40分钟' },
            3: { text: '待完成' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 3600000 * 3,
    folder: '生活记录',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-9',
    title: '前端性能优化指南',
    type: 'document',
    content: '<h1>前端性能优化指南</h1><h2>加载优化</h2><ul><li>代码分割（Code Splitting）</li><li>懒加载（Lazy Loading）</li><li>预加载（Preload）</li><li>CDN加速</li></ul><h2>渲染优化</h2><ul><li>虚拟滚动</li><li>防抖节流</li><li>避免重排重绘</li></ul><h2>打包优化</h2><ul><li>Tree Shaking</li><li>压缩混淆</li><li>Gzip压缩</li></ul>',
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 9000000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'demo-10',
    title: '旅行计划 - 2024春节',
    type: 'document',
    content: '<h1>2024春节旅行计划</h1><h2>目的地</h2><p>云南 - 大理、丽江</p><h2>行程安排</h2><ul><li>Day 1: 抵达昆明</li><li>Day 2-3: 大理古城、洱海</li><li>Day 4-5: 丽江古城、玉龙雪山</li><li>Day 6: 返程</li></ul><h2>预算</h2><ul><li>交通: 3000元</li><li>住宿: 2000元</li><li>餐饮: 1500元</li><li>门票: 1000元</li><li>总计: 7500元</li></ul>',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 18000000,
    folder: '生活记录',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-11',
    title: 'Webpack vs Vite 对比',
    type: 'document',
    content: '<h1>Webpack vs Vite 对比</h1><h2>Webpack</h2><ul><li>成熟稳定，生态完善</li><li>功能强大，插件丰富</li><li>配置复杂</li><li>启动较慢</li></ul><h2>Vite</h2><ul><li>开发速度快</li><li>配置简单</li><li>原生ES Module</li><li>HMR快速响应</li></ul><h2>选型建议</h2><p>新项目推荐使用Vite，老项目可继续使用Webpack</p>',
    createdAt: Date.now() - 86400000 * 11,
    updatedAt: Date.now() - 12600000,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: 'demo-12',
    title: '项目知识库思维导图',
    type: 'mindmap',
    content: '',
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 16200000,
    folder: '学习资料',
    creator: 'demo',
    updater: 'demo'
  },
  // ===== 共享文档 (isShared: true) =====
  {
    id: '31',
    title: '团队协作指南【共享】',
    type: 'document',
    content: '<h1>团队协作指南</h1><h2>沟通规范</h2><ul><li>使用统一的沟通工具</li><li>及时响应消息</li><li>保持友好沟通</li></ul><h2>文档规范</h2><ul><li>统一命名格式</li><li>及时更新文档</li><li>做好版本管理</li></ul>',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 21600000,
    folder: '团队文档',
    creator: '张三',
    updater: '李四',
    isShared: true
  },
  {
    id: '32',
    title: '2024年公司战略规划【共享】',
    type: 'document',
    content: '<h1>2024年公司战略规划</h1><h2>战略目标</h2><ul><li>市场份额提升20%</li><li>产品线扩充</li><li>团队规模扩大</li></ul><h2>重点项目</h2><p>Sophia平台、智能推荐系统、移动端应用</p>',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 32400000,
    folder: '公司文档',
    creator: '王五',
    updater: '赵六',
    isShared: true,
    isFavorite: true
  },
  {
    id: '33',
    title: '产品路线图 2024-2025【共享】',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '产品路线图',
      freeze: 'A1',
      styles: [{ bgcolor: '#722ed1', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '季度', style: 0 },
            1: { text: '主要功能', style: 0 },
            2: { text: '负责团队', style: 0 },
            3: { text: '状态', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '2024 Q4' },
            1: { text: '文档协作功能' },
            2: { text: '产品团队' },
            3: { text: '已完成' }
          }
        },
        2: {
          cells: {
            0: { text: '2025 Q1' },
            1: { text: '实时编辑' },
            2: { text: '技术团队' },
            3: { text: '进行中' }
          }
        },
        3: {
          cells: {
            0: { text: '2025 Q2' },
            1: { text: 'AI智能助手' },
            2: { text: 'AI团队' },
            3: { text: '规划中' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 18000000,
    folder: '产品规划',
    creator: '李四',
    updater: '张三',
    isShared: true
  },
  {
    id: '34',
    title: '技术分享 - Vue3最佳实践【共享】',
    type: 'document',
    content: '<h1>Vue3最佳实践</h1><h2>Composition API</h2><p>推荐使用setup语法糖，代码更简洁</p><h2>响应式系统</h2><p>理解ref和reactive的区别</p><h2>性能优化</h2><ul><li>使用v-memo</li><li>合理使用computed</li><li>虚拟滚动</li></ul>',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 12000000,
    folder: '技术分享',
    creator: '赵六',
    updater: '赵六',
    isShared: true
  },
  {
    id: '35',
    title: '团队OKR - 2025Q1【共享】',
    type: 'document',
    content: '<h1>2025年Q1团队OKR</h1><h2>目标1：提升产品质量</h2><ul><li>KR1: Bug数量降低30%</li><li>KR2: 代码覆盖率达到80%</li></ul><h2>目标2：提高开发效率</h2><ul><li>KR1: 上线周期缩短20%</li><li>KR2: 自动化测试覆盖率60%</li></ul>',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 28800000,
    folder: '团队管理',
    creator: '张三',
    updater: '王五',
    isShared: true,
    isFavorite: true
  },
  {
    id: '36',
    title: '设计系统规范【共享】',
    type: 'document',
    content: '<h1>设计系统规范</h1><h2>颜色系统</h2><p>主色：#0052D9<br/>成功：#52c41a<br/>警告：#ff9800<br/>错误：#f44336</p><h2>字体系统</h2><p>标题：16px/18px/20px<br/>正文：14px<br/>辅助：12px</p>',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 36000000,
    folder: '设计文档',
    creator: '李四',
    updater: '张三',
    isShared: true
  },
  {
    id: '37',
    title: '数据库设计文档【共享】',
    type: 'document',
    content: '<h1>数据库设计</h1><h2>用户表</h2><pre>users:\n- id\n- username\n- email\n- created_at</pre><h2>文档表</h2><pre>documents:\n- id\n- title\n- content\n- creator_id\n- created_at</pre>',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 24000000,
    folder: '技术文档',
    creator: '王五',
    updater: '李四',
    isShared: true
  },
  {
    id: '38',
    title: '项目进度会议纪要【共享】',
    type: 'document',
    content: '<h1>项目进度会议纪要</h1><p><strong>时间：</strong>2025-11-25 15:00</p><p><strong>参会：</strong>全体项目成员</p><h2>进展汇报</h2><ul><li>前端：完成80%</li><li>后端：完成70%</li><li>测试：进行中</li></ul><h2>下一步计划</h2><p>本周完成核心功能开发</p>',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000,
    folder: '会议纪要',
    creator: '赵六',
    updater: '赵六',
    isShared: true
  },
  {
    id: '39',
    title: '客户需求汇总表【共享】',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '需求汇总',
      freeze: 'A1',
      styles: [{ bgcolor: '#13c2c2', color: '#ffffff', bold: true }],
      rows: {
        0: {
          cells: {
            0: { text: '客户名称', style: 0 },
            1: { text: '需求描述', style: 0 },
            2: { text: '优先级', style: 0 },
            3: { text: '状态', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: 'A公司' },
            1: { text: '批量导出功能' },
            2: { text: 'P0' },
            3: { text: '已排期' }
          }
        },
        2: {
          cells: {
            0: { text: 'B公司' },
            1: { text: '权限管理优化' },
            2: { text: 'P1' },
            3: { text: '评估中' }
          }
        },
        3: {
          cells: {
            0: { text: 'C公司' },
            1: { text: '移动端适配' },
            2: { text: 'P2' },
            3: { text: '待评估' }
          }
        }
      },
      cols: { len: 4 }
    }]),
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 9600000,
    folder: '客户管理',
    creator: '张三',
    updater: '王五',
    isShared: true
  },
  {
    id: '40',
    title: '安全规范与最佳实践【共享】',
    type: 'document',
    content: '<h1>安全规范</h1><h2>前端安全</h2><ul><li>防止XSS攻击</li><li>CSRF防护</li><li>敏感信息加密</li></ul><h2>后端安全</h2><ul><li>SQL注入防护</li><li>权限验证</li><li>日志审计</li></ul>',
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 19800000,
    folder: '技术文档',
    creator: '李四',
    updater: '赵六',
    isShared: true
  },
  // ===== Sophia功能说明文件夹及内容 =====
  {
    id: 'folder-sophia',
    title: 'sophia功能说明',
    type: 'folder',
    content: '',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
    folder: '',
    isShared: false,
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: '41',
    title: '第48周工作周报（11.25-11.29）',
    type: 'document',
    content: '<p style="font-size: 13px;"><strong>汇报人：</strong>demo &nbsp;&nbsp;|&nbsp;&nbsp; <strong>部门：</strong>前端研发组 &nbsp;&nbsp;|&nbsp;&nbsp; <strong>时间周期：</strong>2025年11月25日 - 11月29日</p><hr/><h2>📋 本周工作完成情况</h2><table style="font-size: 13px; border-collapse: collapse;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5;">任务类型</th><th style="padding: 6px 10px; background-color: #f5f5f5;">任务内容</th><th style="padding: 6px 10px; background-color: #f5f5f5;">完成状态</th><th style="padding: 6px 10px; background-color: #f5f5f5;">工作量</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><mark style="background-color: #e8f5e9; color: #2e7d32; padding: 2px 6px;">✅ 功能开发</mark></td><td style="padding: 6px 10px;"><strong>面包屑导航实现</strong><br/>为文档编辑页面添加面包屑导航，支持快速层级跳转</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">已完成</span></td><td style="padding: 6px 10px; text-align: center;">2天</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fff3e0; color: #e65100; padding: 2px 6px;">🎨 UI优化</mark></td><td style="padding: 6px 10px;"><strong>编辑器界面优化</strong><br/>标题样式调整、间距优化、滚动条位置调整等12项细节优化</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">已完成</span></td><td style="padding: 6px 10px; text-align: center;">2天</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #fce4ec; color: #c2185b; padding: 2px 6px;">🐛 Bug修复</mark></td><td style="padding: 6px 10px;"><strong>文档元数据展示修复</strong><br/>修复Props响应式失效，creator信息正常显示</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">已完成</span></td><td style="padding: 6px 10px; text-align: center;">0.5天</td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #e3f2fd; color: #1565c0; padding: 2px 6px;">🔧 技术优化</mark></td><td style="padding: 6px 10px;"><strong>布局重构</strong><br/>统一背景色，去除分割线，优化整体视觉效果</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">已完成</span></td><td style="padding: 6px 10px; text-align: center;">0.5天</td></tr></tbody></table><h2>📊 本周数据指标</h2><blockquote style="background-color: #f5f5f5; border-left: 4px solid #0052D9; padding: 10px 14px; margin: 12px 0; font-size: 13px;"><p><strong>代码贡献：</strong></p><ul style="margin: 4px 0;"><li>代码提交：<mark style="background-color: #fff9c4;">15次</mark></li><li>代码行数：+856 / -423</li><li>修复Bug数量：<mark style="background-color: #ffccbc;">8个</mark></li><li>功能优化项：<mark style="background-color: #c5e1a5;">12项</mark></li><li>Code Review：3次</li></ul></blockquote><table style="width: 100%; font-size: 13px; border-collapse: collapse;"><thead><tr><th style="padding: 6px 10px; background-color: #f5f5f5;">指标项</th><th style="padding: 6px 10px; background-color: #f5f5f5;">目标值</th><th style="padding: 6px 10px; background-color: #f5f5f5;">实际值</th><th style="padding: 6px 10px; background-color: #f5f5f5;">完成率</th></tr></thead><tbody><tr><td style="padding: 6px 10px;">任务完成数</td><td style="padding: 6px 10px; text-align: center;">4</td><td style="padding: 6px 10px; text-align: center;">4</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">100%</span></td></tr><tr><td style="padding: 6px 10px;">Bug修复</td><td style="padding: 6px 10px; text-align: center;">6</td><td style="padding: 6px 10px; text-align: center;">8</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">133%</span></td></tr><tr><td style="padding: 6px 10px;">代码质量评分</td><td style="padding: 6px 10px; text-align: center;">85</td><td style="padding: 6px 10px; text-align: center;">92</td><td style="padding: 6px 10px; text-align: center;"><span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">108%</span></td></tr></tbody></table><h2>⚠️ 遇到的问题与解决方案</h2><table style="font-size: 13px; border-collapse: collapse;"><thead><tr><th style="padding: 6px 10px; width: 25%; background-color: #f5f5f5;">问题描述</th><th style="padding: 6px 10px; width: 30%; background-color: #f5f5f5;">影响范围</th><th style="padding: 6px 10px; width: 45%; background-color: #f5f5f5;">解决方案</th></tr></thead><tbody><tr><td style="padding: 6px 10px;"><mark style="background-color: #ffebee; padding: 2px 6px;">Props响应式失效</mark></td><td style="padding: 6px 10px;">creator信息无法显示，影响用户体验</td><td style="padding: 6px 10px;">使用<code style="background: #f5f5f5; padding: 2px 4px; font-size: 12px;">toRefs</code>包装props<br/><pre style="background: #f5f5f5; padding: 6px; margin-top: 4px; font-size: 11px;"><code>const { creator, updatedAt } = toRefs(props)</code></pre></td></tr><tr><td style="padding: 6px 10px;"><mark style="background-color: #ffebee; padding: 2px 6px;">滚动条位置异常</mark></td><td style="padding: 6px 10px;">标题区域不在滚动范围内</td><td style="padding: 6px 10px;">将滚动处理提升到外层容器<br/><pre style="background: #f5f5f5; padding: 6px; margin-top: 4px; font-size: 11px;"><code>overflow: visible (子元素)<br/>overflow-y: auto (父容器)</code></pre></td></tr></tbody></table><blockquote style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 10px 14px; margin: 12px 0; font-size: 13px;"><p>💡 <strong>经验总结：</strong></p><p>在Vue3中使用props时，如果需要解构使用，务必使用<code style="background: #e8f5e9; padding: 2px 4px;">toRefs</code>或<code style="background: #e8f5e9; padding: 2px 4px;">toRef</code>来保持响应式。直接解构会导致响应性丢失。</p></blockquote><h2>📅 下周工作计划</h2><table style="font-size: 13px; border-collapse: collapse;"><thead><tr><th style="padding: 6px 10px; width: 12%; background-color: #f5f5f5;">优先级</th><th style="padding: 6px 10px; width: 28%; background-color: #f5f5f5;">任务名称</th><th style="padding: 6px 10px; width: 45%; background-color: #f5f5f5;">具体内容</th><th style="padding: 6px 10px; width: 15%; background-color: #f5f5f5;">预计工作量</th></tr></thead><tbody><tr><td style="padding: 6px 10px; text-align: center;"><mark style="background-color: #f44336; color: white; padding: 2px 6px;">P0</mark></td><td style="padding: 6px 10px;">文档版本历史功能</td><td style="padding: 6px 10px;">实现文档修改记录、版本对比、版本回滚功能</td><td style="padding: 6px 10px; text-align: center;">3天</td></tr><tr><td style="padding: 6px 10px; text-align: center;"><mark style="background-color: #ff9800; color: white; padding: 2px 6px;">P1</mark></td><td style="padding: 6px 10px;">搜索和过滤优化</td><td style="padding: 6px 10px;">添加高级搜索、标签过滤、排序功能</td><td style="padding: 6px 10px; text-align: center;">2天</td></tr><tr><td style="padding: 6px 10px; text-align: center;"><mark style="background-color: #ff9800; color: white; padding: 2px 6px;">P1</mark></td><td style="padding: 6px 10px;">快捷键支持</td><td style="padding: 6px 10px;">实现常用编辑操作的快捷键，提升编辑效率</td><td style="padding: 6px 10px; text-align: center;">1天</td></tr><tr><td style="padding: 6px 10px; text-align: center;"><mark style="background-color: #2196f3; color: white; padding: 2px 6px;">P2</mark></td><td style="padding: 6px 10px;">文档分享与权限</td><td style="padding: 6px 10px;">完善文档分享链接生成、权限控制功能</td><td style="padding: 6px 10px; text-align: center;">2天</td></tr><tr><td style="padding: 6px 10px; text-align: center;"><mark style="background-color: #9e9e9e; color: white; padding: 2px 6px;">P3</mark></td><td style="padding: 6px 10px;">单元测试</td><td style="padding: 6px 10px;">编写核心组件的单元测试，提高代码质量</td><td style="padding: 6px 10px; text-align: center;">1天</td></tr></tbody></table><h2>🤝 需要的支持与协调</h2><blockquote style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 10px 14px; margin: 12px 0; font-size: 13px;"><p><strong>需求确认：</strong></p><ul style="margin: 4px 0;"><li>需要产品团队确认文档分享功能的详细需求（<mark style="background-color: #ffcc80;">紧急</mark>）</li><li>需要设计团队提供新图标素材，包括版本历史、分享等功能图标</li></ul></blockquote><blockquote style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 10px 14px; margin: 12px 0; font-size: 13px;"><p><strong>技术支持：</strong></p><ul style="margin: 4px 0;"><li>需要后端团队配合提供文档版本存储API接口</li><li>需要运维团队协助配置CDN，优化文档加载速度</li></ul></blockquote><hr/><p style="text-align: center; color: #999; font-size: 12px;">本周报由 Sophia 平台生成 · 数据统计时间：2025-11-29</p>',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000 * 2,
    folder: 'sophia功能说明',
    creator: 'demo',
    updater: 'demo'
  },
  {
    id: '42',
    title: 'Sophia功能清单与开发进度',
    type: 'spreadsheet',
    content: JSON.stringify([{
      name: '功能清单',
      freeze: 'A1',
      styles: [{ bgcolor: '#0052D9', color: '#ffffff', bold: true }],
      merges: [],
      rows: {
        0: {
          cells: {
            0: { text: '功能模块', style: 0 },
            1: { text: '功能说明', style: 0 },
            2: { text: '开发状态', style: 0 },
            3: { text: '完成度', style: 0 },
            4: { text: '备注', style: 0 }
          }
        },
        1: {
          cells: {
            0: { text: '富文本编辑器' },
            1: { text: 'Tiptap编辑器，支持基础格式和扩展功能' },
            2: { text: '已完成' },
            3: { text: '100%' },
            4: { text: '支持协同编辑' }
          }
        },
        2: {
          cells: {
            0: { text: '在线表格' },
            1: { text: 'x-data-spreadsheet电子表格功能' },
            2: { text: '已完成' },
            3: { text: '100%' },
            4: { text: '基础功能完善' }
          }
        },
        3: {
          cells: {
            0: { text: '思维导图' },
            1: { text: 'X6图形引擎实现的思维导图编辑器' },
            2: { text: '已完成' },
            3: { text: '100%' },
            4: { text: '支持拖拽和编辑' }
          }
        },
        4: {
          cells: {
            0: { text: '实时协作' },
            1: { text: 'Yjs + WebSocket实现的协同编辑' },
            2: { text: '已完成' },
            3: { text: '95%' },
            4: { text: '文档协作完成，思维导图协作开发中' }
          }
        },
        5: {
          cells: {
            0: { text: '文档管理' },
            1: { text: '文档列表、搜索、分类、收藏等功能' },
            2: { text: '已完成' },
            3: { text: '100%' },
            4: { text: 'UI优化完成' }
          }
        },
        6: {
          cells: {
            0: { text: '用户系统' },
            1: { text: '登录、注册、权限管理' },
            2: { text: '已完成' },
            3: { text: '80%' },
            4: { text: '基础功能完成，权限细化中' }
          }
        },
        7: {
          cells: {
            0: { text: '白板功能' },
            1: { text: '自由画板和图形编辑功能' },
            2: { text: '规划中' },
            3: { text: '0%' },
            4: { text: '下个版本计划' }
          }
        },
        8: {
          cells: {
            0: { text: '流程图' },
            1: { text: '流程图绘制和编辑工具' },
            2: { text: '规划中' },
            3: { text: '0%' },
            4: { text: '技术方案评估中' }
          }
        },
        9: {
          cells: {
            0: { text: 'AI助手' },
            1: { text: '智能写作和内容优化助手' },
            2: { text: '规划中' },
            3: { text: '0%' },
            4: { text: '长期规划' }
          }
        }
      },
      cols: {
        len: 5
      }
    }]),
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000,
    folder: 'sophia功能说明',
    creator: 'demo',
    updater: 'demo'
  },

  // ========== 搜索用Mock文档 ==========
  // 技术文档系列
  {
    id: 'tech-1',
    title: 'Vue3组合式API最佳实践',
    type: 'document',
    content: '<h1>Vue3组合式API最佳实践</h1><p>本文总结了Vue3中Composition API的使用技巧和最佳实践...</p>',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 4,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'tech-2',
    title: 'React Hooks深入理解',
    type: 'document',
    content: '<h1>React Hooks深入理解</h1><p>useState、useEffect、useMemo等Hook的原理和使用场景...</p>',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 7,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'tech-3',
    title: 'TypeScript类型体操进阶',
    type: 'document',
    content: '<h1>TypeScript类型体操进阶</h1><p>泛型、条件类型、映射类型等高级特性详解...</p>',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 11,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'tech-4',
    title: 'Node.js性能优化指南',
    type: 'document',
    content: '<h1>Node.js性能优化指南</h1><p>内存管理、集群模式、缓存策略等优化技巧...</p>',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 14,
    folder: '技术文档',
    creator: '张三',
    updater: 'demo',
    isShared: true
  },
  {
    id: 'tech-5',
    title: 'Webpack配置完全指南',
    type: 'document',
    content: '<h1>Webpack配置完全指南</h1><p>从入门到精通，掌握Webpack的各种配置技巧...</p>',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 17,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'tech-6',
    title: 'Docker容器化实战',
    type: 'document',
    content: '<h1>Docker容器化实战</h1><p>镜像构建、容器编排、多阶段构建等实战经验...</p>',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 19,
    folder: '技术文档',
    creator: '李四',
    updater: '李四',
    isShared: true
  },

  // 会议记录系列
  {
    id: 'meeting-1',
    title: '2025年Q1产品规划会议',
    type: 'document',
    content: '<h1>2025年Q1产品规划会议</h1><p>时间：2025-11-15<br>参会人员：产品、研发、设计团队<br>讨论内容：新版本功能规划...</p>',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 2,
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'meeting-2',
    title: '技术架构评审会议纪要',
    type: 'document',
    content: '<h1>技术架构评审会议纪要</h1><p>讨论了微服务拆分方案、数据库设计、缓存策略等...</p>',
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 5,
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'meeting-3',
    title: '项目复盘会议记录',
    type: 'document',
    content: '<h1>项目复盘会议记录</h1><p>总结项目经验教训，提出改进建议...</p>',
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 8,
    folder: '工作笔记',
    creator: '王五',
    updater: 'demo',
    isShared: true
  },

  // 项目文档系列
  {
    id: 'project-1',
    title: '电商平台开发计划',
    type: 'document',
    content: '<h1>电商平台开发计划</h1><p>项目周期：3个月<br>功能模块：商品管理、订单系统、支付集成、用户中心...</p>',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 6,
    folder: '项目文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'project-2',
    title: '移动端H5项目技术方案',
    type: 'document',
    content: '<h1>移动端H5项目技术方案</h1><p>技术栈：Vue3 + Vant4 + TypeScript<br>难点：适配、性能优化、离线缓存...</p>',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 9,
    folder: '项目文档',
    creator: '张三',
    updater: 'demo',
    isShared: true
  },
  {
    id: 'project-3',
    title: '后台管理系统需求文档',
    type: 'document',
    content: '<h1>后台管理系统需求文档</h1><p>功能清单：用户管理、权限管理、数据统计、系统配置...</p>',
    createdAt: Date.now() - 86400000 * 13,
    updatedAt: Date.now() - 86400000 * 12,
    folder: '项目文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },

  // 学习笔记系列
  {
    id: 'study-1',
    title: '算法与数据结构学习笔记',
    type: 'document',
    content: '<h1>算法与数据结构学习笔记</h1><p>排序算法、二叉树、动态规划、贪心算法...</p>',
    createdAt: Date.now() - 86400000 * 16,
    updatedAt: Date.now() - 86400000 * 15,
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'study-2',
    title: 'HTTP协议深入解析',
    type: 'document',
    content: '<h1>HTTP协议深入解析</h1><p>请求方法、状态码、缓存机制、HTTPS原理...</p>',
    createdAt: Date.now() - 86400000 * 21,
    updatedAt: Date.now() - 86400000 * 20,
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'study-3',
    title: '设计模式实战应用',
    type: 'document',
    content: '<h1>设计模式实战应用</h1><p>单例模式、工厂模式、观察者模式、策略模式在实际项目中的应用...</p>',
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 24,
    folder: '工作笔记',
    creator: '李四',
    updater: '李四',
    isShared: true
  },

  // 产品需求系列
  {
    id: 'prd-1',
    title: '用户中心改版需求',
    type: 'document',
    content: '<h1>用户中心改版需求</h1><p>优化个人信息展示、增加积分系统、会员体系设计...</p>',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3,
    folder: '产品规划',
    creator: '王五',
    updater: 'demo',
    isShared: true
  },
  {
    id: 'prd-2',
    title: '支付流程优化方案',
    type: 'document',
    content: '<h1>支付流程优化方案</h1><p>简化支付步骤、增加快捷支付、优化错误提示...</p>',
    createdAt: Date.now() - 86400000 * 11,
    updatedAt: Date.now() - 86400000 * 10,
    folder: '产品规划',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'prd-3',
    title: '消息推送功能设计',
    type: 'document',
    content: '<h1>消息推送功能设计</h1><p>站内信、邮件通知、短信验证码、推送设置...</p>',
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 86400000 * 13,
    folder: '产品规划',
    creator: '赵六',
    updater: '赵六',
    isShared: true
  },

  // 测试文档系列
  {
    id: 'test-1',
    title: '自动化测试实践总结',
    type: 'document',
    content: '<h1>自动化测试实践总结</h1><p>单元测试、集成测试、E2E测试的实践经验...</p>',
    createdAt: Date.now() - 86400000 * 17,
    updatedAt: Date.now() - 86400000 * 16,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'test-2',
    title: 'API接口测试用例',
    type: 'document',
    content: '<h1>API接口测试用例</h1><p>用户登录、数据查询、文件上传等接口的测试用例...</p>',
    createdAt: Date.now() - 86400000 * 19,
    updatedAt: Date.now() - 86400000 * 18,
    folder: '项目文档',
    creator: '张三',
    updater: '张三',
    isShared: true
  },

  // 工作总结系列
  {
    id: 'summary-1',
    title: '11月工作周报',
    type: 'document',
    content: '<h1>11月工作周报</h1><p>本周完成：Vue组件开发3个、Bug修复5个<br>下周计划：页面优化、性能测试...</p>',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'summary-2',
    title: 'Q4季度工作总结',
    type: 'document',
    content: '<h1>Q4季度工作总结</h1><p>主要成果：完成3个项目开发、技术分享2次、代码审查30+次...</p>',
    createdAt: Date.now() - 86400000 * 22,
    updatedAt: Date.now() - 86400000 * 21,
    folder: '工作笔记',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },

  // 其他类型文档
  {
    id: 'other-1',
    title: '前端性能监控方案',
    type: 'document',
    content: '<h1>前端性能监控方案</h1><p>Performance API、错误监控、用户行为追踪...</p>',
    createdAt: Date.now() - 86400000 * 23,
    updatedAt: Date.now() - 86400000 * 22,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: false
  },
  {
    id: 'other-2',
    title: '代码规范与最佳实践',
    type: 'document',
    content: '<h1>代码规范与最佳实践</h1><p>ESLint配置、Git提交规范、代码审查标准...</p>',
    createdAt: Date.now() - 86400000 * 26,
    updatedAt: Date.now() - 86400000 * 25,
    folder: '团队协作',
    creator: '李四',
    updater: '李四',
    isShared: true
  },
  {
    id: 'other-3',
    title: '团队协作工具使用指南',
    type: 'document',
    content: '<h1>团队协作工具使用指南</h1><p>Jira、Confluence、Figma等工具的使用技巧...</p>',
    createdAt: Date.now() - 86400000 * 27,
    updatedAt: Date.now() - 86400000 * 26,
    folder: '团队协作',
    creator: '王五',
    updater: '王五',
    isShared: true
  },
  {
    id: 'other-4',
    title: '前端安全防护措施',
    type: 'document',
    content: '<h1>前端安全防护措施</h1><p>XSS防御、CSRF防御、内容安全策略CSP...</p>',
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now() - 86400000 * 27,
    folder: '技术文档',
    creator: 'demo',
    updater: 'demo',
    isFavorite: true
  },
  {
    id: 'other-5',
    title: 'Git工作流与分支管理',
    type: 'document',
    content: '<h1>Git工作流与分支管理</h1><p>Git Flow、GitHub Flow、分支命名规范...</p>',
    createdAt: Date.now() - 86400000 * 29,
    updatedAt: Date.now() - 86400000 * 28,
    folder: '技术文档',
    creator: '赵六',
    updater: 'demo',
    isShared: true
  }
]

// 模拟数据库存储
let documentsDB = [...mockDocuments]

// 重置数据库
export const resetDB = () => {
  documentsDB = [...mockDocuments]
}

// 获取数据库
export const getDB = () => documentsDB

// 设置数据库
export const setDB = (data: Document[]) => {
  documentsDB = [...data]
}

// ========== 知识库 Mock 数据 ==========
export const mockWikis: Wiki[] = [
  {
    id: 'wiki-1',
    title: '前端开发知识库',
    description: '收录前端开发相关的技术文档、最佳实践、框架使用指南等内容，涵盖Vue、React、TypeScript等主流技术栈',
    icon: 'code',
    color: '#0052D9',
    documentCount: 28,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 2,
    isPublic: true,
    tags: ['前端', '开发', 'Vue', 'React']
  },
  {
    id: 'wiki-2',
    title: '产品设计规范',
    description: '团队产品设计规范文档，包括UI设计规范、交互设计准则、用户体验指南、设计组件库等内容',
    icon: 'palette',
    color: '#00A870',
    documentCount: 15,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 5,
    isPublic: true,
    tags: ['设计', 'UI', 'UX', '规范']
  },
  {
    id: 'wiki-3',
    title: 'API接口文档',
    description: '后端API接口文档集合，详细记录了系统各模块的接口定义、请求参数、响应格式、错误码说明等',
    icon: 'api',
    color: '#E37318',
    documentCount: 42,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 1,
    isPublic: false,
    tags: ['API', '后端', '接口', '文档']
  },
  {
    id: 'wiki-4',
    title: '项目管理指南',
    description: '项目管理流程规范、敏捷开发实践、团队协作方法、需求管理、版本发布流程等项目管理相关内容',
    icon: 'task',
    color: '#D54941',
    documentCount: 12,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 90,
    updatedAt: Date.now() - 86400000 * 7,
    isPublic: true,
    tags: ['项目管理', '敏捷', '协作', '流程']
  },
  {
    id: 'wiki-5',
    title: '测试与质量保证',
    description: '软件测试规范、测试用例编写指南、自动化测试实践、性能测试方法、代码质量标准等内容',
    icon: 'bug',
    color: '#7B4FF0',
    documentCount: 19,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 50,
    updatedAt: Date.now() - 86400000 * 4,
    isPublic: true,
    tags: ['测试', '质量', '自动化', 'QA']
  },
  {
    id: 'wiki-6',
    title: '运维部署手册',
    description: '系统部署流程、服务器配置、容器化方案、CI/CD流水线、监控告警、故障处理等运维相关文档',
    icon: 'server',
    color: '#0594FA',
    documentCount: 24,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 40,
    updatedAt: Date.now() - 86400000 * 3,
    isPublic: false,
    tags: ['运维', '部署', 'DevOps', 'Docker']
  },
  {
    id: 'wiki-7',
    title: '数据库设计文档',
    description: '数据库表结构设计、索引优化方案、SQL优化技巧、数据迁移方案、备份恢复策略等数据库相关文档',
    icon: 'database',
    color: '#2BA471',
    documentCount: 16,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 70,
    updatedAt: Date.now() - 86400000 * 6,
    isPublic: false,
    tags: ['数据库', 'MySQL', '优化', '设计']
  },
  {
    id: 'wiki-8',
    title: '安全规范手册',
    description: '系统安全规范、代码安全审查标准、漏洞修复指南、安全测试方法、数据加密方案等安全相关内容',
    icon: 'secured',
    color: '#C9353F',
    documentCount: 10,
    creator: 'demo',
    createdAt: Date.now() - 86400000 * 55,
    updatedAt: Date.now() - 86400000 * 8,
    isPublic: false,
    tags: ['安全', '加密', '审查', '规范']
  }
]

// 知识库数据库
let wikisDB = [...mockWikis]

// 重置知识库数据库
export const resetWikisDB = () => {
  wikisDB = [...mockWikis]
}

// 获取知识库数据库
export const getWikisDB = () => wikisDB

// 设置知识库数据库
export const setWikisDB = (data: Wiki[]) => {
  wikisDB = [...data]
}
