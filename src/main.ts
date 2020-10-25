import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueAxios from "vue-axios";
import axios from "axios";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 1, secure: true }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  state: {
    code: "",
    trackIds: [] as string[],
    adminId: ""
  },
  mutations: {
    setCode(state, code: string) {
      state.code = code;
    },
    addTrack(state, id: string) {
      state.trackIds.push(id);
    },
    resetTrackIds(state) {
      state.trackIds = [];
    },
    setAdminId(state, id: string) {
      state.adminId = id;
    }
  }
});

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
