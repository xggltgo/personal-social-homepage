import { createRouter, createWebHistory } from 'vue-router';
import 'nprogress/nprogress.css';
import { start, done, configure } from 'nprogress';

configure({
  trickleSpeed: 20,
  showSpinner: false,
});

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function getPageComponent(pageCompResolver) {
  return async () => {
    start();
    if (process.env.NODE_ENV === 'development') {
      // await delay(2000);
    }
    const comp = await pageCompResolver();
    done();
    return comp;
  };
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: () => import('../views/home/index.vue'),
      redirect: { name: 'essay' },
    },
    {
      path: '/essay',
      name: 'essay',
      component: getPageComponent(() => import('../views/essay/index.vue')),
    },
    {
      path: '/essay/category/:categoryid',
      name: 'essayCategory',
      component: getPageComponent(() => import('../views/essay/index.vue')),
    },
    {
      path: '/essay/detail/:essayid',
      name: 'essayDetail',
      component: getPageComponent(() => import('../views/essay/detail.vue')),
    },
    {
      path: '/issue',
      name: 'issue',
      component: getPageComponent(() => import('../views/issue/index.vue')),
    },
    {
      path: '/issue/detail/:issueid',
      name: 'issueDetail',
      component: getPageComponent(() => import('../views/issue/detail.vue')),
    },
    {
      path: '/life',
      name: 'life',
      component: getPageComponent(() => import('../views/life/index.vue')),
    },
    {
      path: '/message',
      name: 'message',
      component: getPageComponent(() => import('../views/message/index.vue')),
    },
    {
      path: '/user/detail/:userid',
      name: 'user',
      component: getPageComponent(() => import('../views/user/index.vue')),
    },
    {
      path: '/result',
      name: 'result',
      component: getPageComponent(() => import('../views/result/index.vue')),
    },
    {
      path: '/search',
      name: 'search',
      component: getPageComponent(() => import('../views/search/index.vue')),
    },
  ],
});

export default router;
