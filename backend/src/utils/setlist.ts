import { Concert } from "types/Concert";
import axios from "axios";

const SETLIST_API_URL = "https://api.setlist.fm/rest/1.0";

type ArtistResult = {
  mbid: string;
  tmid: string;
  name: string;
  url: string;
};

const request = (url: string) => {
  return axios.get(url, {
    headers: {
      Accept: "application/json",
      "x-api-key": process.env.SETLIST_API_KEY,
    },
  });
};

export const fetchConcertById = async (
  concertId: string
): Promise<Concert | null> => {
  try {
    const result = await request(`${SETLIST_API_URL}/setlist/${concertId}`);

    return result.data;
  } catch (e) {
    return null;
  }
};

export const fetchConcertsByArtistId = async (
  artistId: string
): Promise<any | null> => {
  try {
    const result = await request(
      `${SETLIST_API_URL}/artist/${artistId}/setlists`
    );
    return result.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
