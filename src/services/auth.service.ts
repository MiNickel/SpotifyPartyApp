import axios from "axios";

export class AuthService {
  async checkAdminId(adminId: string) {
    return await axios.get(`${process.env.VUE_APP_SERVER_URL}/checkAdminId`, {
      params: {
        adminId,
      },
    });
  }
  async checkCode(partyCode: string, nickname: string) {
    return await axios.get(`${process.env.VUE_APP_SERVER_URL}/checkCode`, {
      params: {
        code: partyCode,
        nickname,
      },
    });
  }
}
