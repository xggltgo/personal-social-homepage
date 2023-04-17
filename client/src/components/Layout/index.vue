<template>
  <div class="layout-container">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.layout-container {
  height: 100%;
  .header {
    height: 61px;
  }
  .content {
    width: 1200px;
    margin: 30px auto;
  }
}
</style>
