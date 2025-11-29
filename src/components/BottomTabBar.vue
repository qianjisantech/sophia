<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMenuStore } from '../stores/menu'

const router = useRouter()
const menuStore = useMenuStore()

const tabItems = [
  { key: 'home', label: '主页', icon: 'home', path: '/home' },
  { key: 'cloud', label: '云盘', icon: 'folder', path: '/cloud' },
  { key: 'wiki', label: '知识库', icon: 'book', path: '/wiki' },
  { key: 'my', label: '我的', icon: 'user', path: '/home' } // 暂时使用home，后续可以添加专门的我的页面
]

const handleTabClick = (key: string, path: string) => {
  menuStore.setActiveMenu(key)
  router.push(path)
}
</script>

<template>
  <div class="bottom-tab-bar">
    <div
      v-for="item in tabItems"
      :key="item.key"
      :class="['tab-item', { active: menuStore.activeMenu === item.key }]"
      @click="handleTabClick(item.key, item.path)"
    >
      <t-icon :name="item.icon" class="tab-icon" />
      <span class="tab-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
/* 底部Tab栏 - 默认隐藏 */
.bottom-tab-bar {
  display: none;
}

/* ===== 移动端显示底部Tab栏 (768px以下) ===== */
@media (max-width: 768px) {
  .bottom-tab-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: white;
    border-top: 1px solid var(--border-color-2);
    z-index: 100;
    padding: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
  }

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
    color: var(--text-secondary);
    padding: 6px 0;
  }

  .tab-item.active {
    color: var(--primary-color);
  }

  .tab-item.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 0 0 3px 3px;
  }

  .tab-icon {
    font-size: 22px;
    transition: all var(--transition-fast);
  }

  .tab-item.active .tab-icon {
    transform: scale(1.05);
  }

  .tab-label {
    font-size: 11px;
    font-weight: 400;
    transition: all var(--transition-fast);
    letter-spacing: -0.2px;
  }

  .tab-item.active .tab-label {
    font-weight: 600;
  }

  /* 触摸反馈 */
  .tab-item:active {
    background: rgba(0, 0, 0, 0.03);
  }
}

/* ===== 超小屏幕优化 (480px以下) ===== */
@media (max-width: 480px) {
  .bottom-tab-bar {
    height: 52px;
  }

  .tab-icon {
    font-size: 20px;
  }

  .tab-label {
    font-size: 10px;
  }
}

/* ===== 安全区域适配（适配刘海屏） ===== */
@supports (padding: env(safe-area-inset-bottom)) {
  @media (max-width: 768px) {
    .bottom-tab-bar {
      padding-bottom: env(safe-area-inset-bottom);
      height: calc(56px + env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 480px) {
    .bottom-tab-bar {
      height: calc(52px + env(safe-area-inset-bottom));
    }
  }
}
</style>
