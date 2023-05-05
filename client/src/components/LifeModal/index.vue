<template>
  <div class="life-modal-container">
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <!-- 动态文字 -->
      <a-form-item name="title">
        <a-textarea
          v-model:value="formState.content"
          placeholder="这一刻的想法..."
          size="large"
          show-count
          :maxlength="100"
          :bordered="false"
        />
      </a-form-item>

      <!-- 动态图片 -->
      <a-form-item name="images">
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
import { addLife, getLife, upadteLife } from '@/api/life';
import useUploadImages from './compositions/useUploadImages';

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

//如果父元素传递了lifeid，需要数据回填
(async () => {
  if (props.lifeid) {
    const result = await getLife(props.lifeid);
    formState.content = result.content;
    formState.images = result.images.map((image) => ({
      url: image,
    }));
  }
})();

const { headers, beforeUpload, handlePreview } = useUploadImages();
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const onFinish = async () => {
  // 组装数据
  console.log(formState.images);
  const data = {
    content: formState.content,
    images: formState.images.map((item) =>
      item.url ? item.url : item.response.data
    ),
    userid: userStore.userInfo.id,
  };

  if (!data.content) {
    message.error('请填写这一刻的想法');
    return;
  }

  if (props.lifeid) {
    const result = await upadteLife(props.lifeid, data);
  } else {
    const result = await addLife(data);
    userStore.userInfo.selfLifeCount += 1;
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
