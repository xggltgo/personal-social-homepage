<template>
  <div class="result-container">
    <a-result
      status="success"
      :title="`《${route.query.title}》`"
      sub-title="发布成功！有了你的分享， PH 会变得更好！"
    >
      <template #extra>
        <a-button key="console" type="primary" @click="backHome"
          >回到首页</a-button
        >
        <a-button key="buy">
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
