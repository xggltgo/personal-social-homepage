<template>
  <div class="login-form-container">
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="账号"
        name="loginId"
        :rules="[{ required: true, message: '账号不能为空!' }]"
      >
        <a-input v-model:value="formState.loginId" placeholder="请输入您的账号">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="密码"
        name="loginPwd"
        :rules="[{ required: true, message: '密码不能为空!' }]"
      >
        <a-input-password
          v-model:value="formState.loginPwd"
          placeholder="请输入您的密码"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 4 }">
        <a-checkbox v-model:checked="formState.remember">7天免登录</a-checkbox>
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="login-form-button"
          block
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const emit = defineEmits(['closeModal']);
const formState = reactive({
  loginId: 'user',
  loginPwd: '123456',
  // loginId: '',
  // loginPwd: '',
  remember: false,
});
const onFinish = async (values) => {
  // 登录
  const data = {
    ...values,
    remember: values.remember ? 7 : 1,
  };
  const result = await userStore.login(data);
  if (result) {
    emit('closeModal');
    // 提示用户登录成功
    message.success('登录成功！');
  }
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.loginId && formState.loginPwd);
});
</script>

<style lang="less" scoped></style>
