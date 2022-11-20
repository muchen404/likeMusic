import { createRouter, createWebHistory } from 'vue-router'
import Recommend from '@/views/Recommend.vue'
import Singer from '@/views/Singer.vue'
import SingerDetail from '@/views/SingerDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
      name: 'recommend',
      path: '/recommend',
      component: Recommend,
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      name: 'top-list',
      path: '/top-list',
      component: () => import('@/views/TopList.vue'),
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('@/views/MySearch.vue'),
    },
  ],
})

export default router
