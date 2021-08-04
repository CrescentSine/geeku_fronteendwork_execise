<template>
  <div>
    <NewsList :newslist="newslist"></NewsList>
  </div>
</template>

<script lang="ts">
import NewsList from "./components/NewsList.vue";

export default {
  name: "App",
  components: {
    NewsList,
  },
  setup() {
    return {
      newslist: [{image:"A", title:"B"}]
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
