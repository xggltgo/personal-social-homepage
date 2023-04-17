<template>
  <div class="message-container">
    <div class="barrage">
      <vue-danmaku
        v-model:danmus="danmus.danmus"
        :useSlot="danmus.useSlot"
        :speeds="danmus.speeds"
        :randomChannel="danmus.randomChannel"
        :loop="danmus.loop"
        style="height: 100%; width: 100%"
        ref="danmakuRef"
      >
        <template v-slot:dm="{ index, danmu }">
          <div
            class="barrage-item"
            :style="{
              color:
                danmu.user.id === userStore.userInfo?.id
                  ? getRandomColor()
                  : '#fff',
            }"
          >
            <img :src="danmu.user?.avatar" alt="" />
            <div class="nickname">{{ danmu.user?.nickname }}：</div>
            <span class="content">{{ danmu.content }}</span>
          </div>
        </template>
      </vue-danmaku>
    </div>
    <div class="send">
      <Comment titleText="留言" @send="sendMessage" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import vueDanmaku from 'vue3-danmaku';
import { getAllMessages, addMessage } from '@/api/message';
import { getRandomColor } from '@/utils/tools';
import Comment from '@/components/Comment/index.vue';

const userStore = useUserStore();

const danmus = reactive({
  danmus: [],
  autoplay: true,
  useSlot: true,
  loop: true,
  speeds: 200,
  debounce: 100, // 多长时间插入一条弹幕
  randomChannel: true, // 弹幕（轨道）位置随机
});

const danmakuRef = ref(null);

const setMessage = (id,avatar, nickname, content) => {
  danmakuRef.value.add({
    user: {
      id,
      avatar,
      nickname,
    },
    content,
  });
};

// 获取所有留言
(async () => {
  const result = await getAllMessages();
  danmus.danmus = result.messageList;
})();

// 发送一条留言
const sendMessage = async (content, callback) => {
  const data = {
    content,
    userid: userStore.userInfo?.id,
  };
  setMessage(userStore.userInfo?.id,userStore.userInfo?.avatar, userStore.userInfo?.nickname, content);
  await addMessage(data);
  callback('留言成功！我们将会在1个工作日日内查看。');
};
</script>

<style lang="less" scoped>
.barrage {
  width: 100%;
  height: 500px;
  background: linear-gradient(45deg, #293144, #1a2138);
  border-radius: 8px;
  user-select: none;

  .barrage-item {
    height: 35px;
    display: flex;
    align-items: center;
    img {
      width: 39px;
      height: 39px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
    .nickname {
      font-size: 18px;
      font-weight: 600;
    }
    .content {
      font-size: 18px;
    }
  }
}

.send {
  margin-top: 20px;
  border-radius: 4px;
  background-color: #fff;
  padding: 24px 32px;
}
</style>
