<template>
  <v-list
    class="list"
    v-if="searchTracks.length === 0 && playlistTracks.length > 0"
  >
    <v-list-item v-for="item in playlistTracks" :key="item.track.id">
      <v-list-item-avatar>
        <v-img :src="item.track.album.images[2].url"></v-img>
      </v-list-item-avatar>
      <v-list-item-content
        @click="$store.state.adminId ? playTrack(item.track.id) : null"
      >
        <v-list-item-title
          :class="{
            'item__title--green': item.track.id === currentTrackId,
            'item__title--white': item.track.id !== currentTrackId,
          }"
          v-text="item.track.name"
        >
        </v-list-item-title>
        <v-list-item-subtitle
          class="item__subtitle--grey"
          v-text="item.track.artists[0].name"
        ></v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="!$store.state.trackIds.includes(item.track.id)">
        <v-btn @click="likeTrack(item.track.id)" icon
          ><v-icon color="secondary">mdi-heart-outline</v-icon></v-btn
        >
      </v-list-item-action>
      <v-list-item-icon v-if="$store.state.trackIds.includes(item.track.id)">
        <v-btn icon><v-icon color="secondary">mdi-heart</v-icon> </v-btn>
      </v-list-item-icon>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PlaylistTracks extends Vue {
  @Prop() playlistTracks!: unknown[];
  @Prop() searchTracks!: unknown[];
  @Prop() currentTrackId!: number;
  @Prop() adminId!: string | undefined;

  private async playTrack(id: string) {
    this.axios
      .put(`${process.env.VUE_APP_SERVER_URL}/playTrack`, {
        code: this.$store.state.code,
        trackId: id,
        adminId: this.$store.state.adminId,
      })
      .then(() => {
        this.$emit("setCurrentTrackId", id);
      })
      .catch(() => {
        this.$emit(
          "showSnackbar",
          "Stellen Sie sicher, dass im Hintergrund ein Song über Spotify läuft.",
          6000,
        );
      });
  }

  private async likeTrack(id: string) {
    if (
      this.$store.state.trackIds.findIndex(
        (likedTrackId: string) => likedTrackId === id,
      ) === -1
    ) {
      this.axios
        .put(`${process.env.VUE_APP_SERVER_URL}/likeTrack`, {
          code: this.$store.state.code,
          trackId: id,
        })
        .then(() => {
          this.$store.commit("addTrack", id);
        });
    }
  }
}
</script>
<style src="./Tracks.scss" lang="scss"></style>
