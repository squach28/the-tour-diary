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
        <ul className="max-w-2xl mx-auto grid grid-cols-1 place-items-center pt-4 gap-10">
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

const GenreTag = ({ genre }: { genre: string }) => {
  return <li className="bg-green-200 px-2 py-1 rounded-md">{genre}</li>;
};

const ArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <li className="w-3/4 flex flex-col gap-2 p-4 rounded-md shadow-lg hover:shadow-xl">
      <Link to={`/artists/${artist.id}`}>
        <div className="flex gap-4">
          <img
            width="50px"
            height="50px"
            className="rounded-full"
            src={artist.images.length > 0 ? artist.images[0].url : ""}
            alt={artist.name}
          />
          <span className="text-center font-bold text-xl">{artist.name}</span>
        </div>
        <ul className="flex flex-wrap gap-2 py-2">
          {artist.genres.map((genre) => (
            <GenreTag key={genre} genre={genre} />
          ))}
        </ul>
      </Link>
    </li>
  );
};
export default Search;
