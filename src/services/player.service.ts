import axios from "axios";

export class PlayerService {
  async playTrack(code: string, adminId: string, trackId: string) {
    return await axios.put(`${process.env.VUE_APP_SERVER_URL}/playTrack`, {
      code,
      trackId,
      adminId,
    });
  }

  async likeTrack(code: string, trackId: string, nickname: string) {
    return await axios.put(`${process.env.VUE_APP_SERVER_URL}/likeTrack`, {
      code,
      trackId,
      nickname,
    });
  }
}
