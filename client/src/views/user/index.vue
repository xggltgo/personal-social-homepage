<template>
  <div class="user-container">
    <div class="left">
      <div class="self-info">
        <div class="avatar">
          <a-avatar :size="90" :src="userInfo.avatar"> </a-avatar>
        </div>
        <div class="info-box">
          <div class="nickname">{{ userInfo.nickname }}</div>
          <div class="bottom">
            <div class="bottom-left">
              <div
                class="profession"
                @click="showModal('check')"
                v-if="userInfo.profession"
                :class="userInfo.id !== userStore.userInfo?.id ? '' : 'isSelf'"
              >
                <div class="icon">
                  <TagsOutlined />
                </div>
                <div class="text">{{ userInfo.profession }}</div>
              </div>
              <div
                class="profession"
                :class="userInfo.id !== userStore.userInfo?.id ? '' : 'isSelf'"
                @click="showModal('check')"
                v-else
              >
                <div class="icon">
                  <PlusOutlined :style="{ fontSize: 12 + 'px' }" />
                </div>
                <div class="text">你从事什么职业？</div>
              </div>
              <div
                class="selfIntroduction"
                :class="userInfo.id !== userStore.userInfo?.id ? '' : 'isSelf'"
                @click="showModal('check')"
                v-if="userInfo.selfIntroduction"
              >
                <div class="icon">
                  <SolutionOutlined />
                </div>
                <div class="text">{{ userInfo.selfIntroduction }}</div>
              </div>
              <div
                class="selfIntroduction"
                :class="userInfo.id !== userStore.userInfo?.id ? '' : 'isSelf'"
                @click="showModal('check')"
                v-else
              >
                <div class="icon">
                  <PlusOutlined :style="{ fontSize: 12 + 'px' }" />
                </div>
                <div class="text">你的自我介绍是什么？</div>
              </div>
            </div>
            <div class="bottom-right" v-if="userInfo.id === userid">
              <a-button type="dashed" @click="showModal">编辑个人资料</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="all-list">
        <a-tabs v-model:activeKey="activeKey" @change="handleChange">
          <a-tab-pane key="1" tab="文章">
            <a-empty
              description="暂无对应内容"
              :image="simpleImage"
              v-if="essayList.length === 0"
            />
            <EssayList :userid="+route.params.userid" v-else />
          </a-tab-pane>
          <a-tab-pane key="2" tab="问答" force-render>
            <a-empty
              description="暂无对应内容"
              :image="simpleImage"
              v-if="issueList.length === 0"
            />
            <IssueList :userid="+route.params.userid" v-else />
          </a-tab-pane>
          <a-tab-pane key="3" tab="动态">
            <a-empty
              description="暂无对应内容"
              :image="simpleImage"
              v-if="lifeList.length === 0"
            />
            <LifeList :userid="+route.params.userid" v-else />
          </a-tab-pane>
          <a-tab-pane key="4" tab="点赞">
            <a-tabs v-model:activeKey="subActiveKey" @change="handleChange">
              <a-tab-pane key="4-1" tab="点赞的文章" force-render>
                <EssayList :userid="+route.params.userid" :liked="true" />
              </a-tab-pane>
              <a-tab-pane key="4-2" tab="点赞的问答" force-render>
                <IssueList :userid="+route.params.userid" :liked="true" />
              </a-tab-pane>
              <a-tab-pane key="4-3" tab="点赞的动态" force-render>
                <LifeList :userid="+route.params.userid" :liked="true" />
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="right">
      <Aside :userid="+route.params.userid" />
      <div class="join-date">
        <div class="text">加入于</div>
        <div class="time">
          {{ formatLocaleTime(userInfo.registerDate, true) }}
        </div>
      </div>
    </div>
  </div>

  <!-- 编辑个人信息对话框 -->
  <a-modal
    v-model:visible="visible"
    centered
    @ok="handleOk"
    :width="800"
    :footer="null"
  >
    <SelfInfoForm @closeModal="hideModal" />
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserInfoById } from '@/api/user';
import { Empty } from 'ant-design-vue';
import EssayList from '@/views/essay/components/EssayList.vue';
import IssueList from '@/views/issue/components/IssueList.vue';
import LifeList from '@/views/life/components/LifeList.vue';
import Aside from '@/components/Aside/index.vue';
import {
  PlusOutlined,
  TagsOutlined,
  SolutionOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { formatLocaleTime } from '@/utils/tools';
import SelfInfoForm from './components/SelfInfoForm.vue';

const route = useRoute();
const router = useRouter();
const userInfo = ref({});
const essayList = ref([]);
const issueList = ref([]);
const lifeList = ref([]);
const userStore = useUserStore();
const activeKey = ref('1');
const subActiveKey = ref('4-1');
const visible = ref(false);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const userid = computed(() => userStore.userInfo?.id);

const handleOk = (e) => {
  visible.value = false;
};

const showModal = (check) => {
  if (check === 'check') {
    if (userInfo.value.id !== userStore.userInfo?.id) {
      return;
    }
  }
  visible.value = true;
};
const hideModal = async () => {
  await fetchAllUserInfo();
  visible.value = false;
};

// 根据userid获取对应的用户信息及其对应的文章、问答、动态信息
const fetchAllUserInfo = async () => {
  const result = await getUserInfoById(route.params.userid);
  userInfo.value = result.userInfo;
  essayList.value = result.essayList;
  issueList.value = result.issueList;
  lifeList.value = result.lifeList;
};
fetchAllUserInfo();

const handleChange = () => {
  router.push({
    name: route.name,
    query: {
      ...route.query,
      page: 1,
    },
  });
};
</script>

<style lang="less" scoped>
.user-container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
  display: flex;
}

.left {
  flex: 1 1 auto;
  .self-info {
    display: flex;
    padding: 30px;
    background-color: #fff;
    border-radius: 2px;
    .avatar {
      flex-shrink: 0;
    }
    .info-box {
      margin-left: 28px;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .nickname {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.2;
        color: #000;
        margin-bottom: 8px;
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .bottom-right {
          height: 100%;
          display: flex;
          align-items: flex-end;
        }
        .profession,
        .selfIntroduction {
          display: flex;
          font-size: 15px;
          color: #72777b;
          line-height: 22.5px;
          display: flex;
          align-items: center;
          .text {
            margin-left: 10px;
          }
          .icon {
            margin-right: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &.isSelf {
            color: #4a68ad;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  .all-list {
    margin-top: 12px;
    background-color: #fff;
    padding: 12px 20px;
  }
}

.right {
  flex: 0 0 auto;
  margin-left: 12px;
  width: 240px;
  line-height: 1.2;
  .join-date {
    background-color: #fff;
    border-radius: 2px;
    display: flex;
    padding: 15px 10px;
    font-size: 15px;
    color: #000;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
