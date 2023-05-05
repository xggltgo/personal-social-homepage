<template>
  <div class="search-container">
    <div class="left type"></div>
    <div class="main">
      <div class="content">
        <div class="rank"></div>
        <a-tabs v-model:activeKey="activeKey" @change="handleChange">
          <a-tab-pane key="1" tab="文章">
            <EssayList :searchText="route.query.searchText" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="问答" force-render>
            <IssueList :searchText="route.query.searchText" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="动态" force-render>
            <LifeList :searchText="route.query.searchText" />
          </a-tab-pane>
        </a-tabs>
      </div>
      <aside class="aside"></aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import EssayList from '@/views/essay/components/EssayList.vue';
import IssueList from '@/views/issue/components/IssueList.vue';
import LifeList from '@/views/life/components/LifeList.vue';

const route = useRoute();
const router = useRouter();

const activeKey = ref('1');
const handleChange = () => {
  router.push({
    name: route.name,
    query: {
      ...route.query,
      page: 1,
    },
  });
};
</script>

<style lang="less" scoped>
.search-container {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.left {
  position: sticky;
  top: 30px;
  width: 180px;
  margin-right: 20px;
  background: #fff;
  // padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.main {
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  .content {
    flex-grow: 1;
    background: #fff;
    padding: 12px 20px;
  }
  .aside {
    width: 260px;
    margin-left: 20px;
    height: 300px;
    // background: #fff;
    border-radius: 4px;
    flex-shrink: 0;
  }
}
</style>
