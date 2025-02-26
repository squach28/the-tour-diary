import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";

type ArtistSearchResult = {
  offset: number;
  total: number;
  limit: number;
  artists: Array<Artist>;
};

const Search = () => {
  const [searchParams, _] = useSearchParams();
  const [searchResult, setSearchResult] = useState<ArtistSearchResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("query");

  useEffect(() => {
    const searchByArtist = async (artistName: string) => {
      try {
        const response = await api.get(
          `search/artists?artistName=${artistName}`
        );
        setSearchResult(response.data);
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
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4 border-0">
          Results for: {query}
        </h1>
        {loading ? <p>Loading...</p> : null}
        <ul className="flex flex-col items-center pt-4 gap-10">
          {searchResult
            ? searchResult.artists.map((artist) => (
                <ArtistListItem key={artist.id} artist={artist} />
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

const ArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <li className="w-3/4 flex flex-col gap-2 p-4 rounded-md shadow-lg">
      <Link to={`/artists/${artist.id}`}>
        <img
          className="rounded-md"
          src={artist.images.length > 0 ? artist.images[0].url : ""}
          width="100%"
          alt={artist.name}
        />
        <p className="text-center font-bold text-2xl">{artist.name}</p>
      </Link>
    </li>
  );
};
export default Search;
