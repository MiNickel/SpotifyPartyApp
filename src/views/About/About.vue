<template>
  <v-container fluid>
    <h1 style="color: white">Code: {{ $store.state.code }}</h1>
    <v-divider dark></v-divider>
    <v-row v-if="$store.state.adminId" class="pt-10">
      <v-list rounded>
        <v-list-item-group
          ><v-list-item v-for="(user, i) in users" :key="i">
            <v-list-item-content
              ><v-list-item-title v-text="user"></v-list-item-title
            ></v-list-item-content> </v-list-item
        ></v-list-item-group>
      </v-list>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PlaylistService } from "../../services/playlist.service";

@Component({
  components: {},
})
export default class About extends Vue {
  playlistService = new PlaylistService();
  users: string[] = [];
  async created() {
    if (this.$store.state.adminId) {
      const response = await this.playlistService.getUsers(
        this.$store.state.code,
      );
      this.users = response.data;
    }
  }
}
</script>
