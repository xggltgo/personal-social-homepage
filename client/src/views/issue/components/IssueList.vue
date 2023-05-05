<template>
  <div class="issue-list-container">
    <div class="issue-list-item" v-for="item in issueList" :key="item.id">
      <div class="left">
        <div
          class="answerCount"
          :class="{ zeroCount: item.commentCount === 0 }"
        >
          <div class="count">{{ item.commentCount }}</div>
          <div class="text">回答</div>
        </div>
        <div class="scanCount">
          <div class="count">{{ item.scanCount }}</div>
          <div class="text">阅读</div>
        </div>
      </div>
      <div class="right">
        <router-link
          :to="{
            name: 'issueDetail',
            params: {
              issueid: item.id,
            },
          }"
          class="issueTitle"
        >
          <span class="isAdmin" v-if="item.user?.isAdmin">
            <a-tag color="#43b3f3">官方</a-tag> </span
          >{{ item.title }}
        </router-link>
        <div class="info">
          <a-popover trigger="click" placement="bottom">
            <template #content>
              <div class="edit" @click="showModal(item.id)">编辑</div>
              <div class="delete" @click="handleDelete(item.id)">删除</div>
            </template>
            <div
              class="more item"
              v-if="userStore.userInfo?.id === item.user?.id"
            >
              <EllipsisOutlined />
            </div>
          </a-popover>
          <div class="right-info">
            <router-link
              :to="{
                name: 'user',
                params: {
                  userid: item.user?.id,
                },
              }"
              class="author"
              >{{ item.user?.nickname }}</router-link
            >
            <div class="time">
              &nbsp;·&nbsp;{{ formatDateFromNow(item.createDate) }}提问
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-empty
      description="暂无对应内容"
      :image="simpleImage"
      v-if="issueList.length === 0"
    />
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

  <!-- 编辑问答 -->
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
import { ref, computed, watchEffect, createVNode } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal, Empty } from 'ant-design-vue';
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';

import { getIssueByPage, deleteIssue } from '@/api/issue';
import { formatDateFromNow } from '@/utils/tools';
import { useUserStore } from '@/stores/user';
import IssueModal from '@/components/IssueModal/index.vue';

const props = defineProps({
  userid: {
    type: Number,
  },
  searchText: {
    type: String,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});
const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
const issueList = ref([]);
const total = ref(0);
const showPager = ref(true);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const pageInfo = computed(() => ({
  page: +route.query.page || 1,
  limit: +route.query.limit || 10,
  categoryid: +route.params.categoryid || -1,
}));

const handlePageChange = (page) => {
  router.push({
    name: route.name,
    query: {
      ...route.query,
      page,
      limit: 10,
    },
  });
};

// 获取问答列表数据
const fetchIssueByPage = async () => {
  const result = await getIssueByPage({
    ...pageInfo.value,
    userid: props.userid,
    keyword: props.searchText,
    liked: props.liked,
  });
  issueList.value = result.issueList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};
watchEffect(fetchIssueByPage);

const visible = ref(false);
const handleOk = (e) => {
  visible.value = false;
};
const hideToolModal = () => {
  visible.value = false;
};
const issueid = ref(null);
const showModal = (id) => {
  issueid.value = id;
  visible.value = true;
};

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
      if (issueList.value.length === 1) {
        if (pageInfo.value.page === 1) {
          await fetchIssueByPage();
          return;
        } else {
          router.push({
            name: route.name,
            query: {
              page: route.query.page - 1,
              limit: 10,
            },
          });
        }
      }
      await fetchIssueByPage();
    },
    class: 'test',
  });
};
</script>

<style lang="less">
.issue-list-container {
  height: 100%;
}

.issue-list-item {
  height: 90px;
  color: #212529;
  background-color: #fff;
  padding: 16px;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);
  display: flex;
  color: #8a919f;
  .left {
    display: flex;
    margin-right: 24px;
    flex-shrink: 0;
    .answerCount,
    .scanCount {
      text-align: center;
      padding: 5px;
      min-width: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .answerCount {
      color: #6bc8ff;
      border: 1px solid #6bc8ff;
      border-radius: 4px;
      &.zeroCount {
        color: #8a919f;
        border: none;
      }
    }

    .scanCount {
      color: #e88080;
    }
  }
  .right {
    flex-grow: 1;
    .issueTitle {
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
      font-size: 15px;
      line-height: 30px;
      width: 100%;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      .isAdmin {
        font-size: 12px;
        vertical-align: 1px;
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .more {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          background: #e5e6eb;
        }
      }
      .right-info {
        display: flex;
      }
      .author {
        color: #6bc8ff;
      }
    }
  }
}

.pager {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.ant-empty {
  margin: 0;
  padding: 32px 0;
}

.edit,
.delete {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #1e80ff;
  }
}
</style>
