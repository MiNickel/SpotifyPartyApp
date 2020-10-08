<template>
  <v-app>
    <v-app-bar app flat>
      <v-toolbar-title>Spotify Party App</v-toolbar-title>
    </v-app-bar>
    <v-main v-touch="{ left: () => leftSwipe(), right: () => rightSwipe() }">
      <transition :name="transitionName" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
    <v-bottom-navigation>
      <v-btn to="/">
        <span>
          Home
        </span>
      </v-btn>
      <v-btn v-if="$store.state.code !== ''" to="/party">
        <span>
          Party
        </span>
      </v-btn>
      <v-btn to="/about">
        <span>
          About
        </span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";

@Component({})
export default class App extends Vue {
  private transitionName = "";

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
  }

  private leftSwipe = () => {
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
  private rightSwipe = () => {
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
