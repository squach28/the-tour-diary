import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../api/api";

type ArtistResult = {
  mbid: string;
  name: string;
  url: string;
};

const Search = () => {
  const [searchParams, _] = useSearchParams();
  const [artists, setArtists] = useState<Array<ArtistResult>>([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("query");

  useEffect(() => {
    const searchByArtist = async (artistName: string) => {
      try {
        const response = await api.get(`search/artists?artistName=${query}`);
        setArtists(response.data.artist);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      searchByArtist(query);
    }
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {artists.length > 0
          ? artists.map((artist) => <li key={artist.mbid}>{artist.name}</li>)
          : null}
      </ul>
    </div>
  );
};

export default Search;
