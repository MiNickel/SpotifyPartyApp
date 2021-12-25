<template>
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
          <v-icon color="secondary">mdi-heart-outline</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SpotifyApi } from "node_modules/@types/spotify-api";

@Component
export default class SearchTracks extends Vue {
  @Prop() searchTracks!: SpotifyApi.TrackObjectFull[];
  @Prop() clearSearch!: () => void;
  @Prop() getPlaylistTracks!: () => void;
  @Prop() loaded!: boolean;
  @Prop() addTrack!: (id: string) => void;
}
</script>
<style src="./Tracks.css" lang="css"></style>
