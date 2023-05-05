import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/dashboard/index.vue'),
        },
        {
          path: 'essayList',
          name: 'essayList',
          component: () => import('../views/essay/list.vue'),
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('../views/essay/category.vue'),
        },
        {
          path: 'addEssay',
          name: 'addEssay',
          component: () => import('../views/essay/add.vue'),
        },

        {
          path: 'issueList',
          name: 'issueList',
          component: () => import('../views/issue/list.vue'),
        },
        {
          path: 'addIssue',
          name: 'addIssue',
          component: () => import('../views/issue/add.vue'),
        },
        // {
        //   path: 'lifeList',
        //   name: 'lifeList',
        //   component: () => import('../views/life/list.vue'),
        // },
        // {
        //   path: 'addLife',
        //   name: 'addLife',
        //   component: () => import('../views/life/add.vue'),
        // },
        {
          path: 'message',
          name: 'message',
          component: () => import('../views/message/index.vue'),
        },

        // {
        //   path: '/404',
        //   name: 'notFound',
        //   component: () => import('../views/not-found.vue'),
        // },
        // {
        //   path: '/:pathMatch(.*)',
        //   redirect: '/404',
        // },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.fullPath === '/login') {
    // 访问登录页 直接放行
    next();
  } else {
    const userStore = useUserStore();
    const token = localStorage.getItem('token');
    // 访问其他页面 判断用户是否登录
    if (userStore.userInfo) {
      next();
    } else if (!userStore.userInfo && token) {
      const result = await userStore.whoAmI();
      if (result) {
        next();
      } else {
        next({ name: 'login' });
      }
    } else {
      next({ name: 'login' });
    }
  }
});

export default router;
