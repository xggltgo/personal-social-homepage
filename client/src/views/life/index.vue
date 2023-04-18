<template>
  <div class="life-container">
    <div class="aside-left"></div>
    <div class="main">
      <LifeList />
    </div>
    <div class="aside-right"></div>
  </div>
</template>

<script setup>
import LifeList from './components/LifeList.vue';
</script>

<style lang="less" scoped>
.life-container {
  display: flex;
  align-items: flex-start;
}

.main {
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
}

.aside-left {
  position: sticky;
  top: 30px;
  width: 180px;
  margin-right: 20px;
  background: #fff;
  // padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.aside-right {
  width: 260px;
  margin-left: 20px;
  // height: 300px;
  background: #fff;
  border-radius: 4px;
  flex-shrink: 0;
}
</style>
