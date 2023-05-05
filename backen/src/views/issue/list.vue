<template>
  <div class="issue-list-container">
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
        <template v-else-if="column.key === 'title'">
          <a
            :href="`http://127.0.0.1:5173/issue/detail/${record.id}`"
            style="text-decoration: underline"
            >{{ record.title }}</a
          >
        </template>
        <template v-else-if="column.key === 'createDate'">
          {{ formatLocaleTime(record.createDate) }}
        </template>
        <template v-else-if="column.key === 'more'">
          <a-tooltip>
            <template #title>编辑</template>
            <a-button
              type="primary"
              shape="circle"
              @click="showModal(record.id)"
            >
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-tooltip>
          <span class="space" style="margin: 0 5px"></span>
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

  <!-- 编辑问答-->
  <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    :footer="null"
    width="100%"
    wrap-class-name="full-modal"
  >
    <IssueModal
      @closeToolModal="hideToolModal"
      :issueid="issueid"
      :key="issueid"
    />
  </a-modal>
</template>

<script setup>
import { ref, reactive, createVNode } from 'vue';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';

import { getIssueByPage, deleteIssue } from '@/api/issue';
import { useUserStore } from '@/stores/user';
import { formatLocaleTime } from '@/utils/tools';
import IssueModal from '@/components/IssueModal/index.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '问答标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '浏览量',
    dataIndex: 'scanCount',
    key: 'scanCount',
    width: 80,
  },
  {
    title: '评论量',
    dataIndex: 'commentCount',
    key: 'commentCount',
    width: 80,
  },
  {
    title: '点赞量',
    dataIndex: 'likeCount',
    key: 'likeCount',
    width: 80,
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

const userStore = useUserStore();

//分页处理
const pageInfo = reactive({
  page: 1,
  limit: 10,
});
const total = ref(0);
const showPager = ref(true);
const handlePageChange = (page) => {
  pageInfo.page = page;
  fetchIssueByPage();
};

// 获取问答列表数据
const fetchIssueByPage = async () => {
  const result = await getIssueByPage({
    ...pageInfo,
    userid: userStore.userInfo.id,
  });
  console.log(result);
  data.value = result.issueList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};
fetchIssueByPage();

// 删除问答
const handleDelete = (issueid) => {
  Modal.confirm({
    title: '确定删除这篇问答吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      {
        style: 'color:red;',
      },
      '问答一旦删除，不能恢复'
    ),
    cancelText: '取消',
    okText: '确定',
    async onOk() {
      // 更新仓库数据
      userStore.userInfo.selfIssueCount -= 1;
      await deleteIssue(issueid);
      if (data.value.length === 1) {
        if (pageInfo.page === 1) {
          await fetchIssueByPage();
          return;
        } else {
          pageInfo.page -= 1;
        }
      }
      await fetchIssueByPage();
    },
    class: 'test',
  });
};

// modal处理
const visible = ref(false);
const issueid = ref(null);
const handleOk = (e) => {
  visible.value = false;
};
const hideToolModal = async () => {
  await fetchIssueByPage();
  visible.value = false;
  message.success('问答修改成功！');
};
const showModal = (id) => {
  issueid.value = id;
  visible.value = true;
};
</script>

<style lang="less" scoped>
.issue-list-container {
  padding: 30px;
  .pager {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
