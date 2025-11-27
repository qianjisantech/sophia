import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // 当前激活的菜单项
  const activeMenu = ref<string>('home')

  // 设置当前菜单
  const setActiveMenu = (menu: string) => {
    activeMenu.value = menu
  }

  return {
    activeMenu,
    setActiveMenu
  }
})
