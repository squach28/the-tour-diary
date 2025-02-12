import { Concert } from "types/Concert";
import axios from "axios";

const SETLIST_API_URL = "https://api.setlist.fm/rest/1.0";

type ArtistResult = {
  mbid: string;
  tmid: string;
  name: string;
  url: string;
};

export const fetchConcertById = async (
  concertId: string
): Promise<Concert | null> => {
  try {
    const result = await axios.get(`${SETLIST_API_URL}/setlist/${concertId}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": process.env.SETLIST_API_KEY,
      },
    });
    return result.data;
  } catch (e) {
    return null;
  }
};
