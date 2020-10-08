import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1DB954",
        secondary: "#FFFFFF",
        accent: "#181818"
      }
    }
  }
});
