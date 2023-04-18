<template>
  <div class="life-modal-container">
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <!-- 文章标题 -->
      <a-form-item name="title">
        <a-textarea
          v-model:value="formState.content"
          placeholder="这一刻的想法..."
          size="large"
          show-count
          :maxlength="30"
          :bordered="false"
        />
      </a-form-item>

      <!-- 文章头图 -->
      <a-form-item name="images">
        <!-- <a-upload
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
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload> -->
        <a-upload
          v-model:file-list="formState.images"
          action="/api/upload"
          :headers="headers"
          list-type="picture-card"
          @preview="handlePreview"
          :before-upload="beforeUpload"
          name="file"
        >
          <div v-if="formState.images.length < 9">
            <plus-outlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload>
        <a-modal
          :visible="previewVisible"
          :title="previewTitle"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>

      <!-- 发布动态 -->
      <a-form-item>
        <a-button type="primary" html-type="submit"> 发布动态 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';


import { useUserStore } from '@/stores/user';
import { addLife } from '@/api/life';

const props = defineProps({
  lifeid: {
    type: Number,
  },
});
const emit = defineEmits(['closeToolModal']);
const userStore = useUserStore();
const router = useRouter();
const formState = reactive({
  content: '',
  images: [],
});

const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('token'),
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 1MB!');
  }
  return isJpgOrPng && isLt2M;
};

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file) => {
  console.log(file.response.data);
  previewImage.value = file.response.data;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const onFinish = async () => {
  // 组装数据

  const data = {
    content: formState.content,
    images: formState.images.map((item) => item.response.data),
    userid: userStore.userInfo.id,
  };

  if (!data.content) {
    message.error('请填写这一刻的想法');
    return;
  }

  if (props.lifeid) {
    // const { id } = await upadteEssay(props.essayid, data);
    // essayid = id;
  } else {
    const result = await addLife(data);
    console.log(result);
  }
  // 清空表单项
  formState.content = '';
  formState.images = [];
  // 通知父元素管理toolModel
  emit('closeToolModal');
  // 跳转到发布成功界面
  router.push({
    name: 'result',
    query: {
      title: data.content,
    },
  });
};
</script>

<style lang="less" scoped></style>
