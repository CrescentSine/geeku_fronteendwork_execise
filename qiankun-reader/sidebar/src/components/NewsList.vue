<template>
  <div class="newslist">
    <div class="news-item" v-for="(item, index) in newslist" :key="index" @click="click(index)">
      <div class="img"><img :src="item.image" /></div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface NewsItem {
  title: string;
  image: string;
  path: string;
}

export default defineComponent({
  name: "NewsList",
  props: {
    newslist: {
      type: Array as PropType<NewsItem[]>,
      required: true,
    },
  },
  emits: {
    gotoNews (url: string) {
      return typeof url == "string";
    }
  },
  setup(props, { emit }) {
    return {
      click(idx: number) {
        if (idx < props.newslist.length) {
          let item = props.newslist[idx];
          emit("gotoNews", item.path)
        }
      }
    }
  }
});
</script>

<style>
.news-item {
  display: flex;
  height: 100px;
  justify-content: space-between;
}
</style>