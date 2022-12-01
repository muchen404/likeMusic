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
      component: Recommend,
      children: [
        {
          path: ':id',
          component: () => import('@/views/Album.vue')
        }
      ]
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
      path: '/top-list',
      component: TopList,
      children: [
        {
          path: ':id',
          component: TopDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
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
