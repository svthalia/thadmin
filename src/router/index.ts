import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Shift from "../views/Shift.vue";
import Shifts from "../views/Shifts.vue";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Shifts",
    component: Shifts,
    meta: {
      requiresAuth: true
    }
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
    name: "Shift",
    component: Shift,
    props: true,
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
        name: "Shifts"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
