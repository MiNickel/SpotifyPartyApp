<template>
  <v-container fluid>
    <v-text-field
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
    ></PlaylistTracks>
    <!--Liste für Tracks aus der Suche-->
    <SearchTracks
      :clearSearch="clearSearch"
      :getPlaylistTracks="getPlaylistTracks"
      :loaded="loaded"
      :searchTracks="searchTracks"
      :addTrack="addTrack"
    ></SearchTracks>
    <v-snackbar centered timeout="-1" v-model="snackbar">
      Der Code lautet: {{ $route.params.code }}
      <v-btn text color="primary" @click="snackbar = false">Schließen</v-btn>
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

  mounted() {
    this.loaded = false;
    if (this.$route.params.code) {
      this.$store.commit("setCode", this.$route.params.code);
    }
    if (this.$route.params.adminId) {
      this.checkAdminId();
    }
    this.getPlaylistTracks();
    this.getCurrentlyPlayingTrack();
  }

  setCurrentTrackId(id: string) {
    this.currentTrackId = id;
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

  private async likeTrack(id: string) {
    if (
      this.$store.state.trackIds.findIndex(
        (likedTrackId: string) => likedTrackId === id
      ) === -1
    ) {
      this.axios
        .get(`${process.env.VUE_APP_SERVER_URL}/likeTrack`, {
          params: {
            code: this.$store.state.code,
            trackId: id
          }
        })
        .then(() => {
          this.$store.commit("addTrack", id);
        });
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
