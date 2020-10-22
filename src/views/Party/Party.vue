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
    <v-list
      class="list"
      v-if="
        searchTracks.length === 0 && playlistTracks && playlistTracks.length > 0
      "
    >
      <v-list-item v-for="track in playlistTracks" :key="track.track.id">
        <v-list-item-avatar>
          <v-img :src="track.track.album.images[2].url"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            :class="{
              'item__title--green': track.track.id === currentTrackId,
              'item__title--white': track.track.id !== currentTrackId
            }"
            v-text="track.track.name"
          >
          </v-list-item-title>
          <v-list-item-subtitle
            class="item__subtitle--grey"
            v-text="track.track.artists[0].name"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
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
          <v-btn @click="addTrack(track)" icon>
            <v-icon color="primary">mdi-plus-thick</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
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

  addTrack(track: any) {
    this.axios
      .get(`${process.env.VUE_APP_SERVER_URL}/addTrack`, {
        params: {
          code: this.$store.state.code,
          trackId: track.id
        }
      })
      .then(() => {
        this.clearSearch();
        this.getPlaylistTracks();
      });
  }

  clearSearch() {
    this.search = "";
    this.searchTracks = [];
  }

  mounted() {
    if (this.$route.params.code) {
      this.$store.commit("setCode", this.$route.params.code);
    }
    this.getPlaylistTracks();
    this.getCurrentlyPlayingTrack();
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
