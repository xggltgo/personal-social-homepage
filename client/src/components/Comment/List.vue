<template>
  <div class="comment-list-container">
    <div class="title">全部评论（{{ commentList.length }}）</div>
    <a-comment v-for="item in commentList" :key="item.id">
      <template #author
        ><router-link
          :to="{
            name: 'user',
            params: {
              userid: item.user?.id,
            },
          }"
          >{{ item.user?.nickname }}</router-link
        ></template
      >
      <template #avatar>
        <a-avatar :src="item.user?.avatar" />
      </template>
      <template #content>
        <p>
          {{ item.content }}
        </p>
      </template>
      <template #datetime>
        <a-tooltip :title="formatLocaleTime(item.createDate)">
          <span>{{ formatDateFromNow(item.createDate) }}</span>
        </a-tooltip>
      </template>
    </a-comment>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { formatDateFromNow, formatLocaleTime } from '@/utils/tools';

defineProps({
  commentList: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="less" scoped>
.title {
  line-height: 30px;
  font-weight: 600;
  font-size: 18px;
  color: #252933;
  padding-bottom: 8px;
}

.ant-comment-content-author-name {
  a {
    color: #333;
    &:hover {
      color: #6bc8ff;
    }
  }
}
</style>
