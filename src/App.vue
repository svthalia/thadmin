<template>
  <Authorization></Authorization>
  <RouterView />
</template>

<script>
import Authorization from "./components/Authorization.vue";

export default {
  name: "App",
  components: {
    Authorization
  }
};
</script>

<style></style>
