import axios from "axios";

export class SearchService {
  async search(code: string, search: string) {
    return await axios.get(`${process.env.VUE_APP_SERVER_URL}/search`, {
      params: {
        code,
        search,
      },
    });
  }
}
