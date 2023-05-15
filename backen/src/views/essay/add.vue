<template>
  <div class="essay-add-container">
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <!-- 文章标题 -->
      <a-form-item label="文章标题" name="title">
        <a-input
          v-model:value="formState.title"
          placeholder="请输入文章标题"
          size="large"
          show-count
          :maxlength="30"
          allow-clear
        />
      </a-form-item>

      <!-- 文章内容 -->
      <a-form-item label="文章内容" name="content">
        <div id="vditor" />
      </a-form-item>

      <!-- 文章描述 -->
      <a-form-item label="文章描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          placeholder="请输入文章描述"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          show-count
          :maxlength="100"
          allow-clear
        />
      </a-form-item>

      <!-- 文章头图 -->
      <a-form-item label="文章头图（可选）" name="cover">
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
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>

      <!-- 文章分类 -->
      <a-form-item label="文章分类" name="categoryid">
        <a-select
          ref="select"
          v-model:value="formState.categoryid"
          style="width: 130px"
          placeholder="input search text"
          size="large"
        >
          <a-select-option :value="item.id" v-for="item in categoryList">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- 发布博客 -->
      <a-form-item>
        <a-button type="primary" html-type="submit"> 发布文章 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getAllCategories } from '@/api/category';
import { addEssay, getEssay, upadteEssay } from '@/api/essay';
import { useUserStore } from '@/stores/user';
import useVditor from '@/compositions/useVditor';
import useUploadImage from '@/compositions/useUploadImage';
// 处理marddown编辑器
const { vditor } = useVditor();

// 处理文件上传
const { fileList, headers, loading, imageUrl, handleChange, beforeUpload } =
  useUploadImage();

const router = useRouter();
const userStore = useUserStore();
const formState = reactive({
  title: '',
  content: '',
  markdown: '',
  description: '',
  cover: '',
  categoryid: '',
});

const onFinish = async () => {
  // 组装数据
  formState.cover = imageUrl.value;
  formState.content = vditor.value.getHTML();
  formState.markdown = vditor.value.getValue();
  if (!formState.title) {
    message.error('请填写文章标题');
    return;
  }
  if (!formState.content) {
    message.error('请填写文章内容');
    return;
  }
  if (!formState.description) {
    message.error('请填写文章描述');
    return;
  }
  const data = {
    ...formState,
    userid: userStore.userInfo.id,
  };
  await addEssay(data);
  // 更新本地仓库用户信息
  userStore.userInfo.selfEssayCount += 1;

  // 清空表单项
  for (const key in formState) {
    if (key === 'categoryid') {
      formState[key] = categoryList.value[0].id;
    } else {
      formState[key] = '';
    }
  }
  vditor.value.setValue('');
  imageUrl.value = '';

  // 跳转到发布成功界面
  router.push({
    name: 'essayList',
  });
  message.success('添加文章成功！');
};

// 获取所有文章分类
const categoryList = ref([]);
(async () => {
  const result = await getAllCategories();
  categoryList.value = result;
  formState.categoryid = result[0].id || '';
})();
</script>

<style lang="less">
.essay-add-container {
  padding: 30px;
}

// markdown 编辑器样式
#vditor {
  height: 700px;
}

// 头像上传样式处理
.ant-form-item-control-input-content {
  .avatar-uploader {
    width: 240px;
    height: 160px;
    .ant-upload {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .ant-upload-select-picture-card {
      i {
        font-size: 32px;
        color: #999;
      }
      .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    }
  }
}
</style>
