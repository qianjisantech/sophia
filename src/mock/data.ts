import type { Document } from '../stores/document'

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
    content: '<h1>技术架构设计</h1><h2>前端架构</h2><ul><li>Vue 3 + TypeScript</li><li>Pinia 状态管理</li><li>TDesign UI 组件库</li></ul><h2>后端架构</h2><ul><li>Node.js + Express</li><li>MongoDB 数据库</li><li>Redis 缓存</li></ul>',
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
