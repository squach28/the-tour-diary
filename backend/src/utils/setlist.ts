import { Concert } from "types/Concert";
import axios from "axios";

const SETLIST_API_URL = "https://api.setlist.fm/rest/1.0";

export const getArtistsByName = async (
  artistName: string
): Promise<Array<Concert> | null> => {
  try {
    const result = await axios.get(
      `${SETLIST_API_URL}/search/artists?artistName=${artistName}`,
      {
        headers: {
          "x-api-key": process.env.SETLIST_API_KEY,
        },
      }
    );
  } catch (e) {
    return null;
  }
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
