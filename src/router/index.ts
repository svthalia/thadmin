import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Shift from "../views/Shift.vue";
import Shifts from "../views/Shifts.vue";
import Index from "../views/Index.vue";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/shifts/:shiftId",
    name: "Shift",
    component: Shift,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/shifts",
    name: "Shifts",
    component: Shifts,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/auth/callback",
    name: "OAuth Authorization",
    component: () => import("../views/Authorize.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters["User/isLoggedIn"]) {
      next({
        name: "Index",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
