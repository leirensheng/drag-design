import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/editor/index.vue')
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/preview/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
