import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import OtherPage from '../views/OtherPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/other',
    name: 'OtherPage',
    component: OtherPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
