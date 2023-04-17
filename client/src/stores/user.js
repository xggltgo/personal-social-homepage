import { defineStore } from 'pinia';
import * as userApi from '../api/user';

export const useUserStore = defineStore('user', {
  state: () => ({ userInfo: null }),
  actions: {
    async login(data) {
      const result = await userApi.login(data);
      this.userInfo = result;
      return result;
    },
    async whoAmI() {
      const result = await userApi.whoAmI();
      this.userInfo = result;
    },
    async loginOut() {
      localStorage.removeItem('token');
      this.userInfo = null;
    },
    async update(data) {
      const result = await userApi.updateUserInfo(data);
      this.userInfo = result;
    },
  },
});
