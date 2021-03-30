import axios, { AxiosResponse } from "axios";

export interface IAuthService {
  checkAdminId(
    adminId: string,
  ): Promise<AxiosResponse<{ accessToken?: string }>>;
  checkCode(code: string): Promise<AxiosResponse<any>>;
  getAccessToken(
    code: string,
  ): Promise<AxiosResponse<{ accessToken?: string }>>;
}

export class AuthService implements IAuthService {
  async getAccessToken(
    code: string,
  ): Promise<AxiosResponse<{ accessToken?: string }>> {
    const response: AxiosResponse<{ accessToken?: string }> = await axios.get(
      `${process.env.VUE_APP_SERVER_URL}/getAccessToken`,
      {
        params: {
          code,
        },
      },
    );
    return response;
  }
  async checkCode(code: string): Promise<AxiosResponse<any>> {
    return axios.get(`${process.env.VUE_APP_SERVER_URL}/checkCode`, {
      params: {
        code,
      },
    });
  }
  async checkAdminId(
    adminId: string,
  ): Promise<AxiosResponse<{ accessToken?: string }>> {
    return await axios.get(`${process.env.VUE_APP_SERVER_URL}/checkAdminId`, {
      params: {
        adminId,
      },
    });
  }
}
