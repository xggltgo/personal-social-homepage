<template>
  <div class="essay-modal-container">
    <a-form :model="formState" layout="vertical" @finish="onFinish">
      <!-- 文章标题 -->
      <a-form-item label="分类名称" name="name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入文章分类名称"
          size="large"
          show-count
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类等级" name="order">
        <a-progress
          type="circle"
          :percent="formState.order"
          :width="80"
          :format="(percent) => `level ${percent / 20}`"
        />
        <span class="btn">
          <a-button-group>
            <a-button @click="decline">
              <template #icon><minus-outlined /></template>
            </a-button>
            <a-button @click="increase">
              <template #icon><plus-outlined /></template>
            </a-button>
          </a-button-group>
        </span>
      </a-form-item>

      <!-- 发布博客 -->
      <a-form-item>
        <a-button type="primary" html-type="submit"> 确认修改 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getCategory, updateCategory } from '@/api/category';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  categoryid: {
    type: Number,
  },
});

const emit = defineEmits(['closeToolModal']);
const router = useRouter();
const userStore = useUserStore();
const formState = reactive({
  name: '',
  order: 20,
});

const increase = () => {
  formState.order = formState.order + 20 > 100 ? 100 : formState.order + 20;
};
const decline = () => {
  formState.order = formState.order - 20 < 20 ? 20 : formState.order - 20;
};

//如果父元素传递了categoryid，需要数据回填
(async () => {
  if (props.categoryid) {
    const result = await getCategory(props.categoryid);
    formState.name = result.name;
    formState.order = result.order * 20;
  }
})();

const onFinish = async () => {
  // 组装数据

  if (!formState.name) {
    message.error('请填写分类名称');
    return;
  }

  const data = {
    ...formState,
    order: formState.order / 20,
  };
  if (props.categoryid) {
    await updateCategory(props.categoryid, data);
  }

  // 通知父元素管理toolModel
  emit('closeToolModal');
};
</script>

<style lang="less">
.essay-modal-container {
  .btn {
    margin-left: 15px;
  }
}
</style>
