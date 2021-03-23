<template>
  <div id="app">
    <div class="background"><div class="background-image"></div></div>
    <header>
      <Authorization class="auth"></Authorization>
      <!--      <span class="clock">{{ currentTime }}</span>-->
    </header>
    <RouterView class="console" />
  </div>
</template>

<script>
import Authorization from "@/components/Authorization";
import moment from "moment";

export default {
  name: "App",
  components: {
    Authorization
  },
  data() {
    return {
      currentTime: ""
    };
  },
  methods: {
    // time() {
    //   this.currentTime = moment().format("HH:mm:ss");
    //   setInterval(this.time, 1000);
    // }
  },
  mounted: function() {
    // this.time();
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.background {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
}

.background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("https://253qv1sx4ey389p9wtpp9sj0-wpengine.netdna-ssl.com/wp-content/uploads/2020/05/GettyImages-1044350714-700x461.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
  z-index: -10;
}

#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: calc(2vh + 20px) 1fr;
  grid-template-areas:
    "header"
    "console";
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

header {
  grid-area: header;
  background-color: #000000;
  width: 100%;
  height: 100%;
  padding: 10px;
  color: #ffffff;
  z-index: 10;
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
