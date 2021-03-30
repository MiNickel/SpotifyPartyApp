import axios from "axios";
import { SpotifyApi } from "spotify-api";

export interface ISearchService {
  searchTracks(
    code: string,
    search: string,
  ): Promise<SpotifyApi.TrackObjectFull[]>;
}

export class SearchService implements ISearchService {
  async searchTracks(
    code: string,
    search: string,
  ): Promise<SpotifyApi.TrackObjectFull[]> {
    const response = await axios.get(
      `${process.env.VUE_APP_SERVER_URL}/search`,
      {
        params: {
          code,
          search,
        },
      },
    );
    const tracks: SpotifyApi.TrackObjectFull[] = response.data.tracks;
    return tracks;
  }
}
