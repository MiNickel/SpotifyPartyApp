import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home/Home.vue";
import Party from "../views/Party/Party.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { transitionName: "slide" }
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About/About.vue"),

    meta: { transitionName: "slide" }
  },
  {
    path: "/party/:code?",
    name: "Party",
    component: Party,
    meta: { transitionName: "slide" }
  }
];

const router = new VueRouter({
  routes
});

export default router;
