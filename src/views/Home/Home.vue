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
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ on, attrs }">
          <v-row justify="center"
            ><v-btn
              v-on="on"
              v-bind="attrs"
              color="primary"
              rounded
              elevation="2"
              >Join Party</v-btn
            ></v-row
          >
        </template>
        <v-card color="accent">
          <v-card-title color="secondary">Party beitreten</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row class="input-margin" justify="center"
                ><v-text-field
                  autocomplete="off"
                  class="code-input"
                  v-model="nickname"
                  color="#2e2e2e"
                  label="Nickname"
                  filled
                  :rules="nameRule"
                ></v-text-field
              ></v-row>
              <v-row class="input-margin" justify="center"
                ><v-text-field
                  autocomplete="off"
                  class="code-input"
                  v-model="partyCode"
                  color="#2e2e2e"
                  label="Party Code"
                  filled
                  :rules="codeRule"
                ></v-text-field
              ></v-row>
            </v-form>
            <v-alert
              transition="fade-transition"
              :value="error.show"
              type="error"
              elevation="10"
              color="primary"
              >{{ error.message }}</v-alert
            >
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!valid" color="primary" @click="joinParty"
              >Join Party</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <br />
    </div>
  </v-container>
</template>

<script lang="ts">
import router from "@/router";
import { AuthService } from "@/services/auth.service";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Home extends Vue {
  valid = true;
  partyCode = "";
  nickname = "";
  private error = { show: false, message: "" };
  private loaded = true;
  dialog = false;
  private authService = new AuthService();
  nameRule = [(v: string) => !!v || "Geben Sie einen Namen an"];
  codeRule = [(v: string) => !!v || "Geben Sie den Partycode ein"];

  createParty() {
    this.loaded = false;
    window.location.href = `${process.env.VUE_APP_SERVER_URL}/login`;
  }

  async joinParty() {
    if (this.$store.state.code === this.partyCode) {
      this.loaded = true;
      this.setError("Sie sind bereits in dieser Party.", 3000);
      return;
    }

    const response = await this.authService.checkCode(
      this.partyCode,
      this.nickname,
    );
    this.loaded = true;
    if (response.data === null) {
      this.dialog = false;
      this.error = { show: false, message: "" };
      this.$store.commit("resetTrackIds");
      this.$store.commit("setNickname", this.nickname);
      router.push({ name: "Party", params: { code: this.partyCode } });
    } else {
      console.log(response.data);
      this.setError(response.data, 3000);
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
<style lang="css" src="./Home.css"></style>
