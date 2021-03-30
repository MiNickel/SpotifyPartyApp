import axios from "axios";

export interface IPlayerService {
  playTrack(
    code: string,
    trackId: string,
    adminId: string,
    deviceId: string,
  ): Promise<void>;
}

export class PlayerService implements IPlayerService {
  async playTrack(
    code: string,
    trackId: string,
    adminId: string,
    deviceId: string,
  ): Promise<void> {
    await axios.put(`${process.env.VUE_APP_SERVER_URL}/playTrack`, {
      code,
      trackId,
      adminId,
      deviceId,
    });
  }
}
