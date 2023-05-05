<template>
  <div class="conment-container">
    <div class="title">{{ titleText }}</div>
    <div class="content">
      <a-avatar :size="45" :src="userStore.userInfo?.avatar">未登录</a-avatar>
      <div class="inp">
        <a-textarea
          v-model:value="messageText"
          :placeholder="`输入${titleText}`"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          show-count
          :maxlength="100"
          allow-clear
        />
      </div>
    </div>
    <div class="btn">
      <a-button
        type="primary"
        @click="sendData"
        :loading="isLoading"
        :disabled="userStore.userInfo === null"
        >{{ userStore.userInfo ? `发表${titleText}` : '请先登录' }}</a-button
      >
    </div>
    <div class="tips"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  titleText: {
    type: String,
    default: '评论',
  },
});

const emit = defineEmits(['send']);

const userStore = useUserStore();
const messageText = ref('');
const isLoading = ref(false);

const sendData = () => {
  if (!messageText.value) {
    message.error(`请填写${props.titleText}内容`);
    return;
  }
  isLoading.value = true;
  emit('send', messageText.value, (successText) => {
    isLoading.value = false;
    messageText.value = '';
    message.success(successText);
  });
};
</script>

<style lang="less" scoped>
.conment-container {
  .title {
    margin-bottom: 24px;
    font-size: 20px;
    line-height: 30px;
    font-weight: 600;
    color: #252933;
  }
  .content {
    display: flex;
    .inp {
      margin-left: 24px;
      flex-grow: 1;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 13px;
  }
}
</style>
