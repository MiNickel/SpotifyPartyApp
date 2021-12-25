<template>
  <v-container fluid>
    <v-text-field
      autocomplete="off"
      placeholder="Suche"
      class="search-input"
      v-model="search"
      solo
      label="Suche"
      clearable
      @click:clear="clearSearch()"
    >
    </v-text-field>
    <div
      v-if="playlistTracks.length === 0 && searchTracks.length === 0 && !loaded"
      class="text-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <!--Liste für Tracks der Playlist-->
    <PlaylistTracks
      :playlistTracks="playlistTracks"
      :searchTracks="searchTracks"
      :currentTrackId="currentTrackId"
      :adminId="$store.state.adminId"
      @setCurrentTrackId="setCurrentTrackId"
      @showSnackbar="showSnackbar"
    ></PlaylistTracks>
    <!--Liste für Tracks aus der Suche-->
    <SearchTracks
      :clearSearch="clearSearch"
      :getPlaylistTracks="getPlaylistTracks"
      :loaded="loaded"
      :searchTracks="searchTracks"
      :addTrack="addTrack"
    ></SearchTracks>
    <v-snackbar centered :timeout="timeout" v-model="snackbar">
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="primary" text v-bind="attrs" @click="snackbar = false">
          Schließen
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PlaylistTracks from "../../components/PlaylistTracks.vue";
import SearchTracks from "../../components/SearchTracks.vue";
import { SpotifyApi } from "node_modules/@types/spotify-api";
import { PlaylistService } from "../../services/playlist.service";
import { SearchService } from "../../services/search.service";
import { AuthService } from "../../services/auth.service";

@Component({
  components: { PlaylistTracks, SearchTracks },
})
export default class Party extends Vue {
  private search = "";
  private searchTracks: SpotifyApi.TrackObjectFull[] = [];
  private awaitingSearch = false;
  private playlistTracks: SpotifyApi.PlaylistTrackObject[] = [];
  private currentTrackId = "";
  private loaded = false;
  private snackbar = false;
  private timeout = -1;
  private message = `Der Code lautet: ${this.$route.params.code}`;

  private playlistService = new PlaylistService();
  private searchService = new SearchService();
  private authService = new AuthService();

  async mounted() {
    this.loaded = false;
    if (this.$route.params.code) {
      this.$store.commit("setCode", this.$route.params.code);
    }
    if (this.$route.params.adminId) {
      await this.checkAdminId();
      this.$router.replace({ path: "/party" });
    }
    this.getPlaylistTracks();
  }

  setCurrentTrackId(id: string) {
    this.currentTrackId = id;
  }

  showSnackbar(message: string, timeInMs: number) {
    this.message = message;
    this.timeout = timeInMs;
    this.snackbar = true;
  }

  async addTrack(id: string) {
    this.loaded = false;
    await this.playlistService.addTrack(
      this.$store.state.code,
      id,
      this.$store.state.nickname,
    );
    this.$store.commit("addTrack", id);
    this.clearSearch();
    this.getPlaylistTracks();
  }

  async checkAdminId() {
    const response = await this.authService.checkAdminId(
      this.$route.params.adminId,
    );
    if (response.status === 200) {
      this.snackbar = true;
      this.$store.commit("setAdminId", this.$route.params.adminId);
      this.$store.commit("setNickname", "admin");
    }
  }

  clearSearch() {
    this.search = "";
    this.searchTracks = [];
  }

  private async getPlaylistTracks() {
    const response = await this.playlistService.getPlaylistTracks(
      this.$store.state.code,
    );
    this.playlistTracks = response.data.tracks;
    this.currentTrackId = response.data.currentlyPlayingTrack;
    this.loaded = true;
  }

  @Watch("search")
  onSearch() {
    if (!this.awaitingSearch) {
      setTimeout(async () => {
        if (this.search && this.search.length > 0) {
          const response = await this.searchService.search(
            this.$store.state.code,
            this.search,
          );
          this.searchTracks = response.data.tracks;
        } else {
          this.searchTracks = [];
        }
        this.awaitingSearch = false;
      }, 500);
      this.awaitingSearch = true;
    }
  }
}
</script>

<style lang="css" src="./Party.css"></style>
