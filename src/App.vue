<template>
  <div id="page-container">
    <nav
      class="navbar navbar-expand-md sticky-top site-header navbar-dark site-header"
    >
      <div class="container">
        <div
          class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link extra-margin-top-mobile" href="#">
                Home
              </a>
            </li>
          </ul>
        </div>
        <!-- <div class="mx-auto order-0 navbar-collapse collapse position-relative">
          <a class="navbar-brand drop-out-header" href="/"
            ><img src="#" height="120"
          /></a>
        </div>
        <div class="order-0 d-block d-md-none">
          <a class="navbar-brand drop-out-header-mobile" href="/"
            ><img src="#" height="80"
          /></a>
        </div> -->
        <div class="navbar-collapse collapse w-100 order-3 dual-collapse2 ">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="btn btn-primary nav-link" href="#">
                Login
              </a>
            </li>
          </ul>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target=".dual-collapse2"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
    <RouterView class="console" />
    <div class="position-absolute vw-100 vh-100 overflow-hidden">
      <div class="position-absolute w-100 h-100 background-image"></div>
    </div>
  </div>
</template>

<script>
import Authorization from "@/components/Authorization";

export default {
  name: "App",
  components: {},
  data() {
    return {
      currentTime: ""
    };
  },
  methods: {
    zeroPad(n) {
      return (parseInt(n, 10) >= 10 ? "" : "0") + n;
    },
    time() {
      const now = new Date();
      this.currentTime = `${now.getHours()}:${this.zeroPad(
        now.getMinutes()
      )}:${this.zeroPad(now.getSeconds())}`;
      //setInterval(this.time, 1000);
    }
  },
  mounted: function() {
    this.time();
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

.background-image {
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

.site-header {
  background-color: black;
}

.site-header .nav-item a.nav-link {
  color: white;
}

.site-header .nav-item a.nav-link:hover {
  color: rgba(255, 255, 255, 0.7);
}

.btn-primary {
  background-color: #e62272 !important;
  color: #ffffff !important;
  border-color: #e62272 !important;
}

.btn-primary:hover {
  background-color: black !important;
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
