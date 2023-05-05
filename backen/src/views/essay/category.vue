<template>
  <div class="essay-category-container">
    <div class="add-category-wrapper">
      <div class="name">
        <a-input
          v-model:value="categoryName"
          placeholder="请输入需要增长的文章分类名称，右侧按钮调整文章分类等级"
          size="large"
          @change="handleChange"
        />
      </div>
      <div class="order">
        <a-progress
          type="circle"
          :percent="defaultPercent"
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
      </div>
      <div class="submit">
        <a-button type="primary" @click="handleAddCategory">
          新增分类
        </a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      bordered
    >
      <!-- 需要额外渲染的列 -->
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
        <template v-else-if="column.key === 'more'">
          <a-tooltip>
            <template #title>编辑</template>
            <a-button
              type="primary"
              shape="circle"
              @click="showModal(record.id)"
            >
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-tooltip>
          <span class="space" style="margin: 0 5px"></span>
          <a-tooltip>
            <template #title>删除</template>
            <a-button
              type="danger"
              shape="circle"
              @click="handleDelete(record.id)"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </a-tooltip>
        </template>
      </template>
    </a-table>
  </div>

  <!-- 编辑分类 -->
  <a-modal v-model:visible="visible" @ok="handleOk" :footer="null" width="30%">
    <CategoryModal
      @closeToolModal="hideToolModal"
      :categoryid="categoryid"
      :key="categoryid"
    />
  </a-modal>
</template>

<script setup>
import { ref, createVNode } from 'vue';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';

import { getAllCategories, addCategory, deleteCategory } from '@/api/category';
import CategoryModal from '@/components/CategoryModal/index.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '分类等级',
    dataIndex: 'order',
    key: 'order',
    width: 100,
  },
  {
    title: '分类下的文章数量',
    dataIndex: 'count',
    key: 'count',
    width: 150,
  },
  {
    title: '操作',
    key: 'more',
    width: 150,
  },
].map((item) => ({ ...item, align: 'center', ellipsis: true }));
const data = ref([]);

// 获取所有文章分类
const fetchAllCategories = async () => {
  const result = await getAllCategories();
  data.value = result;
};
fetchAllCategories();

const defaultPercent = ref(20);
const increase = () => {
  const percent = defaultPercent.value + 20;
  defaultPercent.value = percent > 100 ? 100 : percent;
};
const decline = () => {
  const percent = defaultPercent.value - 20;
  defaultPercent.value = percent < 20 ? 20 : percent;
};

const categoryName = ref('');
const handleAddCategory = async () => {
  console.log(categoryName.value);
  if (!categoryName.value) {
    message.error('请填写分类名称！');
  }
  const data = {
    name: categoryName.value,
    order: defaultPercent.value / 20,
  };
  await addCategory(data);
  await fetchAllCategories();
  // 清空表单
  categoryName.value = '';
  message.success('新增分类成功!');
};

const handleChange = () => {
  // 判断是否已经存在对应的名称
};

// 编辑分类
const visible = ref(false);
const categoryid = ref(null);
const handleOk = (e) => {
  visible.value = false;
};
const hideToolModal = async () => {
  await fetchAllCategories();
  visible.value = false;
  message.success('分类修改成功！');
};
const showModal = (id) => {
  categoryid.value = id;
  console.log(categoryid.value);
  visible.value = true;
};

// 删除分类
const handleDelete = (categoryid) => {
  Modal.confirm({
    title: '确定删除这个分类吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      {
        style: 'color:red;',
      },
      '分类一旦删除，对应分类下的文章变为未分类状态'
    ),
    cancelText: '取消',
    okText: '确定',
    async onOk() {
      // 更新仓库数据
      await deleteCategory(categoryid);
      await fetchAllCategories();
    },
    class: 'test',
  });
};
</script>

<style lang="less" scoped>
.essay-category-container {
  padding: 30px;
  .add-category-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 30px;
    .name {
      width: 500px;
      margin-right: 30px;
    }
    .order {
      .btn {
        margin-left: 15px;
      }
    }
    .submit {
      margin-left: 30px;
    }
  }
}
</style>
