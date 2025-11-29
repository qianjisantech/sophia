import { ref, onMounted, onUnmounted } from 'vue'

export type DeviceType = 'mobile' | 'desktop'

/**
 * 检测当前设备类型
 * @returns isMobile - 是否为移动设备
 * @returns deviceType - 设备类型 ('mobile' | 'desktop')
 * @returns checkDevice - 手动检查设备类型的方法
 */
export function useDevice() {
  const isMobile = ref(false)
  const deviceType = ref<DeviceType>('desktop')

  /**
   * 检测是否为移动设备
   * 通过 userAgent 和屏幕宽度综合判断
   */
  const checkDevice = () => {
    // 1. 检查 userAgent
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileKeywords = [
      'android',
      'webos',
      'iphone',
      'ipad',
      'ipod',
      'blackberry',
      'windows phone',
      'mobile'
    ]

    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))

    // 2. 检查屏幕宽度（768px 以下认为是移动设备）
    const isMobileWidth = window.innerWidth <= 768

    // 3. 检查触摸支持
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // 综合判断：userAgent 匹配移动设备 或 (屏幕宽度小 且 支持触摸)
    const isMobileDevice = isMobileUA || (isMobileWidth && isTouchDevice)

    isMobile.value = isMobileDevice
    deviceType.value = isMobileDevice ? 'mobile' : 'desktop'

    // 在 document.documentElement 上添加设备类型的 class
    const html = document.documentElement
    if (isMobileDevice) {
      html.classList.add('is-mobile')
      html.classList.remove('is-desktop')
    } else {
      html.classList.add('is-desktop')
      html.classList.remove('is-mobile')
    }

    return isMobileDevice
  }

  // 监听窗口大小变化
  const handleResize = () => {
    checkDevice()
  }

  onMounted(() => {
    // 初始化时检测
    checkDevice()

    // 监听窗口变化
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    // 清理监听器
    window.removeEventListener('resize', handleResize)
  })

  return {
    isMobile,
    deviceType,
    checkDevice
  }
}
