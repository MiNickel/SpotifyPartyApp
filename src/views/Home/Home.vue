<template>
  <v-container fill-height fluid>
    <div v-if="!loaded" style="width: 100%" justify="center" align="center">
      <v-row justify="center"
        ><v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular
      ></v-row>
    </div>
    <div v-if="loaded" style="width: 100%" justify="center" align="center">
      <v-row justify="center"
        ><v-btn color="primary" rounded @click="createParty" elevation="2">
          Create New Party
        </v-btn>
      </v-row>
      <br />
      <v-row justify="center"><span class="or-color">OR</span></v-row>
      <br />
      <v-row class="input-margin" justify="center"
        ><v-text-field
          autocomplete="off"
          class="code-input"
          v-model="partyCode"
          color="primary"
          label="Enter Party Code"
          filled
          outlined
        ></v-text-field
      ></v-row>
      <v-row justify="center"
        ><v-btn @click="joinParty" color="primary" rounded elevation="2"
          >Join Party</v-btn
        ></v-row
      >
      <br />
      <v-alert
        transition="fade-transition"
        :value="error.show"
        type="error"
        elevation="10"
        color="primary"
        >{{ error.message }}</v-alert
      >
    </div>
  </v-container>
</template>

<script lang="ts">
import router from "@/router";
import { AuthService, IAuthService } from "@/services/auth.service";
import { Component, Vue } from "vue-property-decorator";

@Component<Home>({
  components: {},
})
export default class Home extends Vue {
  url = `${process.env.VUE_APP_SERVER_URL}/login`;
  private partyCode = "";
  private error = { show: false, message: "" };
  loaded = true;
  private authService: IAuthService = new AuthService();

  createParty() {
    this.loaded = false;
    window.location.href = `${process.env.VUE_APP_SERVER_URL}/login`;
  }

  async joinParty() {
    this.loaded = false;
    if (this.$store.state.code === this.partyCode) {
      this.setError("Sie sind bereits in dieser Party.", 3000);
      return;
    }

    const response = await this.authService.checkCode(this.partyCode);
    if (response.status === 204) {
      this.error = { show: false, message: "" };
      this.$store.commit("resetTrackIds");
      router.push({ name: "Party", params: { code: this.partyCode } });
    } else {
      this.setError("Diese Party existiert nicht.", 3000);
    }
  }

  setError(message: string, duration: number) {
    this.error = { show: true, message };
    setTimeout(() => {
      this.error.show = false;
    }, duration);
  }
}
</script>
<style lang="scss" src="./Home.scss"></style>
