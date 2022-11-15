import { createRouter, createWebHistory } from "vue-router";
import Recommend from "@/views/Recommend.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/recommend",
    },
    {
      name: "recommend",
      path: "/recommend",
      component: Recommend,
    },
    {
      name: "singer",
      path: "/singer",
      component: () => import("@/views/Singer.vue"),
    },
    {
      name: "top-list",
      path: "/top-list",
      component: () => import("@/views/TopList.vue"),
    },
    {
      name: "search",
      path: "/search",
      component: () => import("@/views/MySearch.vue"),
    },
  ],
});

export default router;
