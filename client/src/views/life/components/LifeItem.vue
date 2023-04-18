<template>
  <div class="life-item-container">
    <div class="avatar">
      <a-image
        :width="39"
        :height="39"
        :preview="false"
        :src="userStore.userInfo?.avatar"
      />
    </div>
    <div class="right-info">
      <div class="user">陈心彤</div>
      <div class="text">欢迎回家</div>
      <div class="images">
        <a-image
          :width="150"
          :height="150"
          v-for="item in 9"
          :src="userStore.userInfo?.avatar"
        />
      </div>
      <div class="tip">
        <div class="time">48分钟前</div>
        <a-popover trigger="click" placement="left">
          <template #content>
            <div class="life-like-comment">
              <div class="life-like-btn item">
                <HeartOutlined />
                赞
              </div>
              <div
                class="life-comment-btn item"
                @click="showCommentInput = !showCommentInput"
              >
                <MessageOutlined />
                {{ showCommentInput ? '收起评论' : ' 评论' }}
              </div>
            </div>
          </template>
          <div class="life-btn">
            <EllipsisOutlined />
          </div>
        </a-popover>
      </div>
      <div class="like">
        <div class="icon">
          <HeartOutlined :style="{ color: '#1e80ff' }" />
        </div>
        <div class="users">
          <a-image
            :width="30"
            :height="30"
            v-for="item in 10"
            :preview="false"
            :src="userStore.userInfo?.avatar"
          />
          等93人觉得很赞
        </div>
      </div>
      <div class="comment-wrapper">
        <div class="send-comment" v-show="showCommentInput">
          <Comment />
        </div>
        <div class="comment-list">
          <!-- <CommentList /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import Comment from '@/components/Comment/index.vue';
import CommentList from '@/components/Comment/List.vue';
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue';

defineProps({
  lifeInfo: {
    type: Object,
    required: true,
  },
});

const showCommentInput = ref(false);
const userStore = useUserStore();
</script>

<style lang="less">
.life-item-container {
  width: 100%;
  padding: 30px;
  background: #fff;
  display: flex;
  align-items: flex-start;
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
