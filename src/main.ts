import { createApp } from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

Sentry.init({
  dsn:
    "https://d982883f74014ba7a7243ffaa59a3ec0@o263149.ingest.sentry.io/5757558",
  integrations: [new Integrations.BrowserTracing()],
  tracingOptions: {
    trackComponents: true
  }
});

createApp(App)
  .use(router)
  .use(store)
  .mount("#app");
