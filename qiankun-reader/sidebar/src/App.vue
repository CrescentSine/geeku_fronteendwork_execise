<template>
  <div>
    <NewsList :newslist="newslist"></NewsList>
  </div>
</template>

<script lang="ts">
import NewsList from "./components/NewsList.vue";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    NewsList,
  },
  setup() {
    let newslist = ref([]);
    let content = fetch("https://api.apiopen.top/getWangYiNews", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: 1,
        count: 50,
      }),
    });
    content
      .then((resp) => resp.json())
      .then((jsondata) => {
        newslist.value = jsondata.result
        console.log(jsondata.result)
      });
    return { newslist };
  },
};
</script>

<style>
* {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
