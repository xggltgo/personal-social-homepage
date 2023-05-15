<template>
  <div class="login-container">
    <div class="title">
      <span
        v-for="(item, index) in titleTextList"
        :key="index"
        :class="{ space: item === 'H' || item === '后' }"
        >{{ item }}</span
      >
    </div>
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
          <a-input
            v-model:value="formState.loginId"
            placeholder="请输入您的账号"
          >
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

        <!-- <a-form-item
          label="验证码"
          name="captcha"
          :rules="[{ required: true, message: '验证码不能为空!' }]"
        >
          <a-input
            v-model:value="formState.captcha"
            placeholder="请输入您的验证码"
          >
            <template #prefix>
              <VerifiedOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item> -->

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
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  LockOutlined,
  VerifiedOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';

const emit = defineEmits(['closeModal']);
const userStore = useUserStore();
const router = useRouter();
const titleTextList = 'PERSONALHOMEPAGE后台管理'.split('');
const formState = reactive({
  loginId: 'xgglt',
  loginPwd: '123456',
  // loginId: '',
  // loginPwd: '',
  // captcha: '',
});
const onFinish = async (values) => {
  // 登录
  const data = {
    ...values,
  };
  const result = await userStore.login(data);
  if (result) {
    // 提示用户登录成功
    router.push('/');
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

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login-form-container {
  width: 600px;
  height: 400px;
}

.title {
  margin-bottom: 30px;
  @max: 20;
  .Loop(@index) when(@index<=@max) {
    span:nth-child(@{index}) {
      animation-delay: unit(@index * 0.05, s);
    }
    //递归调用 达到循环目的
    .Loop(@index+1);
  }
  // 调用循环
  .Loop(0);

  span {
    color: #faebd7;
    animation: shadowing 1s ease-in-out infinite alternate;
    font-size: 35px;
    letter-spacing: 3px;
    &.space {
      margin-left: 15px;
    }
  }
}

@keyframes shadowing {
  to {
    color: #ff0266;
    text-shadow: 20px 0 70px #ff0266;
  }
}
</style>
