import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/debug',
    name: 'Debug',
    component: () => import('../views/Debug.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue')
  },
  {
    path: '/document/:id',
    name: 'DocumentEditor',
    component: () => import('../views/DocumentEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/spreadsheet/:id',
    name: 'SpreadsheetView',
    component: () => import('../views/SpreadsheetView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mindmap/:id',
    name: 'MindmapView',
    component: () => import('../views/MindmapView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/folder/:id',
    name: 'FolderView',
    component: () => import('../views/FolderView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/collaborative-demo',
    name: 'CollaborativeDemo',
    component: () => import('../views/CollaborativeDemoView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/collaborative-mindmap-demo',
    name: 'CollaborativeMindmapDemo',
    component: () => import('../views/CollaborativeMindmapDemoView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/collaborative-spreadsheet-demo',
    name: 'CollaborativeSpreadsheetDemo',
    component: () => import('../views/CollaborativeSpreadsheetDemoView.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  // 如果需要登录但未登录，跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  }
  // 如果已登录访问登录页，跳转到首页
  else if (to.path === '/login' && isLoggedIn) {
    next('/')
  }
  else {
    next()
  }
})

export default router
