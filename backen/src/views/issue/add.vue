<template>
  <div class="issue-add-container">
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <!-- 问答标题 -->
      <a-form-item label="问答标题" name="title">
        <a-input
          v-model:value="formState.title"
          placeholder="请输入问答标题"
          size="large"
          show-count
          :maxlength="30"
          allow-clear
        />
      </a-form-item>

      <!-- 问答内容 -->
      <a-form-item label="问答内容" name="content">
        <div id="vditor" />
      </a-form-item>

      <!-- 发布问答-->
      <a-form-item>
        <a-button type="primary" html-type="submit"> 发布问答</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { addIssue, getIssue, upadteIssue } from '@/api/issue';
import { useUserStore } from '@/stores/user';
import useVditor from '@/compositions/useVditor';
// 处理marddown编辑器
const { vditor } = useVditor();

const router = useRouter();
const userStore = useUserStore();
const formState = reactive({
  title: '',
  content: '',
  markdown: '',
});

const onFinish = async () => {
  // 组装数据
  formState.content = vditor.value.getHTML();
  formState.markdown = vditor.value.getValue();
  if (!formState.title) {
    message.error('请填写问答标题');
    return;
  }
  if (!formState.content) {
    message.error('请填写问答内容');
    return;
  }
  const data = {
    ...formState,
    userid: userStore.userInfo.id,
  };
  await addIssue(data);
  // 更新本地仓库用户信息
  userStore.userInfo.selfIssueCount += 1;

  // 清空表单项
  for (const key in formState) {
    formState[key] = '';
  }
  vditor.value.setValue('');

  // 跳转到发布成功界面
  router.push({
    name: 'issueList',
  });
};
</script>

<style lang="less" scoped>
.issue-add-container {
  padding: 30px;
}

// markdown 编辑器样式
#vditor {
  height: 700px;
}
</style>
