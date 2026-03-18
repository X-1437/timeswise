import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { step: 0, requiresAuth: true }
  },
  {
    path: '/data-import',
    name: 'DataImport',
    component: () => import('../views/DataImport.vue'),
    meta: { step: 1, requiresAuth: true }
  },
  {
    path: '/eda',
    name: 'EDA',
    component: () => import('../views/EDA.vue'),
    meta: { step: 2, requiresAuth: true }
  },
  {
    path: '/preprocessing',
    name: 'Preprocessing',
    component: () => import('../views/Preprocessing.vue'),
    meta: { step: 3, requiresAuth: true }
  },
  {
    path: '/feature-engineering',
    name: 'FeatureEngineering',
    component: () => import('../views/FeatureEngineering.vue'),
    meta: { step: 4, requiresAuth: true }
  },
  {
    path: '/forecasting',
    name: 'Forecasting',
    component: () => import('../views/Forecasting.vue'),
    meta: { step: 5, requiresAuth: true }
  },
  {
    path: '/export',
    name: 'Export',
    component: () => import('../views/Export.vue'),
    meta: { step: 6, requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
