<template>
  <div class="essay-list-container">
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
          <a-popover>
            <template #content>
              <div class="essay-popover-wrapper" v-if="record.cover">
                <div class="text">文章预览图</div>
                <div class="image">
                  <img :src="record.cover" alt="record.title" />
                </div>
              </div>
              <a-empty v-else description="暂无预览图"></a-empty>
            </template>
            <a
              :href="`http://127.0.0.1:5173/essay/detail/${record.id}`"
              style="text-decoration: underline"
              >{{ record.title }}</a
            >
          </a-popover>
        </template>
        <template v-else-if="column.key === 'createDate'">
          {{ formatLocaleTime(record.createDate) }}
        </template>
        <template v-else-if="column.key === 'category'">
          {{ record.category ? record.category.name : '未分类' }}
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

  <!-- 编辑文章 -->
  <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    :footer="null"
    width="100%"
    wrap-class-name="full-modal"
  >
    <EssayModal
      @closeToolModal="hideToolModal"
      :essayid="essayid"
      :key="essayid"
    />
  </a-modal>
</template>

<script setup>
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { ref, reactive, createVNode } from 'vue';
import { Modal, message } from 'ant-design-vue';

import { getEssayByPage, deleteEssay } from '@/api/essay';
import { useUserStore } from '@/stores/user';
import { formatLocaleTime } from '@/utils/tools';
import EssayModal from '@/components/EssayModal/index.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '文章描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '所属分类',
    dataIndex: 'category',
    key: 'category',
    width: 150,
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
const showPager = ref(true);
const pageInfo = reactive({
  page: 1,
  limit: 10,
});
const total = ref(0);

// 获取文章列表数据
const fetchEssayByPage = async () => {
  const result = await getEssayByPage({
    ...pageInfo,
    userid: userStore.userInfo.id,
  });
  console.log(result);
  data.value = result.essayList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};
fetchEssayByPage();

const handlePageChange = (page) => {
  pageInfo.page = page;
  fetchEssayByPage();
};

// 删除文章
const handleDelete = (essayid) => {
  Modal.confirm({
    title: '确定删除这篇文章吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      {
        style: 'color:red;',
      },
      '文章一旦删除，不能恢复'
    ),
    cancelText: '取消',
    okText: '确定',
    async onOk() {
      // 更新仓库数据
      userStore.userInfo.selfEssayCount -= 1;
      await deleteEssay(essayid);
      if (data.value.length === 1) {
        if (pageInfo.page === 1) {
          await fetchEssayByPage();
          return;
        } else {
          pageInfo.page -= 1;
        }
      }
      await fetchEssayByPage();
    },
    class: 'test',
  });
};

const visible = ref(false);
const essayid = ref(null);
const handleOk = (e) => {
  visible.value = false;
};
const hideToolModal = async () => {
  await fetchEssayByPage();
  visible.value = false;
  message.success('文章修改成功！');
};
const showModal = (id) => {
  essayid.value = id;
  visible.value = true;
};
</script>

<style lang="less">
.essay-list-container {
  padding: 30px;
  .pager {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}

.essay-popover-wrapper {
  .image {
    width: 240px;
    height: 160px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}
</style>
