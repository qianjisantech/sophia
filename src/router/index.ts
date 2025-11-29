import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/HomeEntry.vue')
      },
      {
        path: 'cloud',
        name: 'Cloud',
        component: () => import('../views/HomeEntry.vue')
      },
      {
        path: 'wiki',
        name: 'Wiki',
        component: () => import('../views/WikiView.vue')
      },
      {
        path: 'rbac',
        name: 'RBAC',
        component: () => import('../views/HomeEntry.vue')
      },
      {
        path: 'trash',
        name: 'Trash',
        component: () => import('../views/HomeEntry.vue')
      },
      {
        path: 'document/:id',
        name: 'DocumentEditor',
        component: () => import('../views/DocumentEditor.vue')
      },
      {
        path: 'spreadsheet/:id',
        name: 'SpreadsheetView',
        component: () => import('../views/SpreadsheetView.vue')
      },
      {
        path: 'mindmap/:id',
        name: 'MindmapView',
        component: () => import('../views/MindmapView.vue')
      },
      {
        path: 'folder/:id',
        name: 'FolderView',
        component: () => import('../views/FolderView.vue')
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('../views/mobile/SearchMobile.vue')
      }
    ]
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
  routes,
  // 优化滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
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
    next('/home')
  }
  else {
    next()
  }
})

// H5模式下预加载常用路由（延迟执行，不阻塞初始渲染）
if (typeof window !== 'undefined') {
  const preloadRoutes = () => {
    if (window.innerWidth <= 768) {
      // 延迟预加载，在空闲时执行
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const routes = ['/home', '/cloud', '/wiki']
          routes.forEach(path => {
            try {
              const resolved = router.resolve(path)
              resolved.matched.forEach(match => {
                if (match.components?.default && typeof match.components.default === 'function') {
                  match.components.default()
                }
              })
            } catch (e) {
              // 忽略预加载错误
            }
          })
        }, { timeout: 2000 })
      } else {
        // 降级方案
        setTimeout(() => {
          const routes = ['/home', '/cloud', '/wiki']
          routes.forEach(path => {
            try {
              const resolved = router.resolve(path)
              resolved.matched.forEach(match => {
                if (match.components?.default && typeof match.components.default === 'function') {
                  match.components.default()
                }
              })
            } catch (e) {
              // 忽略预加载错误
            }
          })
        }, 2000)
      }
    }
  }
  
  // 页面加载完成后预加载
  if (document.readyState === 'complete') {
    preloadRoutes()
  } else {
    window.addEventListener('load', preloadRoutes)
  }
}

export default router
