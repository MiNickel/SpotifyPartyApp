import { Playlist } from "@/types/playlist";
import axios from "axios";

export interface IPlaylistService {
  getCurrentPlaylist(code: string): Promise<Playlist>;
  addTrack(code: string, id: string): Promise<void>;
  likeTrack(code: string, id: string): Promise<void>;
}

export class PlaylistService implements IPlaylistService {
  async likeTrack(code: string, id: string): Promise<void> {
    await axios.put(`${process.env.VUE_APP_SERVER_URL}/likeTrack`, {
      code,
      trackId: id,
    });
  }
  async getCurrentPlaylist(code: string) {
    const response = await axios.get(
      `${process.env.VUE_APP_SERVER_URL}/playlist`,
      {
        params: {
          code,
        },
      },
    );

    const playlist: Playlist = response.data;

    return playlist;
  }
  async addTrack(code: string, id: string): Promise<void> {
    await axios.post(`${process.env.VUE_APP_SERVER_URL}/addTrack`, {
      code,
      trackId: id,
    });
  }
}
