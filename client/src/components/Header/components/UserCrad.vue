<template>
  <div class="user-card-container">
    <div class="header">
      <div class="info">
        <div class="avatar left">
          <a-avatar :size="48" :src="userInfo.avatar"> </a-avatar>
        </div>
        <div class="right">
          <div class="nickname">{{ userInfo.nickname }}</div>
          <div class="integral">积分：{{ userInfo.integral }}</div>
        </div>
      </div>
      <div class="count">
        <div class="count-item">
          <div class="number">{{ userInfo.selfEssayCount }}</div>
          <div class="text">文章</div>
        </div>
        <div class="count-item">
          <div class="number">{{ userInfo.selfIssueCount }}</div>
          <div class="text">问答</div>
        </div>
        <div class="count-item">
          <div class="number">{{ userInfo.selfLifeCount }}</div>
          <div class="text">动态</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <router-link
        :to="{
          name: 'user',
          params: {
            userid: userInfo.id,
          },
        }"
        class="selfPage"
        >我的主页</router-link
      >
      <div class="loginOut" @click="handleLoginOut">退出登录</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 处理退出登录
function handleLoginOut() {
  userStore.loginOut();
  router.push('/');
}
</script>

<style lang="less" scoped>
.user-card-container {
  padding: 8px 4px;
}

.header {
  .info {
    display: flex;
    margin-bottom: 16px;
    .avatar {
      margin-right: 12px;
    }
    .right {
      width: 164px;
      .nickname {
        word-break: break-all;
        font-size: 16px;
        line-height: 18px;
        color: #252933;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        margin-bottom: 8px;
        margin-top: 2px;
        .integral {
          color: #252933;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
  .count {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(228, 230, 235, 0.5);
    padding-bottom: 12px;
    margin-bottom: 10px;
    .count-item {
      width: 74px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      .number {
        font-weight: 500;
        font-size: 16px;
        line-height: 18px;
        color: #252933;
        margin-bottom: 4px;
      }
      .text {
        color: #8a919f;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  color: #8a919f;
  .selfPage,
  .loginOut {
    cursor: pointer;
  }
  .selfPage:hover,
  .loginOut:hover {
    color: #388fff;
  }
}
</style>
