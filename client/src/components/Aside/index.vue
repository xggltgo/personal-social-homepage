<template>
  <div class="aside-container">
    <div class="self-achievement">
      <div class="title">个人成就</div>
      <div class="achievement-list">
        <div class="achievement-item">
          <div class="icon">
            <LikeOutlined
              :style="{
                color: '#7bb9ff',
              }"
            />
          </div>
          <div class="content">文章被点赞 {{ essayLikeCount }}</div>
        </div>
        <div class="achievement-item">
          <div class="icon">
            <EyeOutlined
              :style="{
                color: '#7bb9ff',
              }"
            />
          </div>
          <div class="content">问答被阅读 {{ issueScanCount }}</div>
        </div>
        <div class="achievement-item">
          <div class="icon">
            <CrownOutlined
              :style="{
                color: '#7bb9ff',
              }"
            />
          </div>
          <div class="content">积分 {{ userInfo.integral }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  PlusOutlined,
  LikeOutlined,
  EyeOutlined,
  CrownOutlined,
} from '@ant-design/icons-vue';
import { getUserInfoById } from '@/api/user';

const props = defineProps({
  userid: {
    type: Number,
    required: true,
  },
});

const userInfo = ref({});
const essayList = ref([]);
const issueList = ref([]);
const lifeList = ref([]);

const essayLikeCount = computed(() => {
  return essayList.value.reduce((a, b) => a + b.likeCount, 0);
});

const issueScanCount = computed(() => {
  return issueList.value.reduce((a, b) => a + b.scanCount, 0);
});
// 获取用户对应信息
(async () => {
  const result = await getUserInfoById(props.userid);
  userInfo.value = result.userInfo;
  essayList.value = result.essayList;
  issueList.value = result.issueList;
  lifeList.value = result.lifeList;
})();
</script>

<style lang="less" scoped>
.self-achievement {
  background-color: #fff;
  border-radius: 2px;
  margin-bottom: 12px;
  .title {
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    color: #31445b;
    border-bottom: 1px solid rgba(230, 230, 231, 0.5);
  }
  .achievement-list {
    padding: 16px;
    .achievement-item {
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #000;
      margin-bottom: 10px;
      .icon {
        width: 25px;
        height: 25px;
        margin-right: 14px;
        background: #e1efff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
      }
    }
  }
}
</style>
