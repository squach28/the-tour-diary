import axios from "axios";
import { Artist } from "../types/Artist";

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
  genres: Array<string>;
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

type Track = {
  name: string;
};

type TopSongsResponse = {
  tracks: Array<Track>;
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

const request = async (
  url: string
): Promise<axios.AxiosResponse<any, any> | null> => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const searchByArtistName = async (
  artistName: string,
  limit: number = 10
) => {
  const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
  try {
    const response = await request(
      `${SPOTIFY_SEARCH_URL}?q=${artistName}&type=artist&limit=${limit}`
    );

    if (!response) {
      throw new Error("Error occurred with Spotify API");
    }

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

export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  const SPOTIFY_ARTIST_URL = "https://api.spotify.com/v1/artists";
  try {
    const response = await request(`${SPOTIFY_ARTIST_URL}/${id}`);

    if (!response) {
      throw new Error("Error occurred with Spotify API");
    }
    const artist: Artist = response.data;

    return artist;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fetchArtistTopSongsById = async (
  id: string
): Promise<TopSongsResponse | null> => {
  try {
    const SPOTIFY_ARTIST_TOP_SONGS_URL = `https://api.spotify.com/v1/artists/${id}/top-tracks`;
    const response = await request(SPOTIFY_ARTIST_TOP_SONGS_URL);
    if (!response) {
      throw new Error("Error occurred with Spotify API");
    }

    const tracks = response.data.tracks.slice(0, 5);
    const topSongs: TopSongsResponse = {
      tracks,
    };

    return topSongs;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fetchAlbumByArtistId = async (artistId: string) => {
  try {
    const SPOTIFY_ALBUM_URL = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=1`;
    const response = await request(SPOTIFY_ALBUM_URL);
    if (!response) {
      throw new Error("Error occurred with Spotify API");
    }

    const data = response.data;

    return {
      artistId,
      album: data.items[0],
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};
