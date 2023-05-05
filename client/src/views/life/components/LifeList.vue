<template>
  <div class="life-list-container">
    <div
      class="life-list-item"
      v-for="item in lifeListWithCommentInput"
      :key="item.id"
      v-if="lifeListWithCommentInput.length > 0"
    >
      <div class="avatar">
        <a-image
          :width="39"
          :height="39"
          :preview="false"
          :src="item.user.avatar"
        />
      </div>
      <div class="right-info">
        <div class="user">{{ item.user.nickname }}</div>
        <div class="text">{{ item.content }}</div>
        <div class="images">
          <a-image
            :width="150"
            :height="150"
            v-for="src in item.images"
            :src="src"
            :key="item"
          />
        </div>
        <div class="tip">
          <div class="time">
            {{ formatDateFromNow(item.createDate) }}
            <span
              class="delete"
              v-if="userStore.userInfo?.id === item.user.id"
              @click="handleDelete(item.id)"
              >删除</span
            >
            <span
              class="edit"
              v-if="userStore.userInfo?.id === item.user.id"
              @click="handleEdit(item.id)"
              >编辑</span
            >
          </div>

          <a-popover
            trigger="click"
            placement="left"
            v-model:visible="item.visible"
          >
            <template #content>
              <div class="life-like-comment">
                <div class="life-like-btn item" @click="likeClick(item)">
                  <HeartOutlined />
                  {{
                    item.lifeLike.find(
                      (item) => item.user.id === userStore.userInfo?.id
                    )
                      ? '取消点赞'
                      : '赞'
                  }}
                </div>
                <div
                  class="life-comment-btn item"
                  @click="handleShowCommentInput(item)"
                >
                  <MessageOutlined />
                  {{ item.showCommentInput ? '收起评论' : ' 评论' }}
                </div>
              </div>
            </template>
            <div class="life-btn">
              <EllipsisOutlined />
            </div>
          </a-popover>
        </div>
        <div class="like" v-if="item.lifeLike.length > 0">
          <div
            class="icon"
            :style="{
              color: item.lifeLike.find(
                (item) => item.user.id === userStore.userInfo?.id
              )
                ? '#1e80ff'
                : 'rgb(81,87,103)',
            }"
          >
            <HeartOutlined />
          </div>
          <div class="users">
            <a-image
              :width="30"
              :height="30"
              v-for="it in item.lifeLike"
              :preview="false"
              :src="it.user.avatar"
            />
            <template v-if="item.lifeLike.length > 10">
              等{{ item.lifeLike.length }}人觉得很赞
            </template>
          </div>
        </div>
        <div class="comment-wrapper">
          <div class="send-comment" v-show="item.showCommentInput">
            <Comment @send="sendComment" />
          </div>
          <div class="comment-list" v-if="item.lifeComment.length > 0">
            <CommentList :commentList="item.lifeComment" />
          </div>
        </div>
      </div>
    </div>
    <a-empty
      description="暂无对应内容"
      :image="simpleImage"
      v-if="lifeListWithCommentInput.length === 0"
    />
    <div class="pager" v-if="showPager">
      <a-pagination
        v-model:current="pageInfo.page"
        :total="total"
        show-less-items
        @change="handlePageChange"
        :hideOnSinglePage="true"
        :defaultPageSize="10"
      />
    </div>

    <!-- 编辑动态 -->
    <a-modal
      v-model:visible="modalVisible"
      @ok="handleOk"
      :footer="null"
      width="100%"
      wrap-class-name="full-modal"
    >
      <LifeModal
        @closeToolModal="hideToolModal"
        :lifeid="lifeid"
        :key="lifeid"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, createVNode } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, Modal, Empty } from 'ant-design-vue';
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';

import { useUserStore } from '@/stores/user';
import Comment from '@/components/Comment/index.vue';
import CommentList from '@/components/Comment/List.vue';
import { getLifeByPage, deleteLife } from '@/api/life';
import { toggleLike } from '@/api/like';
import { formatDateFromNow } from '@/utils/tools';
import { addComment } from '@/api/comment';
import LifeModal from '@/components/LifeModal/index.vue';

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
const router = useRouter();
const userStore = useUserStore();
const lifeList = ref([]);
const total = ref(0);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const showPager = ref(true);
const currentCommentLife = ref(null);
const modalVisible = ref(false);
const lifeid = ref(null);

