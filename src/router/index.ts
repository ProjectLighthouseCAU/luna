import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import OtherPage from '../views/OtherPage.vue'
import SingleDisplay from '@/views/LighthouseDisplaySingle.vue'

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
  },
  {
    path: '/display/:id',
    name: 'Display',
    component: SingleDisplay
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
