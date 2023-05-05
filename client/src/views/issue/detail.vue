<template>
  <div class="issue-detail-container" v-if="issueInfo">
    <div class="count-wrapper">
      <a-badge
        :count="issueInfo.likeCount"
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
        :count="issueInfo.commentCount"
        color="#c2c8d1"
        :offset="[-5, 5]"
      >
        <a class="count-item" href="#comment">
          <MessageOutlined />
        </a>
      </a-badge>
    </div>
    <div class="main">
      <div class="issue">
        <h1 class="issue-title">{{ issueInfo.title }}</h1>
        <div class="user-info">
          <a-avatar :size="40" :src="issueInfo.user?.avatar"></a-avatar>
          <div class="right-info">
            <router-link
              :to="{
                name: 'user',
                params: {
                  userid: issueInfo.user?.id,
                },
              }"
              class="nickname"
              >{{ issueInfo.user?.nickname }}</router-link
            >
            <div class="time-scan">
              <div class="time">
                {{ formatLocaleTime(issueInfo.createDate) }}
              </div>
              <div class="scan">· 阅读&nbsp;{{ issueInfo.scanCount }}</div>
            </div>
          </div>
        </div>
        <div class="issue-cover">
          <img :src="issueInfo.cover" alt="" />
        </div>
        <div class="issue-desc">
          {{ issueInfo.description }}
        </div>
        <div
          class="issue-content markdown-body prettyprint"
          v-html="issueInfo.content"
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
import { getIssue } from '@/api/issue';
import { getCommentByPage, addComment } from '@/api/comment';
import { toggleLike, likeExist } from '@/api/like';
import { formatLocaleTime } from '@/utils/tools';
import { useUserStore } from '@/stores/user';
import Comment from '@/components/Comment/index.vue';
import CommentList from '@/components/Comment/List.vue';

const route = useRoute();
const userStore = useUserStore();
const issueInfo = ref(null);
const liked = ref(false);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
// 获取问答信息
(async () => {
  const result = await getIssue(route.params.issueid);
  issueInfo.value = result;
})();

// 获取问答对应的评论
const commentList = ref([]);
(async () => {
  const result = await getCommentByPage({
    issueid: route.params.issueid,
  });
  commentList.value = result.commentList;
})();

// 新增一条评论
const sendComment = async (content, callback) => {
  const data = {
    content,
    userid: userStore.userInfo?.id,
    issueid: route.params.issueid,
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
  issueInfo.value.commentCount += 1;
  await addComment(data);
  callback('评论成功！');
};

// 用户点赞
const likeClick = async () => {
  const result = await toggleLike({
    userid: userStore.userInfo?.id,
    issueid: route.params.issueid,
  });
  if (result) {
    issueInfo.value.likeCount += 1;
    liked.value = true;
  } else {
    issueInfo.value.likeCount -= 1;
    liked.value = false;
  }
};

// 进入页面需要判断用户是否已赞过该问答
(async () => {
  const result = await likeExist({
    userid: userStore.userInfo?.id,
    issueid: route.params.issueid,
  });
  if (result) {
    liked.value = true;
  } else {
    liked.value = false;
  }
})();
</script>

<style lang="less" scoped>
.issue-detail-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
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
  .issue {
    background: #fff;
    border-radius: 4px;
    padding: 32px;
    .issue-title {
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
    .issue-cover {
      width: 100%;
      img {
        width: 100%;
        object-fit: cover;
        margin-top: 24px;
      }
    }
    .issue-desc {
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
