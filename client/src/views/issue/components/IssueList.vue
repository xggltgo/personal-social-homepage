<template>
  <div class="issue-list-container">
    <div class="list-item" v-for="item in 10">
      <div class="left">
        <div class="answerCount">
          <div class="count">1</div>
          <div class="text">回答</div>
        </div>
        <div class="scanCount">
          <div class="count">93</div>
          <div class="text">阅读</div>
        </div>
      </div>
      <div class="right">
        <div class="issueTitle">
          php脚本总是报 mysqli_query(): send of 309 bytes failed with errno=32
          Broken pipe 这样的错误？
        </div>
        <div class="info">
          <div class="author">汝何不上九霄</div>
          <div class="time">10分钟前回答</div>
        </div>
      </div>
    </div>
    <!-- <div class="pager" v-if="showPager">
      <a-pagination
        v-model:current="pageInfo.page"
        :total="total"
        show-less-items
        @change="handlePageChange"
        :hideOnSinglePage="true"
      />
    </div> -->
  </div>

  <!-- 编辑文章 -->
  <!-- <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    :footer="null"
    width="100%"
    wrap-class-name="full-modal"
  >
    <EssayModal @closeToolModal="hideToolModal" :issueid="issueid" />
  </a-modal> -->
</template>

<script setup></script>

<style lang="less" scoped>
.issue-list-container {
  height: 100%;
}

.list-item {
  color: #212529;
  background-color: #fff;
  padding: 16px;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);
  display: flex;
  color: #8a919f;
  .left {
    display: flex;
    margin-right: 24px;
    .answerCount,
    .scanCount {
      text-align: center;
      padding: 5px;
      min-width: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .answerCount{
      border: 1px solid;
      border-radius: 4px;
    }
  }
}

.pager {
  display: flex;
  justify-content: center;
  padding: 15px 0 30px 0;
  margin: 24px 0;
}
</style>
