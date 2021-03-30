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
      <template v-slot:append-outer>
        <v-btn icon @click="listen" color="primary"
          ><v-icon>mdi-microphone</v-icon></v-btn
        >
      </template>
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
import {
  IPlaylistService,
  PlaylistService,
} from "../../services/playlist.service";
import { IAuthService, AuthService } from "../../services/auth.service";
import { SpotifyApi } from "node_modules/@types/spotify-api";
import { ISearchService, SearchService } from "../../services/search.service";

@Component<Party>({
  components: { PlaylistTracks, SearchTracks },

  async mounted() {
    this.webSpeechApi();
    this.loaded = false;
    if (this.$route.params.code) {
      this.$store.commit("setCode", this.$route.params.code);
    }
    if (this.$route.params.adminId) {
      this.$store.commit("resetTrackIds");
      await this.checkAdminId();
      this.$router.replace({ path: "/party" });
    }
    this.getPlaylistTracks();
  },
})
export default class Party extends Vue {
  search = "";
  searchTracks: SpotifyApi.TrackObjectFull[] = [];
  private awaitingSearch = false;
  playlistTracks: SpotifyApi.PlaylistTrackObject[] = [];
  currentTrackId: string | undefined = "";
  loaded = false;
  snackbar = false;
  timeout = -1;
  message = `Der Code lautet: ${this.$route.params.code}`;
  // eslint-disable-next-line no-undef
  private recognition = new SpeechRecognition();
  private playlistService: IPlaylistService = new PlaylistService();
  private authService: IAuthService = new AuthService();
  private searchService: ISearchService = new SearchService();

  listen() {
    this.recognition.start();
  }

  webSpeechApi() {
    // eslint-disable-next-line no-undef
    if (!SpeechRecognition) {
      return;
    }
    // eslint-disable-next-line no-undef
    this.recognition.continuous = false;
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.addEventListener("result", (event) => {
      const text = event.results[0][0].transcript;
      this.search = text;
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.recognition.addEventListener("onspeechend", (event) => {
      this.recognition.stop();
    });
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
    await this.playlistService.addTrack(this.$store.state.code, id);
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
      this.$store.commit("setAccessToken", response.data.accessToken);
    }
  }

  clearSearch() {
    this.search = "";
    this.searchTracks = [];
  }

  private async getPlaylistTracks() {
    const playlist = await this.playlistService.getCurrentPlaylist(
      this.$store.state.code,
    );
    this.playlistTracks = playlist.tracks;
    this.currentTrackId = playlist.currentlyPlayingTrack;
    this.loaded = true;
  }

  @Watch("search")
  onSearch() {
    if (!this.awaitingSearch) {
      setTimeout(() => {
        if (this.search && this.search.length > 0) {
          this.searchService
            .searchTracks(this.$store.state.code, this.search)
            .then((tracks) => {
              this.searchTracks = tracks;
            });
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

<style lang="scss" src="./Party.scss"></style>
