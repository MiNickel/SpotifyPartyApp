import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueAxios from "vue-axios";
import axios from "axios";
import Vuex from "vuex";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    code: "",
    trackIds: [] as string[]
  },
  mutations: {
    setCode(state, code: string) {
      state.code = code;
    },
    addTrack(state, id: string) {
      state.trackIds.push(id);
    }
  }
});

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
