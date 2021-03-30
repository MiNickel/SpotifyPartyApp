<template>
  <v-slider
    style="padding-top: 1rem"
    step="10"
    v-model="volume"
    prepend-icon="mdi-volume-high"
    thumb-label
    color="primary"
    dense
    messages="hallo"
  >
    <template v-slot:message="item">
      <div style="padding-left: 1rem">das ist ein test {{ item.message }}</div>
    </template>
  </v-slider>
</template>

<script lang="ts">
import { AuthService, IAuthService } from "@/services/auth.service";
import { Spotify } from "spotify-web-playback-sdk";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component
export default class Player extends Vue {
  volume = 50;
  private authService: IAuthService = new AuthService();
  player: Spotify.SpotifyPlayer | undefined;

  initialize() {
    if (!this.player) {
      this.player = new window.Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb: any) => {
          cb(this.$store.state.accessToken);
        },
        volume: 0.5,
      });

      this.player.addListener(
        "initialization_error",
        ({ message }: Spotify.Error) => {
          console.error(message);
        },
      );
      this.player.addListener(
        "authentication_error",
        ({ message }: { message: any }) => {
          console.error(message);
        },
      );
      this.player.addListener("account_error", ({ message }: Spotify.Error) => {
        console.error(message);
      });
      this.player.addListener(
        "playback_error",
        ({ message }: Spotify.Error) => {
          console.error(message);
        },
      );

      // Playback status updates
      this.player.addListener("player_state_changed", (state: any) => {
        console.log(state);
      });

      /* eslint-disable */
      this.player.addListener(
        "ready",
        ({ device_id }: Spotify.WebPlaybackInstance) => {
          console.log("Ready with Device ID", device_id);
          this.$store.commit("setDeviceId", device_id);
        },
      );

      this.player.addListener(
        "not_ready",
        ({ device_id }: Spotify.WebPlaybackInstance) => {
          console.log("Device ID has gone offline", device_id);
        },
      );
      /* eslint-enable */

      // Connect to the player!
      this.player.connect();
    }
  }

  initializePlayer() {
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = this.initialize;
    } else {
      this.initialize();
    }
  }

  async mounted() {
    const response = await this.authService.getAccessToken(
      this.$store.state.code,
    );
    if (response.status === 200) {
      this.$store.commit("setAccessToken", response.data.accessToken!);
      this.initializePlayer();
    }
  }

  @Watch("volume")
  onVolume() {
    console.log(this.volume / 100);
    this.player?.setVolume(this.volume / 100);
  }
}
</script>
