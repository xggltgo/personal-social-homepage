<template>
  <div class="header-container">
    <!-- logo区域 -->
    <div class="logo">
      <img src="../../assets/imgs/logo.png" alt="" />
    </div>

    <!-- 导航栏区域 -->
    <div class="nav">
      <a-menu v-model:selectedKeys="currentRoute" mode="horizontal">
        <a-menu-item v-for="item in routes" :key="item.name">
          <router-link
            :to="{
              name: item.name,
            }"
            >{{ item.display }}</router-link
          >
        </a-menu-item>
      </a-menu>
    </div>

    <!-- 搜索区域 -->
    <div class="search">
      <a-input-search
        v-model:value="searchText"
        placeholder="搜索"
        :loading="isLoading"
        enter-button
        allowClear
      />
    </div>

    <!-- 发布中心区域 -->
    <div class="tools">
      <a-popover>
        <template #content>
          <div class="header-tools-popover-wrapper">
            <div class="tools-item" @click="showToolModal('essay')">
              <FormOutlined :style="{ fontSize: 20 + 'px' }" />
              <span class="text">写文章</span>
            </div>
            <div class="tools-item">
              <QuestionCircleOutlined :style="{ fontSize: 20 + 'px' }" />
              <span class="text">问问题</span>
            </div>
            <div class="tools-item" @click="showToolModal('life')"> 
              <CameraOutlined :style="{ fontSize: 20 + 'px' }" />
              <span class="text">发动态</span>
            </div>
          </div>
        </template>
        <a-button type="primary">
          工具箱
          <template #icon>
            <AndroidOutlined />
          </template>
        </a-button>
      </a-popover>
    </div>

    <!-- 登录注册区域 -->
    <div class="login-register">
      <a-popover v-if="!userInfo">
        <template #content>
          <div class="login-register-desc">
            <div class="tips">登录 PH 后可立即获得以下权益：</div>
            <div class="right-list">
              <div class="right-item">
                <div class="icon">
                  <ReadOutlined
                    :style="{ fontSize: 16 + 'px', color: '#1e80ff' }"
                  />
                </div>
                <div class="text">免费阅读文章</div>
              </div>
              <div class="right-item">
                <div class="icon">
                  <ShareAltOutlined
                    :style="{ fontSize: 16 + 'px', color: '#1e80ff' }"
                  />
                </div>
                <div class="text">分享你的日常</div>
              </div>
              <div class="right-item">
                <div class="icon">
                  <MessageOutlined
                    :style="{ fontSize: 16 + 'px', color: '#1e80ff' }"
                  />
                </div>
                <div class="text">留下你的观点</div>
              </div>
              <div class="right-item">
                <div class="icon">
                  <QuestionCircleOutlined
                    :style="{ fontSize: 16 + 'px', color: '#1e80ff' }"
                  />
                </div>
                <div class="text">提出你的问题</div>
              </div>
            </div>
            <a-button
              type="primary"
              block
              size="large"
              @click="showModal('登录')"
              >立即登录</a-button
            >
            <div class="info">
              首次使用？<span class="register-btn" @click="showModal('注册')"
                >点我注册</span
              >
            </div>
          </div>
        </template>
        <a-button>登录 | 注册</a-button>
      </a-popover>
      <a-popover trigger="click" placement="bottomRight" v-else>
        <template #content>
          <UserCard :userInfo="userInfo" />
        </template>
        <a-avatar :size="36" :src="userInfo.avatar"> </a-avatar>
      </a-popover>
    </div>
  </div>

  <!-- 登录对话框 -->
  <a-modal
    v-model:visible="visible"
    centered
    :title="model === '登录' ? '登录 PH 畅享更多权益' : '注册'"
    @ok="handleOk"
    :footer="null"
    :width="390"
  >
    <LoginForm v-if="model === '登录'" @close-modal="hideModal" />
    <div class="register" v-else>注册</div>
  </a-modal>

  <!-- 发布文章、发表问答、发布动态对话框 -->
  <a-modal
    v-model:visible="toolVisible"
    @ok="handleToolOk"
    :footer="null"
    width="100%"
    wrap-class-name="full-modal"
  >
    <EssayModal @closeToolModal="hideToolModal" v-if="toolmodel === 'essay'" />
    <LifeModal @closeToolModal="hideToolModal" v-else-if="toolmodel === 'life'" />
  </a-modal>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  AndroidOutlined,
  CameraOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  ShareAltOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue';

import LoginForm from './components/LoginForm.vue';
import UserCard from './components/UserCrad.vue';
import EssayModal from '@/components/EssayModal/index.vue';
import LifeModal from '@/components/LifeModal/index.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const route = useRoute();
const currentRoute = ref([]);
const searchText = ref('');
const visible = ref(false); // 控制登录注册表单是否弹出
const toolVisible = ref(false); // 控制登录注册表单是否弹出
const model = ref('登录'); // 控制当前应该弹出登录还是注册
const toolmodel = ref('essay'); // 控制当前应该弹出文章、问答、动态还是注册
const isLoading = ref(false);
watchEffect(() => {
  currentRoute.value = [route.name];
});
const routes = [
  {
    path: '/',
    name: 'home',
    display: '首页',
  },
  {
    path: '/essay',
    name: 'essay',
    display: '文章',
  },
  {
    path: '/issue',
    name: 'issue',
    display: '问答',
  },
  {
    path: '/life',
    name: 'life',
    display: '动态',
  },
  {
    path: '/message',
    name: 'message',
    display: '留言',
  },
];

//
const handleOk = (e) => {
  visible.value = false;
};

// 显示登录注册表单
const showModal = (text) => {
  model.value = text;
  visible.value = true;
};

const hideModal = () => {
  visible.value = false;
};

const handleToolOk = (e) => {
  toolVisible.value = false;
};

//显示新增文章、问答、动态的对话框
const showToolModal = (text) => {
  toolmodel.value = text;
  toolVisible.value = true;
};

const hideToolModal = () => {
  toolVisible.value = false;
};
</script>

<style lang="less">
.header-container {
  background: #fff;
  padding: 0 15%;
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid rgb(241, 241, 241);
  // logo区域
  .logo {
    height: 100%;
    img {
      height: 100%;
      object-fit: cover;
    }
  }

  .nav {
    flex-grow: 1;
    .ant-menu {
      border-bottom: none;
    }
  }

  .search {
    margin-left: 50px;
  }

  .tools {
    margin: 0 30px;
  }

  // 工具箱

  // 登录注册
  .login-register {
    cursor: pointer;
    .ant-btn {
      background: #f4f9ff;
      color: #007fff;
    }
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.header-tools-popover-wrapper {
  display: flex;
  color: #515767;
  column-gap: 15px;
  .tools-item {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    cursor: pointer;
    padding: 5px 10px;
    &:hover {
      background: #f7f8fa;
    }
  }
}

.login-register-desc {
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tips {
    font-size: 16px;
    font-weight: 500;
    color: #252933;
    margin-bottom: 24px;
    line-height: 24px;
  }
  .right-list {
    width: 288px;
    display: flex;
    flex: 1 0 auto;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    color: #515767;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 16px;
    .right-item {
      width: 130px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      .icon {
        width: 28px;
        height: 28px;
        border-radius: 14px;
        background-color: #eaf2ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .text {
        margin-left: 8px;
      }
    }
  }
  .info {
    margin-top: 8px;
    color: #8a919f;
    font-size: 13px;
    line-height: 22px;
    .register-btn {
      color: #1e80ff;
      cursor: pointer;
    }
  }
}
</style>
