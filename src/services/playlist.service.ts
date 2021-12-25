import axios from "axios";

export class PlaylistService {
  async getPlaylistTracks(code: string) {
    return await axios.get(`${process.env.VUE_APP_SERVER_URL}/playlist`, {
      params: {
        code,
      },
    });
  }

  async addTrack(code: string, trackId: string, nickname: string) {
    return await axios.post(`${process.env.VUE_APP_SERVER_URL}/addTrack`, {
      code,
      trackId,
      nickname,
    });
  }

  async getUsers(code: string) {
    return await axios.get(`${process.env.VUE_APP_SERVER_URL}/users`, {
      params: { code },
    });
  }
}
