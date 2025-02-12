import axios from "axios";

type SpotifyToken = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

type Image = {
  url: string;
  width: number;
  height: number;
};

type ArtistsResult = {
  limit: number;
  offset: number;
  total: number;
  items: Array<ArtistResult>;
};

type ArtistResult = {
  id: string;
  followers: { href: string | null; total: number };
  href: string;
  name: string;
  images: Array<Image>;
};

type SearchArtistResponse = {
  artists: ArtistsResult;
};

type ArtistsResponse = {
  limit: number;
  offset: number;
  total: number;
  artists: Array<ArtistResult>;
};

const getSpotifyToken = async (): Promise<SpotifyToken | null> => {
  const TOKEN_URL = "https://accounts.spotify.com/api/token";
  try {
    const response = await axios.post(
      TOKEN_URL,
      { grant_type: "client_credentials" },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token: SpotifyToken = {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in,
    };

    return token;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const searchByArtistName = async (artistName: string) => {
  const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
  try {
    const token = await getSpotifyToken();
    if (!token) {
      throw new Error("Something wrong with retrieving token");
    }

    const response = await axios.get(
      `${SPOTIFY_SEARCH_URL}?q=${artistName}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const searchResult: SearchArtistResponse = response.data;

    const result: ArtistsResponse = {
      limit: searchResult.artists.limit,
      offset: searchResult.artists.offset,
      total: searchResult.artists.total,
      artists: searchResult.artists.items,
    };

    return result;
  } catch (e) {
    console.log(e);
  }
};
