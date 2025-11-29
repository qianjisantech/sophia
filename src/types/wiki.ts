// 知识库类型定义
export interface Wiki {
  id: string
  title: string
  description: string
  cover?: string  // 封面图片URL
  icon?: string   // 图标
  color?: string  // 主题颜色
  documentCount: number  // 文档数量
  creator: string
  createdAt: number | string
  updatedAt: number | string
  isPublic?: boolean  // 是否公开
  tags?: string[]  // 标签
}
