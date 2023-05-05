<template>
  <div class="essay-container">
    <div class="left type">
      <EssayCategory />
    </div>
    <div class="main">
      <div class="content">
        <!-- <div class="rank"></div> -->
        <div class="list">
          <EssayList />
        </div>
      </div>
      <aside class="aside">
      </aside>
    </div>
  </div>
</template>

<script setup>
import EssayList from './components/EssayList.vue';
import EssayCategory from './components/EssayCategory.vue';



</script>

<style lang="less" scoped>
.essay-container {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.left {
  position: sticky;
  top: 30px;
  width: 180px;
  margin-right: 20px;
  background: #fff;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.main {
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  .content {
    flex-grow: 1;
    .rank {
      height: 150px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 4px;
    }
    .list {
      background: #fff;
      border-radius: 4px;
    }
  }
  .aside {
    width: 260px;
    margin-left: 20px;
    height: 300px;
    // background: #fff;
    border-radius: 4px;
    flex-shrink: 0;
  }
}
</style>
