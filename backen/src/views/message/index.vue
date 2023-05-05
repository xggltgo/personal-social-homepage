<template>
  <div class="message-container">
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
        <template v-else-if="column.key === 'avatar'">
          <a-avatar :size="45" :src="record.user.avatar"> </a-avatar>
        </template>
        <template v-else-if="column.key === 'nickname'">
          {{ record.user.nickname }}
        </template>
        <template v-else-if="column.key === 'createDate'">
          {{ formatLocaleTime(record.createDate) }}
        </template>
        <template v-else-if="column.key === 'more'">
          <a-tooltip>
            <template #title>删除</template>
            <a-button
              type="danger"
              shape="circle"
              @click="handleDelete(record.id)"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </a-tooltip>
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
import { Modal, message } from 'ant-design-vue';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';

import { getMessageByPage, deleteMessage } from '@/api/message';
import { formatLocaleTime } from '@/utils/tools';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '头像',
    dataIndex: 'user',
    key: 'avatar',
    width: 100,
  },
  {
    title: '昵称',
    dataIndex: 'user',
    key: 'nickname',
    width: 200,
  },
  {
    title: '留言内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '发布时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 200,
  },
  {
    title: '操作',
    key: 'more',
    width: 150,
  },
].map((item) => ({ ...item, align: 'center', ellipsis: true }));
const data = ref([]);

// 分页相关
const showPager = ref(true);
const pageInfo = reactive({
  page: 1,
  limit: 10,
});
const total = ref(0);
const handlePageChange = (page) => {
  pageInfo.page = page;
  fetchMessageByPage();
};

// 获取留言列表数据
const fetchMessageByPage = async () => {
  const result = await getMessageByPage({
    ...pageInfo,
  });
  console.log(result);
  data.value = result.messageList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};
fetchMessageByPage();

// 删除留言
const handleDelete = (messageid) => {
  Modal.confirm({
    title: '确定删除该条留言吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      {
        style: 'color:red;',
      },
      '此留言一旦删除，不能恢复'
    ),
    cancelText: '取消',
    okText: '确定',
    async onOk() {
      // 更新仓库数据
      await deleteMessage(messageid);
      if (data.value.length === 1) {
        if (pageInfo.page === 1) {
          return;
        } else {
          pageInfo.page -= 1;
        }
      }
      await fetchMessageByPage();
    },
    class: 'test',
  });
};
</script>

<style lang="less" scoped>
.message-container {
  padding: 30px;
  .pager {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
