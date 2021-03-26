<template>
  <div id="page-container">
    <Header />
    <RouterView class="route-view" />
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: "App",
  components: {
    Header
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");

.background-image {
  background-image: url("https://253qv1sx4ey389p9wtpp9sj0-wpengine.netdna-ssl.com/wp-content/uploads/2020/05/GettyImages-1044350714-700x461.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  transform: scale(1.1);
  z-index: -10;
}

#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  margin: 0;
  padding: 0;
}

html {
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}

.site-header {
  background-color: #e62272;
}

.site-header .nav-item a.nav-link {
  color: white;
}

.site-header .nav-item a.nav-link:hover {
  color: rgba(255, 255, 255, 0.7);
}

.btn-primary {
  background-color: #e62272 !important;
  color: white !important;
  border-color: #e62272 !important;
}

.btn-primary:hover {
  background-color: white !important;
  color: #e62272 !important;
  border-color: #e62272 !important;
}

.auth {
  font-family: "Open Sans", sans-serif;
  font-size: 2vh;
  line-height: 2vh;
  color: white;
  float: left;
}

.clock {
  font-family: "Open Sans", sans-serif;
  font-size: 2vh;
  line-height: 2vh;
  color: white;
  float: right;
}

.console {
  grid-area: console;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  z-index: 10;
}
</style>
