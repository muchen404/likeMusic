import { createRouter, createWebHistory } from 'vue-router'
import Recommend from '@/views/Recommend.vue'
import Singer from '@/views/Singer.vue'
import SingerDetail from '@/views/SingerDetail.vue'
import TopList from '@/views/TopList.vue'
import TopDetail from '@/views/TopDetail.vue'
import Search from '@/views/MySearch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      component: () => (import('@/views/Recommend.vue')),
      children: [
        {
          path: ':id',
          component: () => import('@/views/Album.vue')
        }
      ]
    },
    {
      path: '/singer',
      component: () => (import('@/views/Singer.vue')),
      children: [
        {
          path: ':id',
          component: () => (import('@/views/SingerDetail.vue'))
        }
      ]
    },
    {
      path: '/top-list',
      component: () => (import('@/views/TopList.vue')),
      children: [
        {
          path: ':id',
          component: () => (import('@/views/TopDetail.vue'))
        }
      ]
    },
    {
      path: '/search',
      component: () => (import('@/views/MySearch.vue')),
      children: [
        {
          path: ':id',
          // component: SingerDetail
          component: () => (import('@/views/SingerDetail.vue'))
        }
      ]
    },
    {
      path: '/user',
      components: {
        user: () => (import('@/views/UserCenter.vue'))
      }
    },
  ],
})

export default router