const handleShowCommentInput = (life) => {
  life.visible = false;
  if (life.showCommentInput) {
    currentCommentLife.value = null;
  } else {
    currentCommentLife.value = life;
  }
  life.showCommentInput = !life.showCommentInput;
};

const pageInfo = computed(() => ({
  page: +route.query.page || 1,
  limit: +route.query.limit || 10,
}));

const handleOk = (e) => {
  modalVisible.value = false;
};

const hideToolModal = () => {
  modalVisible.value = false;
};

const lifeListWithCommentInput = computed(() => {
  lifeList.value.forEach((item) => {
    item.showCommentInput = false;
    item.visible = false;
  });
  return lifeList.value;
});

// 获取动态列表数据
const fetchLifeByPage = async () => {
  const result = await getLifeByPage({
    ...pageInfo.value,
    userid: props.userid,
    keyword: props.searchText,
    liked: props.liked,
  });
  lifeList.value = result.lifeList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
};
watchEffect(fetchLifeByPage);

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

// 用户点赞
const likeClick = async (life) => {
  life.visible = false;
  if (!userStore.userInfo) {
    // 提示用户登录
    message.error('请先登录!');
    return;
  }
  const result = await toggleLike({
    userid: userStore.userInfo.id,
    lifeid: life.id,
  });
  if (result) {
    // 用户点赞
    life.lifeLike.push({
      user: userStore.userInfo,
    });
  } else {
    // 用户取消点赞
    const index = life.lifeLike.findIndex(
      (item) => item.user.id === userStore.userInfo.id
    );
    life.lifeLike.splice(index, 1);
  }
};

// 新增一条评论
const sendComment = async (content, callback) => {
  const data = {
    content,
    userid: userStore.userInfo?.id,
    lifeid: currentCommentLife.value.id,
  };
  // 组装一条评论 添加到本地 commentList
  currentCommentLife.value.lifeComment.push({
    user: {
      id: userStore.userInfo?.id,
      nickname: userStore.userInfo?.nickname,
      avatar: userStore.userInfo?.avatar,
    },
    content,
    createDate: Date.now(),
  });
  await addComment(data);
  currentCommentLife.value.showCommentInput = false;
  callback('评论成功！');
};

// 删除动态
const handleDelete = (lifeid) => {
  Modal.confirm({
    title: '确定删除这条动态吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      {
        style: 'color:red;',
      },
      '动态一旦删除，不能恢复'
    ),
    cancelText: '取消',
    okText: '确定',
    async onOk() {
      // 更新仓库数据
      userStore.userInfo.selfLifeCount -= 1;
      await deleteLife(lifeid);
      if (lifeList.value.length === 1) {
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
      await fetchLifeByPage();
    },
    class: 'test',
  });
};

// 编辑动态
const handleEdit = (id) => {
  lifeid.value = id;
  modalVisible.value = true;
};
</script>

<style lang="less">
.life-list-container {
  width: 100%;
  .life-list-item {
    width: 100%;
    padding: 30px 30px 0;
    background: #fff;
    display: flex;
    align-items: flex-start;
    &:last-child {
      padding-bottom: 30px;
    }
    .avatar {
      flex-shrink: 0;
    }
    .right-info {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 13px;
      row-gap: 10px;
      border-bottom: 1px solid rgba(228, 230, 235, 0.5);
      .user {
        color: #6bc8ff;
        //   &:hover {
        //   }
      }
      .images {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        justify-content: flex-start;
      }
      .tip {
        margin-top: 5px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .time {
          font-size: 12px;
          .delete,
          .edit {
            margin-left: 15px;
            color: #6bc8ff;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .like {
        width: 100%;
        background: #f7f7f7;
        padding: 10px 15px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        .icon {
          flex-shrink: 0;
          margin-right: 15px;
        }
        .users {
          flex-grow: 1;
          display: flex;
          align-items: center;
          column-gap: 5px;
          color: #8a919f;
        }
      }
      .comment-wrapper {
        width: 100%;
      }
    }
  }
}

.ant-image {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.life-btn {
  cursor: pointer;
  padding: 0 3px;
  background: #f7f7f7;
  &:hover {
    background: #dedede;
  }
}

.life-like-comment {
  display: flex;
  .item {
    cursor: pointer;
    width: 80px;
    text-align: center;
    &:hover {
      color: #6bc8ff;
    }
  }
}

.pager {
  display: flex;
  justify-content: center;
  padding: 30px 0;
  background: #fff;
}

.ant-empty {
  margin: 0;
  padding: 32px 0;
}
</style>
