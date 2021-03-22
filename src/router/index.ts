import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Shift from "../views/Shift.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/auth/callback",
    name: "OAuth Authorization",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Authorize.vue")
  },
  {
    path: "/shift/:shiftId",
    name: "Shift",
    component: Shift,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
