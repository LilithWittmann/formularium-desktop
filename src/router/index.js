import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/setup/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/setup/login/",
    name: "Login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  console.log(window.api.oauth.getAPIURL());

  if (Vue.prototype.API_URL !== undefined) {
    next();
  }
  // check if app is setup and continue to setup process if necessary
  return Promise.all([
    window.api.oauth.getAPIURL(),
    window.api.oauth.setupDone()
  ]).then(values => {
    if (values[1] === true) {
      console.log("fetch api url");
      Vue.prototype.API_URL = values[0];
      console.log(Vue.prototype.API_URL);
    } else {
      console.log("redirect to setup");
      if (to.name !== "Login") next({ name: "Login" });
    }
    next();
  });
});

export default router;
