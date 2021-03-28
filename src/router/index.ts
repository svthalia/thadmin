import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Shift from "../views/Shift.vue";
import Shifts from "../views/Shifts.vue";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/auth/callback",
    name: "OAuth Authorization",
    component: () => import("../views/Authorize.vue")
  },
  {
    path: "/shifts/:shiftId",
    component: Shift,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/shifts",
    name: "Shifts",
    component: Shifts,
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters["User/isLoggedIn"]) {
      next({
        name: "Home"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
