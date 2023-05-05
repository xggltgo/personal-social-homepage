<template>
  <div class="result-container">
    <a-result
      status="success"
      :title="`${route.query.essayid ? '《' : '“'}${route.query.title}${
        route.query.essayid ? '》' : '”'
      }`"
      sub-title="发布成功！有了你的分享， PH 会变得更好！"
    >
      <template #extra>
        <a-button key="console" type="primary" @click="backHome"
          >回到首页</a-button
        >
        <a-button key="essay-btn" v-if="route.query.essayid">
          <router-link
            :to="{
              name: 'essayDetail',
              params: {
                essayid: route.query.essayid,
              },
            }"
            >查看文章</router-link
          >
        </a-button>
        <a-button key="issue-btn" v-else-if="route.query.issueid">
          <router-link
            :to="{
              name: 'issueDetail',
              params: {
                issueid: route.query.issueid,
              },
            }"
            >查看问答</router-link
          >
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const backHome = () => {
  router.push({
    name: 'home',
  });
};
</script>

<style lang="less" scoped>
.result-container {
  background: #fff;
  min-height: 100%;
}
</style>
