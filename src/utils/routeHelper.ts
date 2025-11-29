import { useRoute } from 'vue-router'

/**
 * 判断当前是否为H5模式
 */
export function isH5Mode(): boolean {
  const route = useRoute()
  return route.path.startsWith('/h5')
}

/**
 * 判断当前是否为Web模式
 */
export function isWebMode(): boolean {
  const route = useRoute()
  return route.path.startsWith('/web')
}

/**
 * 获取当前模式前缀
 */
export function getCurrentModePrefix(): '/web' | '/h5' {
  return isH5Mode() ? '/h5' : '/web'
}

/**
 * 生成带模式前缀的路由路径
 * @param path 相对路径，如 '/document/123'
 * @returns 完整路径，如 '/web/document/123' 或 '/h5/document/123'
 */
export function getRoutePath(path: string): string {
  const prefix = getCurrentModePrefix()
  // 如果path已经包含前缀，直接返回
  if (path.startsWith('/web') || path.startsWith('/h5')) {
    return path
  }
  // 去掉path开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${prefix}/${cleanPath}`
}

/**
 * 组合式函数：路由助手
 */
export function useRouteHelper() {
  const route = useRoute()

  const isH5 = isH5Mode()
  const isWeb = isWebMode()
  const modePrefix = getCurrentModePrefix()

  /**
   * 生成路由路径
   */
  const getPath = (path: string) => getRoutePath(path)

  /**
   * 根据当前模式导航
   */
  const navigateTo = (router: any, path: string) => {
    router.push(getPath(path))
  }

  return {
    isH5,
    isWeb,
    modePrefix,
    getPath,
    navigateTo
  }
}
