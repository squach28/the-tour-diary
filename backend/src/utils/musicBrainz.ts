import axios from "axios";

type MusicBrainzArtist = {
  id: string;
  name: string;
};

export const getArtistByQuery = async (query: string): Promise<null> => {
  try {
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fetchArtistByName = async (
  artistName: string
): Promise<MusicBrainzArtist | null> => {
  try {
    const MUSICBRAINZ_ARTIST_SEARCH_URL = `https://musicbrainz.org/ws/2/artist?query=artist:${artistName}&limit=1`;
    const response = await axios.get(MUSICBRAINZ_ARTIST_SEARCH_URL);
    return response.data.artists[0] ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fetchArtistByAlbumNameAndArtistName = async (
  albumName: string,
  artistName: string
) => {
  try {
    const MUSICBRAINZ_ALBUM_URL = `https://musicbrainz.org/ws/2/release?query=${albumName}%20artistname:${artistName}&limit=5`;
    const response = await axios.get(MUSICBRAINZ_ALBUM_URL);
  } catch (e) {
    console.log(e);
  }
};
