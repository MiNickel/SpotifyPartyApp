import { SpotifyApi } from "spotify-api";

export type Playlist = {
  tracks: SpotifyApi.PlaylistTrackObject[];
  currentlyPlayingTrack?: string;
};
