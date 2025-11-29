import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type DeviceMode = 'auto' | 'web' | 'mobile'
export type DeviceType = 'desktop' | 'mobile'

/**
 * 设备模式管理 Store
 * 支持自动检测和手动切换
 */
export const useDeviceStore = defineStore('device', () => {
  // 当前模式：auto-自动检测，web-强制Web，mobile-强制H5
  const mode = ref<DeviceMode>('auto')

  // 检测到的实际设备类型
  const detectedDeviceType = ref<DeviceType>('desktop')

  // 计算当前应该使用的设备类型
  const currentDeviceType = computed<DeviceType>(() => {
    if (mode.value === 'web') return 'desktop'
    if (mode.value === 'mobile') return 'mobile'
    return detectedDeviceType.value
  })

  // 是否为移动端
  const isMobile = computed(() => currentDeviceType.value === 'mobile')

  // 是否为桌面端
  const isDesktop = computed(() => currentDeviceType.value === 'desktop')

  /**
   * 检测设备类型
   */
  const detectDevice = () => {
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
    const isMobileWidth = window.innerWidth <= 768
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const isMobileDevice = isMobileUA || (isMobileWidth && isTouchDevice)

    detectedDeviceType.value = isMobileDevice ? 'mobile' : 'desktop'

    // 更新 HTML class
    updateHtmlClass()

    return detectedDeviceType.value
  }

  /**
   * 设置设备模式
   */
  const setMode = (newMode: DeviceMode) => {
    mode.value = newMode
    localStorage.setItem('deviceMode', newMode)
    updateHtmlClass()
  }

  /**
   * 切换到Web模式
   */
  const switchToWeb = () => {
    setMode('web')
  }

  /**
   * 切换到Mobile模式
   */
  const switchToMobile = () => {
    setMode('mobile')
  }

  /**
   * 切换到自动检测模式
   */
  const switchToAuto = () => {
    setMode('auto')
    detectDevice()
  }

  /**
   * 更新HTML的class
   */
  const updateHtmlClass = () => {
    const html = document.documentElement
    const type = currentDeviceType.value

    if (type === 'mobile') {
      html.classList.add('is-mobile', 'device-mobile')
      html.classList.remove('is-desktop', 'device-desktop')
    } else {
      html.classList.add('is-desktop', 'device-desktop')
      html.classList.remove('is-mobile', 'device-mobile')
    }
  }

  /**
   * 初始化
   */
  const init = () => {
    // 从 localStorage 恢复模式
    const savedMode = localStorage.getItem('deviceMode') as DeviceMode
    if (savedMode && ['auto', 'web', 'mobile'].includes(savedMode)) {
      mode.value = savedMode
    }

    // 如果是自动模式，检测设备
    if (mode.value === 'auto') {
      detectDevice()

      // 监听窗口变化
      window.addEventListener('resize', detectDevice)
    } else {
      updateHtmlClass()
    }
  }

  return {
    mode,
    detectedDeviceType,
    currentDeviceType,
    isMobile,
    isDesktop,
    detectDevice,
    setMode,
    switchToWeb,
    switchToMobile,
    switchToAuto,
    init
  }
})
