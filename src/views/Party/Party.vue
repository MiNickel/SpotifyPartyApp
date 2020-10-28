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
    ></v-text-field>
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

@Component({
  components: { PlaylistTracks, SearchTracks }
})
export default class Party extends Vue {
  private search = "";
  private searchTracks: unknown[] = [];
  private awaitingSearch = false;
  private playlistTracks: unknown[] = [];
  private currentTrackId = "";
  private loaded = false;
  private snackbar = false;
  private timeout = -1;
  private message = `Der Code lautet: ${this.$route.params.code}`;

  mounted() {
    this.loaded = false;
    if (this.$route.params.code) {
      this.$store.commit("setCode", this.$route.params.code);
    }
    if (this.$route.params.adminId) {
      this.$store.commit("resetTrackIds");
      this.checkAdminId();
    }
    this.getPlaylistTracks();
    this.getCurrentlyPlayingTrack();
  }

  setCurrentTrackId(id: string) {
    this.currentTrackId = id;
  }

  showSnackbar(message: string, timeInMs: number) {
    this.message = message;
    this.timeout = timeInMs;
    this.snackbar = true;
  }

  addTrack(id: string) {
    this.loaded = false;
    this.axios
      .get(`${process.env.VUE_APP_SERVER_URL}/addTrack`, {
        params: {
          code: this.$store.state.code,
          trackId: id
        }
      })
      .then(() => {
        this.$store.commit("addTrack", id);
        this.clearSearch();
        this.getPlaylistTracks();
      });
  }

  async checkAdminId() {
    const response = await this.axios.get(
      `${process.env.VUE_APP_SERVER_URL}/checkAdminId`,
      {
        params: {
          adminId: this.$route.params.adminId
        }
      }
    );
    if (response.status === 200) {
      this.snackbar = true;
      this.$store.commit("setAdminId", this.$route.params.adminId);
    }
  }

  clearSearch() {
    this.search = "";
    this.searchTracks = [];
  }

  private async getCurrentlyPlayingTrack() {
    const response = await this.axios.get(
      `${process.env.VUE_APP_SERVER_URL}/currentlyPlayingTrack`,
      {
        params: {
          code: this.$store.state.code
        }
      }
    );
    if (response.status === 200) {
      this.currentTrackId = response.data;
    }
  }

  private async getPlaylistTracks() {
    const response = await this.axios.get(
      `${process.env.VUE_APP_SERVER_URL}/playlist`,
      {
        params: {
          code: this.$store.state.code
        }
      }
    );
    this.playlistTracks = response.data.tracks;
    this.loaded = true;
  }

  @Watch("search")
  onSearch() {
    if (!this.awaitingSearch) {
      setTimeout(() => {
        if (this.search && this.search.length > 0) {
          this.axios
            .get(`${process.env.VUE_APP_SERVER_URL}/search`, {
              params: {
                code: this.$store.state.code,
                search: this.search
              }
            })
            .then(response => {
              this.searchTracks = response.data.tracks;
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
