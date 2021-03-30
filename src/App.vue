<template>
  <v-app>
    <v-main v-touch="{ left: () => leftSwipe(), right: () => rightSwipe() }">
      <transition :name="transitionName" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
    <v-footer fixed padless dark
      ><Player
        v-if="$route.path === '/party' && $store.state.code !== ''"
      ></Player
    ></v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
import Player from "./components/Player.vue";
import { Spotify } from "node_modules/@types/spotify-web-playback-sdk";

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    onSpotifyWebPlaybackSDKReady(): void;
    // eslint-disable-next-line no-undef
    Spotify: typeof Spotify;
  }
}

@Component<App>({
  components: { Player },
  created() {
    this.$router.beforeEach((to, from, next) => {
      const leavePath = from.name;
      const enterPath = to.name;
      if (leavePath === "Home") {
        this.transitionName = "slide-left";
      } else if (leavePath === "About") {
        this.transitionName = "slide-right";
      } else if (leavePath === "Party" && enterPath === "About") {
        this.transitionName = "slide-left";
      } else {
        this.transitionName = "slide-right";
      }
      next();
    });
  },

  computed: {
    codeAndAdminId() {
      return `${this.$store.state.code}|${this.$store.state.adminId}`;
    },
  },

  watch: {
    codeAndAdminId(newVal: string, oldVal: string) {
      const [oldCode, oldAdminId] = oldVal.split("|");
      const [newCode, newAdminId] = newVal.split("|");
      console.log(oldCode, newCode, oldAdminId, newAdminId);
    },
  },
})
export default class App extends Vue {
  transitionName = "";

  leftSwipe = () => {
    switch (this.$route.name) {
      case "Home": {
        if (this.$store.state.code !== "") {
          router.push({ name: "Party" });
        } else {
          router.push({ name: "About" });
        }
        break;
      }
      case "Party": {
        router.push({ name: "About" });
        break;
      }
    }
  };
  rightSwipe = () => {
    switch (this.$route.name) {
      case "Party": {
        router.push({ name: "Home" });
        break;
      }
      case "About": {
        if (this.$store.state.code !== "") {
          router.push({ name: "Party" });
        } else {
          router.push({ name: "Home" });
        }
        break;
      }
    }
  };
}
</script>
<style src="./App.scss" lang="scss"></style>
