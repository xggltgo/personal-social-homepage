<template>
  <div class="essay-list-container">
    <div class="list-item" v-for="item in essayList" :key="item.id">
      <div class="info">
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
        <div class="createDate">{{ formatDateFromNow(item.createDate) }}</div>
        <router-link
          :to="{
            name: 'essayCategory',
            params: {
              categoryid: item.category?.id,
            },
          }"
          class="category"
          >{{ item.category?.name }}</router-link
        >
      </div>
      <div class="content">
        <div class="left">
          <router-link
            :to="{
              name: 'essayDetail',
              params: {
                essayid: item.id,
              },
            }"
            class="title"
          >
            {{ item.title }}
          </router-link>
          <div class="desc">
            {{ item.description }}
          </div>
          <div class="data">
            <div class="scan item">
              <EyeOutlined />
              <span class="count">{{ item.scanCount }}</span>
            </div>
            <div class="like item">
              <LikeOutlined />
              <span class="count">{{ item.likeCount }}</span>
            </div>
            <div class="comment item">
              <MessageOutlined />
              <span class="count">{{ item.commentCount }}</span>
            </div>
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
          </div>
        </div>
        <div class="right" v-if="item.cover">
          <img :src="item.cover" alt="" />
        </div>
      </div>
    </div>
    <a-empty
      description="暂无对应内容"
      :image="simpleImage"
      v-if="essayList.length === 0"
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

  <!-- 编辑文章 -->
  <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    :footer="null"
    width="100%"
    wrap-class-name="full-modal"
  >
    <EssayModal @closeToolModal="hideToolModal" :essayid="essayid" />
  </a-modal>
</template>

<script setup>
import { ref, computed, watchEffect, createVNode } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Empty, Modal } from 'ant-design-vue';
import {
  LikeOutlined,
  EyeOutlined,
  MessageOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';

import { getEssayByPage, deleteEssay } from '@/api/essay';
import { formatDateFromNow } from '@/utils/tools';
import eventBus from '@/eventBus';
import EssayModal from '@/components/EssayModal/index.vue';

const props = defineProps({
  userid: {
    type: Number,
  },
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const essayList = ref([]);
const visible = ref(false);
const showPager = ref(true);
const total = ref(0);
const essayid = ref(null);

const handleOk = (e) => {
  visible.value = false;
};

const hideToolModal = () => {
  visible.value = false;
};

const showModal = (id) => {
  essayid.value = id;
  visible.value = true;
};

const pageInfo = computed(() => ({
  page: +route.query.page || 1,
  limit: +route.query.limit || 10,
  categoryid: +route.params.categoryid || -1,
}));

// 获取文章列表数据
const fetchEssayByPage = async () => {
  const result = await getEssayByPage({
    ...pageInfo.value,
    userid: props.userid,
  });
  essayList.value = result.essayList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};

watchEffect(fetchEssayByPage);

const handlePageChange = (page) => {
  router.push({
    name: route.name,
    query: {
      page,
      limit: 10,
    },
  });
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
      if (essayList.value.length === 1) {
        if (pageInfo.value.page === 1) {
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
      eventBus.$emit('update');
      await fetchEssayByPage();
    },
    class: 'test',
  });
};
</script>

<style lang="less" scoped>
.essay-list-container {
  height: 100%;
}

.list-item {
  height: 139px;
  padding: 12px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info {
  display: flex;
  align-items: center;
  font-size: 13px;
  height: 22px;
  line-height: 22px;
  column-gap: 12px;
  color: #8a919f;
  .author {
    color: #515767;
    &:hover {
      color: #6bc8ff;
    }
  }
  .createDate {
    padding: 0 12px;
    position: relative;
    &::before {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 1px;
      height: 12px;
      background: #e5e6eb;
      left: 0;
      content: ' ';
    }
    &::after {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      display: block;
      width: 1px;
      height: 12px;
      background: #e5e6eb;
      content: ' ';
    }
  }
}

.content {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);
  display: flex;
  .left {
    flex: 1 1 auto;
    .title {
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #252933;
      width: 100%;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .desc {
      margin-bottom: 8px;
      color: #8a919f;
      font-size: 13px;
      line-height: 22px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .data {
      display: flex;
      align-items: center;
      .item {
        position: relative;
        margin-right: 20px;
        font-size: 13px;
        line-height: 20px;
        color: #8a919f;
        flex-shrink: 0;
        .count {
          margin-left: 4px;
        }
      }
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
    }
  }
  .right {
    flex: 0 0 auto;
    width: 120px;
    height: 80px;
    margin-left: 24px;
    background-color: #fff;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}

.pager {
  display: flex;
  justify-content: center;
  padding: 15px 0 30px 0;
  margin: 24px 0;
}

.ant-empty {
  margin: 0;
  padding: 32px 0;
}

.ant-popover-inner-content {
  padding: 0;
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
