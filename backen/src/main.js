import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount('#app');

// 恢复登录状态
// import { useUserStore } from './stores/user';
// useUserStore().whoAmI();
