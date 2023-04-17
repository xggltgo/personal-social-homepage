<template>
  <div class="essay-category-container">
    <router-link
      :to="
        item.id === -1
          ? {
              name: 'essay',
            }
          : {
              name: 'essayCategory',
              params: {
                categoryid: item.id,
              },
            }
      "
      class="category-item"
      v-for="item in categoryList"
      :key="item.id"
    >
      {{ item.name }}
      <div class="count">{{ item.count }}篇</div>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAllCategories } from '@/api/category';
import eventBus from '@/eventBus';

// 获取所有文章分类
const categoryList = ref([]);

const fetchAllCategories = async () => {
  const result = await getAllCategories();
  categoryList.value = [
    {
      id: -1,
      name: '全部',
      order: 1,
      count: result.reduce((a, b) => {
        return a + b.count;
      }, 0),
    },
    ...result,
  ];
};
fetchAllCategories();

eventBus.$on('update', fetchAllCategories);
</script>

<style lang="less" scoped>
.category-item {
  padding: 10px 17px;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  .count {
    font-size: 12px;
    color: #b4b8bc;
    margin-left: 10px;
  }
  &:hover {
    color: #1e80ff;
    background: #f7f8fa;
    .count {
      color: #1e80ff;
    }
  }
}

.router-link-exact-active {
  background: #eaf2ff;
  color: #1e80ff;
  .count {
    color: #1e80ff;
  }
}
</style>
