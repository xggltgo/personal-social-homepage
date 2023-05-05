<template>
  <div class="register-form-container">
    <a-form
      :model="formState"
      name="normal_register"
      class="register-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :rules="rules"
    >
      <a-form-item label="昵称" name="nickname">
        <a-input
          v-model:value="formState.nickname"
          placeholder="请输入您的昵称"
        >
        </a-input>
      </a-form-item>

      <a-form-item label="账号" name="registerId">
        <a-input
          v-model:value="formState.registerId"
          placeholder="请输入您的账号"
        >
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="密码" name="registerPwd">
        <a-input-password
          v-model:value="formState.registerPwd"
          placeholder="请输入您的密码"
          autocomplete="off"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="register-form-button"
          block
        >
          注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { register, exist } from '@/api/user';

const emit = defineEmits(['closeModal']);
const formState = reactive({
  nickname: '',
  registerId: '',
  registerPwd: '',
});
const onFinish = async (values) => {
  // 登录
  const data = {
    nickname: values.nickname,
    loginId: values.registerId,
    loginPwd: values.registerPwd,
  };
  const result = await register(data);
  if (result) {
    emit('closeModal');
    // 提示用户登录成功
    message.success('注册成功！赶快来登录体验一下吧');
  }
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.registerId && formState.registerPwd && formState.nickname);
});

const validateNickname = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('昵称不能为空');
  } else {
    return Promise.resolve();
  }
};

const validateRegisterId = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('账号不能为空');
  }
  if (value.length < 4 || value.length > 12) {
    return Promise.reject('账号必须在4-12位之间');
  }
  const result = await exist(value);
  if (result) {
    return Promise.reject('账号已存在');
  } else {
    return Promise.resolve();
  }
};

const validateRegisterPwd = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('昵称不能为空');
  } else if (value.length < 6 || value.length > 15) {
    return Promise.reject('密码必须在6-15位之间');
  } else {
    return Promise.resolve();
  }
};

const rules = {
  nickname: [
    {
      validator: validateNickname,
      trigger: 'blur',
    },
  ],
  registerId: [
    {
      validator: validateRegisterId,
      trigger: 'change',
    },
  ],
  registerPwd: [
    {
      validator: validateRegisterPwd,
      trigger: 'change',
    },
  ],
};
</script>

<style lang="less" scoped></style>
