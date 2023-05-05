<template>
  <div class="home-container">
    <div class="slider">
      <a-carousel :after-change="onChange" autoplay>
        <div class="slider-item"><h3>1</h3></div>
        <div class="slider-item"><h3>2</h3></div>
        <div class="slider-item"><h3>3</h3></div>
        <div class="slider-item"><h3>4</h3></div>
      </a-carousel>
    </div>
    <div class="rank"></div>
  </div>
</template>

<script setup>
const onChange = (current) => {
  console.log(current);
};
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
}
.slider-item{
  height: 550px;
  width: 100%;
  background: darkcyan;
}
</style>
