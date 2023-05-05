<template>
  <div class="home-container">
    <div class="nav">
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <PieChartOutlined />
          </template>
          <router-link
            :to="{
              name: 'dashboard',
            }"
            >控制台</router-link
          >
        </a-menu-item>
        <a-sub-menu key="essay">
          <template #icon>
            <FileSyncOutlined />
          </template>
          <template #title>文章管理</template>
          <a-menu-item key="essayList">
            <template #icon>
              <ProfileOutlined />
            </template>
            <router-link
              :to="{
                name: 'essayList',
              }"
              >文章列表</router-link
            >
          </a-menu-item>
          <a-menu-item key="category">
            <template #icon>
              <AppstoreOutlined />
            </template>
            <router-link
              :to="{
                name: 'category',
              }"
              >文章分类</router-link
            >
          </a-menu-item>
          <a-menu-item key="addEssay">
            <template #icon>
              <FileAddOutlined />
            </template>
            <router-link
              :to="{
                name: 'addEssay',
              }"
              >添加文章</router-link
            >
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="issue">
          <template #icon>
            <ReconciliationOutlined />
          </template>
          <template #title>问答管理</template>
          <a-menu-item key="issueList">
            <template #icon>
              <QuestionCircleOutlined />
            </template>
            <router-link
              :to="{
                name: 'issueList',
              }"
              >问答列表</router-link
            >
          </a-menu-item>
          <a-menu-item key="addIssue">
            <template #icon>
              <PlusCircleOutlined />
            </template>
            <router-link
              :to="{
                name: 'addIssue',
              }"
              >添加问答</router-link
            >
          </a-menu-item>
        </a-sub-menu>
        <!-- <a-sub-menu key="life">
          <template #icon>
            <ShareAltOutlined />
          </template>
          <template #title>动态管理</template>
          <a-menu-item key="lifeList">
            <template #icon>
              <SmileOutlined />
            </template>
            <router-link
              :to="{
                name: 'lifeList',
              }"
              >动态列表</router-link
            >
          </a-menu-item>
          <a-menu-item key="addLife">
            <template #icon>
              <PlusOutlined />
            </template>
            <router-link
              :to="{
                name: 'addLife',
              }"
              >发布动态</router-link
            >
          </a-menu-item>
        </a-sub-menu> -->
        <a-menu-item key="message">
          <template #icon>
            <AliwangwangOutlined />
          </template>
          <router-link
            :to="{
              name: 'message',
            }"
            >留言板</router-link
          >
        </a-menu-item>
      </a-menu>
    </div>
    <div class="main">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  PieChartOutlined,
  QuestionCircleOutlined,
  FileSyncOutlined,
  ShareAltOutlined,
  ProfileOutlined,
  FileAddOutlined,
  AppstoreOutlined,
  ReconciliationOutlined,
  PlusCircleOutlined,
  SmileOutlined,
  PlusOutlined,
  AliwangwangOutlined,
} from '@ant-design/icons-vue';

import { confirmChecked } from './util';

const route = useRoute();
const state = computed(() => ({
  selectedKeys: [route.name || 'dashboard'],
  openKeys: [confirmChecked(route.name)],
}));

// const router = useRouter();

// router.push({
//   name: 'dashboard',
// });
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  .nav {
    width: 13%;
    flex-shrink: 0;
    position: relative;
    background: #001529;
  }
  .main {
    height: 100%;
    flex-grow: 1;
    overflow: hidden scroll;
  }
}
</style>
