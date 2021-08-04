<template>
  <div class="newslist">
    <div class="news-item" v-for="(item, index) in newslist" :key="index">
      <div class="img"><img src="{{item.image}}" /></div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "NewsList",
  props: {
    newslist: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less">
.news-item {
  display: flex;
  width: 600px;
  height: 100px;
  justify-content: space-between;
}
</style>