<template>
  <div class="self-container">
    <h1 class="title">个人中心</h1>
    <div class="content">
      <div class="info">
        <div class="left">
          <a-divider />
          <div class="left-item">
            <label class="label">昵称</label>
            <div class="inp">
              <a-input
                v-model:value="formState.nickname"
                placeholder="请输入昵称"
                show-count
                :maxlength="20"
                allow-clear
              />
            </div>
          </div>
          <a-divider />
          <div class="left-item">
            <label class="label">职业</label>
            <a-input
              v-model:value="formState.profession"
              placeholder="请输入职业"
              show-count
              :maxlength="50"
              allow-clear
            />
          </div>
          <a-divider />
          <div class="left-item">
            <label class="label">自我介绍</label>
            <div class="inp">
              <a-textarea
                v-model:value="formState.selfIntroduction"
                placeholder="请输入自我介绍"
                show-count
                :auto-size="{ minRows: 3, maxRows: 5 }"
                :maxlength="100"
                allow-clear
              />
            </div>
          </div>
          <a-divider />
        </div>
        <div class="avatar">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            list-type="picture-card"
            :headers="headers"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/api/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <div class="text">我的头像</div>
          <div class="tips">支持 jpg、png、jpeg 格式大小 2M 以内的图片</div>
        </div>
      </div>
      <div class="btn">
        <a-button
          type="primary"
          @click="handleChangeUserInfo"
          :disabled="isLoading"
          >更新信息</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import useUploadImage from '@/compositions/useUploadImage';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { updateUserInfo } from '@/api/user';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const isLoading = ref(false);
const { fileList, headers, loading, imageUrl, handleChange, beforeUpload } =
  useUploadImage();
const formState = reactive({
  nickname: userStore.userInfo?.nickname,
  profession: userStore.userInfo?.profession,
  selfIntroduction: userStore.userInfo?.selfIntroduction,
});
imageUrl.value = userStore.userInfo?.avatar;

const handleChangeUserInfo = async () => {
  if (!formState.nickname) {
    message.error('昵称不能为空');
    return;
  }
  isLoading.value = true;
  const data = {
    ...formState,
    avatar: imageUrl.value,
  };
  // 更新本地仓库用户信息
  userStore.userInfo.nickname = data.nickname;
  userStore.userInfo.profession = data.profession;
  userStore.userInfo.selfIntroduction = data.selfIntroduction;
  userStore.userInfo.avatar = data.avatar;
  await updateUserInfo(userStore.userInfo?.id, data);
  isLoading.value = false;
  message.success('个人信息修改成功！');
};
</script>

<style lang="less">
.self-container {
  padding: 30px;
}

.title {
  font-weight: 600;
  color: #333;
}

.content {
  .info {
    display: flex;
    align-items: flex-start;
    .left {
      flex-grow: 1;
      .left-item {
        display: flex;
        align-items: flex-start;
        .label {
          width: 75px;
          font-weight: 500;
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .inp {
          flex-grow: 1;
        }
      }
    }
    .avatar {
      margin-left: 50px;
      flex-shrink: 0;
      width: 130px;
      text-align: center;
      .text {
        color: #1d2129;
        font-weight: 500;
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 8px;
      }
      .tips {
        color: #86909c;
        font-size: 12px;
        line-height: 17px;
        font-weight: 400;
      }
      .ant-upload-picture-card-wrapper {
        border-radius: 50%;
        .ant-upload-select-picture-card {
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
    }
  }
  .btn {
    margin-left: 75px;
  }
}
</style>
