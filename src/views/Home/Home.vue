<template>
  <v-container fill-height fluid>
    <div style="width: 100%" justify="center" align="center">
      <v-row justify="center"
        ><v-btn color="primary" rounded :href="url" elevation="2">
          Create New Party
        </v-btn>
      </v-row>
      <br />
      <v-row justify="center"><span class="or-color">OR</span></v-row>
      <br />
      <v-row class="input-margin" justify="center"
        ><v-text-field
          class="code-input"
          :value="partyCode"
          @input="change"
          color="primary"
          label="Party Code"
          outlined
        ></v-text-field
      ></v-row>
      <v-row justify="center"
        ><v-btn @click="joinParty()" color="primary" rounded elevation="2"
          >Join Party</v-btn
        ></v-row
      >
    </div>
  </v-container>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Home extends Vue {
  private url = `${process.env.VUE_APP_SERVER_URL}/login`;
  partyCode = "";

  private joinParty = () => {
    router.push({ name: "Party", params: { code: this.partyCode } });
  };

  private change = (val: string) => {
    this.partyCode = val;
  };
}
</script>
<style lang="scss" src="./Home.scss"></style>
