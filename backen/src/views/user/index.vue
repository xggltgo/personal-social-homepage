<template>
  <div class="user-container">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      bordered
    >
      <!-- 需要额外渲染的列 -->
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.key === 'index'">
          {{ (pageInfo.page - 1) * pageInfo.limit + index + 1 }}
        </template>
        <template v-else-if="column.key === 'nickname'">
          <a
            :href="`http://127.0.0.1:5173/user/detail/${record.id}`"
            style="text-decoration: underline"
            >{{ record.nickname }}</a
          >
        </template>
        <template v-else-if="column.key === 'registerDate'">
          {{ formatLocaleTime(record.registerDate) }}
        </template>
        <template v-else-if="column.key === 'avatar'">
          <a-avatar :size="45" :src="record.avatar"> </a-avatar>
        </template>
        <template v-else-if="column.key === 'isAdmin'">
          <a-tag :color="record.isAdmin ? '#1890ff' : ''">{{
            record.isAdmin ? '系统管理员' : '普通用户'
          }}</a-tag>
        </template>
        <template v-else-if="column.key === 'profession'">
          {{ record.profession || '暂未设置' }}
        </template>
        <template v-else-if="column.key === 'selfIntroduction'">
          {{ record.selfIntroduction || '暂未设置' }}
        </template>
      </template>
    </a-table>

    <div class="pager" v-if="showPager">
      <a-pagination
        v-model:current="pageInfo.page"
        :total="total"
        show-less-items
        @change="handlePageChange"
        :hideOnSinglePage="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, createVNode } from 'vue';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';

import { getUserByPage } from '@/api/user';
import { formatLocaleTime } from '@/utils/tools';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 200,
  },
  {
    title: '用户头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 100,
  },
  {
    title: '用户账号',
    dataIndex: 'loginId',
    key: 'loginId',
    width: 150,
  },
  {
    title: '用户职业',
    dataIndex: 'profession',
    key: 'profession',
  },
  {
    title: '用户简介',
    dataIndex: 'selfIntroduction',
    key: 'selfIntroduction',
  },
  {
    title: '用户身份',
    dataIndex: 'isAdmin',
    key: 'isAdmin',
    width: 130,
  },
  {
    title: '文章数量',
    dataIndex: 'selfEssayCount',
    key: 'selfEssayCount',
    width: 90,
  },
  {
    title: '问答数量',
    dataIndex: 'selfIssueCount',
    key: 'selfIssueCount',
    width: 90,
  },
  {
    title: '动态数量',
    dataIndex: 'selfLifeCount',
    key: 'selfLifeCount',
    width: 90,
  },
  {
    title: '加入时间',
    dataIndex: 'registerDate',
    key: 'registerDate',
    width: 200,
  },
].map((item) => ({ ...item, align: 'center', ellipsis: true }));
const data = ref([]);

// 分页
const showPager = ref(true);
const pageInfo = reactive({
  page: 1,
  limit: 10,
});
const total = ref(0);
const handlePageChange = (page) => {
  pageInfo.page = page;
  fetchUserByPage();
};

// 获取用户列表数据
const fetchUserByPage = async () => {
  const result = await getUserByPage({
    ...pageInfo,
  });
  console.log(result);
  data.value = result.userList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};
fetchUserByPage();
</script>

<style lang="less" scoped>
.user-container {
  padding: 30px;
  .pager {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
