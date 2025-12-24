<template>
  <div class="background-container">
    <div class="background-image" :style="pageBackground"></div>
  </div>
  <div id="page-container">
    <Header />
    <RouterView class="route-view" />
  </div>
</template>

<script>
import { Vue } from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import Header from "@/components/Header";

Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  release: process.env.VUE_APP_SENTRY_RELEASE,
  environment: process.env.VUE_APP_SENTRY_ENVIRONMENT,
  integrations: [new Integrations.BrowserTracing()],
  tracingOptions: {
    trackComponents: true,
  },
});

export default {
  name: "App",
  components: {
    Header,
  },
  data() {
    return {
      pageBackground: {
        backgroundImage: `url(${require("@/assets/images/backgroundImage.jpg")})`,
      },
    };
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");
.border-left-white-dotted {
  border-left: 1px white dotted !important;
}

.progress{
    --bs-progress-bar-bg: #93003c !important;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .progress {
    --bs-progress-bg: #797872 !important;
  }

  .card {
    --bs-card-bg: #444444 !important;
    --bs-card-cap-color: #ffffff !important;
    --bs-card-color: #ffffff !important;
  }

  .bg-card {
    background-color: #444444;
  }

  .background-image {
    filter: blur(10px) brightness(50%) !important;
    opacity: 1 !important;
  }

  .border-left-white-dotted {
    border-left: 1px #444444 dotted !important;
  }

  #app {
      color: #ffffff !important;
  }
}

.bg-card {
  background-color: #ffffff;
}

* {
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}

.font-oswald {
  font-family: "Oswald", sans-serif;
  text-transform: uppercase;
}

.link-unstyled,
.link-unstyled:link,
.link-unstyled:hover {
  color: inherit;
  text-decoration: inherit;
}
body {
  overscroll-behavior: none;
}
.page-container {
  overscroll-behavior: contain;
}
.background-container {
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  overscroll-behavior: none;
  z-index: -10;
}
.background-image {
  height: 110vh;
  width: 110vw;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left;
  background-attachment: scroll;
  filter: blur(10px);
  transform: scale(1.2);
  opacity: 0.3;
  z-index: -10;
  overflow: hidden;
  overscroll-behavior: none;
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

.user-select-none {
  cursor: default;
}
</style>
