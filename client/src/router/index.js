import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/essay',
      name: 'essay',
      component: () => import('../views/essay/index.vue'),
    },
    {
      path: '/essay/category/:categoryid',
      name: 'essayCategory',
      component: () => import('../views/essay/index.vue'),
    },
    {
      path: '/essay/detail/:essayid',
      name: 'essayDetail',
      component: () => import('../views/essay/detail.vue'),
    },
    {
      path: '/issue',
      name: 'issue',
      component: () => import('../views/issue/index.vue'),
    },
    {
      path: '/life',
      name: 'life',
      component: () => import('../views/life/index.vue'),
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('../views/message/index.vue'),
    },
    {
      path: '/user/detail/:userid',
      name: 'user',
      component: () => import('../views/user/index.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../views/result/index.vue'),
    },
  ],
});

export default router;
