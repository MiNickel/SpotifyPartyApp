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
    <!--Liste für Tracks der Playlist-->
    <div
      v-if="playlistTracks.length === 0 && searchTracks.length === 0 && !loaded"
      class="text-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-list
      class="list"
      v-if="searchTracks.length === 0 && playlistTracks.length > 0"
    >
      <v-list-item v-for="item in playlistTracks" :key="item.track.id">
        <v-list-item-avatar>
          <v-img :src="item.track.album.images[2].url"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            :class="{
              'item__title--green': item.track.id === currentTrackId,
              'item__title--white': item.track.id !== currentTrackId
            }"
            v-text="item.track.name"
          >
          </v-list-item-title>
          <v-list-item-subtitle
            class="item__subtitle--grey"
            v-text="item.track.artists[0].name"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action
          v-if="!$store.state.trackIds.includes(item.track.id)"
        >
          <v-btn @click="likeTrack(item.track.id)" icon
            ><v-icon color="secondary">mdi-heart</v-icon></v-btn
          >
        </v-list-item-action>
        <v-list-item-icon v-if="$store.state.trackIds.includes(item.track.id)">
          <v-btn icon><v-icon color="primary">mdi-heart</v-icon></v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <!--Liste für Tracks aus der Suche-->
    <v-list class="list" v-if="searchTracks.length > 0">
      <v-list-item v-for="track in searchTracks" :key="track.id">
        <v-list-item-avatar>
          <v-img :src="track.album.images[2].url"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="item__title--white" v-text="track.name">
          </v-list-item-title>
          <v-list-item-subtitle
            class="item__subtitle--grey"
            v-text="track.artists[0].name"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="addTrack(track.id)" icon>
            <v-icon color="primary">mdi-plus-thick</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-snackbar centered timeout="-1" v-model="snackbar">
      Der Code lautet: {{ $route.params.code }}
      <v-btn text color="primary" @click="snackbar = false">Schließen</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Party extends Vue {
  private search = "";
  private searchTracks: unknown[] = [];
  private awaitingSearch = false;
  private playlistTracks: unknown[] = [];
  private currentTrackId = 0;
  private loaded = false;
  private snackbar = false;

  mounted() {
    this.loaded = false;
    if (this.$route.params.code) {
      this.$store.commit("setCode", this.$route.params.code);
    }
    if (this.$route.params.new) {
      this.snackbar = true;
    }
    this.getPlaylistTracks();
    this.getCurrentlyPlayingTrack();
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

  private async likeTrack(id: string) {
    console.log(id);
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
              console.log(response.data.tracks);
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
