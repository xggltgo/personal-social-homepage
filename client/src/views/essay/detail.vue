<template>
  <div class="essay-detail-container">
    <div class="count-wrapper">
      <a-badge
        :count="essayInfo.likeCount"
        :offset="[-5, 5]"
        :color="liked ? '#1e80ff' : '#c2c8d1'"
      >
        <div
          class="count-item"
          :class="liked ? 'liked' : ''"
          @click="likeClick"
        >
          <LikeOutlined />
        </div>
      </a-badge>
      <a-badge
        :count="essayInfo.commentCount"
        color="#c2c8d1"
        :offset="[-5, 5]"
      >
        <a class="count-item" href="#comment">
          <MessageOutlined />
        </a>
      </a-badge>
    </div>
    <div class="main">
      <div class="essay">
        <h1 class="essay-title">{{ essayInfo.title }}</h1>
        <div class="user-info">
          <a-avatar :size="40" :src="essayInfo.user?.avatar"></a-avatar>
          <div class="right-info">
            <router-link
              :to="{
                name: 'user',
                params: {
                  userid: essayInfo.user?.id,
                },
              }"
              class="nickname"
              >{{ essayInfo.user?.nickname }}</router-link
            >
            <div class="time-scan">
              <div class="time">
                {{ formatLocaleTime(essayInfo.createDate) }}
              </div>
              <div class="scan">· 阅读&nbsp;{{ essayInfo.scanCount }}</div>
            </div>
          </div>
        </div>
        <div class="essay-cover">
          <img :src="essayInfo.cover" alt="" />
        </div>
        <div class="essay-desc">
          {{ essayInfo.description }}
        </div>
        <div
          class="essay-content markdown-body prettyprint"
          v-html="essayInfo.content"
        ></div>
      </div>
      <div class="comment" id="comment">
        <Comment @send="sendComment" />
        <a-empty
          description="暂无对应内容"
          :image="simpleImage"
          v-if="commentList.length === 0"
        />
        <CommentList :commentList="commentList" v-else />
      </div>
    </div>
    <div class="aside"></div>
  </div>
</template>

<script setup>
import 'github-markdown-css';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Empty } from 'ant-design-vue';
import { getEssay } from '@/api/essay';
import { getCommentByPage, addComment } from '@/api/comment';
import { toggleLike, likeExist } from '@/api/like';
import { formatLocaleTime } from '@/utils/tools';
import { useUserStore } from '@/stores/user';
import Comment from '@/components/Comment/index.vue';
import CommentList from '@/components/Comment/List.vue';

const route = useRoute();
const userStore = useUserStore();
const essayInfo = ref({});
const liked = ref(false);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
// 获取文章信息
(async () => {
  const result = await getEssay(route.params.essayid);
  essayInfo.value = result;
})();

// 获取文章对应的评论
const commentList = ref([]);
(async () => {
  const result = await getCommentByPage({
    essayid: route.params.essayid,
  });
  commentList.value = result.commentList;
})();

// 新增一条评论
const sendComment = async (content, callback) => {
  const data = {
    content,
    userid: userStore.userInfo?.id,
    essayid: route.params.essayid,
  };
  // 组装一条评论 添加到本地 commentList
  commentList.value.push({
    user: {
      id: userStore.userInfo?.id,
      nickname: userStore.userInfo?.nickname,
      avatar: userStore.userInfo?.avatar,
    },
    content,
    createDate: Date.now(),
  });
  // 更新本地 commentCount
  essayInfo.value.commentCount += 1;
  await addComment(data);
  callback('评论成功！');
};

// 用户点赞
const likeClick = async () => {
  const result = await toggleLike({
    userid: userStore.userInfo?.id,
    essayid: route.params.essayid,
  });
  if (result) {
    essayInfo.value.likeCount += 1;
    liked.value = true;
  } else {
    essayInfo.value.likeCount -= 1;
    liked.value = false;
  }
};

// 进入页面需要判断用户是否已赞过该文章
(async () => {
  const result = await likeExist({
    userid: userStore.userInfo?.id,
    essayid: route.params.essayid,
  });
  if (result) {
    liked.value = true;
  } else {
    liked.value = false;
  }
})();
</script>

<style lang="less" scoped>
.essay-detail-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
  // scroll-behavior: smooth;
}

.count-wrapper {
  position: fixed;
  margin-left: -5%;
  top: 140px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  .count-item {
    color: #8a919f;
    margin-bottom: 20px;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    cursor: pointer;
    text-align: center;
    font-size: 20px;
    &:hover {
      color: #515767;
    }
    &.liked {
      color: #1e80ff;
    }
  }
}

.main {
  width: calc(100% - 320px);
  flex-grow: 1;
  .essay {
    background: #fff;
    border-radius: 4px;
    padding: 32px;
    .essay-title {
      margin-bottom: 20px;
      font-size: 32px;
      font-weight: 600;
      line-height: 1.31;
      color: #252933;
    }
    .user-info {
      display: flex;
      align-items: center;
      .right-info {
        margin-left: 12px;
        font-size: 16px;
        .time-scan {
          display: flex;
          font-size: 14px;
          color: #8a919f;
          margin-top: 2px;
          line-height: 22px;
          .scan {
            margin-left: 10px;
          }
        }
      }
    }
    .essay-cover {
      width: 100%;
      img {
        width: 100%;
        object-fit: cover;
        margin-top: 24px;
      }
    }
    .essay-desc {
      margin: 24px 0;
      font-size: 16px;
    }
  }
  .comment {
    margin-top: 20px;
    border-radius: 4px;
    background-color: #fff;
    padding: 24px 32px;
  }
}

.aside {
  flex-shrink: 0;
  width: 300px;
  background: #fff;
  margin-left: 20px;
}
</style>
