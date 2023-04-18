<template>
  <div class="life-list-container">
    <div class="life-list-item" v-for="item in lifeList" :key="item.id">
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
          <div class="time">{{ formatDateFromNow(item.createDate) }}</div>
          <a-popover trigger="click" placement="left" v-model:visible="visible">
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
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue';

import { useUserStore } from '@/stores/user';
import Comment from '@/components/Comment/index.vue';
import CommentList from '@/components/Comment/List.vue';
import { getLifeByPage } from '@/api/life';
import { toggleLike } from '@/api/like';
import { formatDateFromNow } from '@/utils/tools';
import { addComment } from '@/api/comment';

const props = defineProps({
  userid: {
    type: Number,
  },
});
const route = useRoute();
const userStore = useUserStore();
const lifeList = ref([]);
const total = ref(0);
const showPager = ref(true);
const currentCommentLife = ref(null);
const visible = ref(false);

const handleShowCommentInput = (life) => {
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

const lifeListWithCommentInput = computed(() => {
  lifeList.value.map((item) => ({
    ...item,
    showCommentInput: false,
  }));
});

// 获取动态列表数据
const fetchLifeByPage = async () => {
  const result = await getLifeByPage({
    ...pageInfo.value,
    userid: props.userid,
  });
  lifeList.value = result.lifeList;
  total.value = result.total;
  showPager.value = total.value / 10 > 1;
  // 获取当前用户已点赞的动态id
};

watchEffect(fetchLifeByPage);

// 用户点赞
const likeClick = async (life) => {
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
</style>
