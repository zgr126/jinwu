import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
} from "vue-router";

import HomeView from "./components/HelloWorld.vue";
import home from "./components/main.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => {
      return import("./components/menu.vue");
    },
  },
  { path: "/start", name: "start", component: HomeView },
  {
    path: "/me",
    name: "me",
    component: () => {
      return import("./components/me.vue");
    },
  },
  {
    path: "/menu",
    name: "menu",
    component: () => {
      return import("./components/menu.vue");
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
