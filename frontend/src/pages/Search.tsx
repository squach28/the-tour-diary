import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { User } from "../types/User";

type SearchResult = {
  artists: ArtistSearchResult;
  users: Array<User>;
};

type ArtistSearchResult = {
  offset: number;
  total: number;
  limit: number;
  artists: Array<Artist>;
};

const Search = () => {
  const [searchParams, _] = useSearchParams();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("query");

  useEffect(() => {
    const searchByQuery = async (query: string) => {
      try {
        const response = await api.get(`search?query=${query}`);
        setSearchResult(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      searchByQuery(query);
    }
  }, []);

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4 border-0">
          Results for: {query}
        </h1>
        {loading ? <p>Loading...</p> : null}
        {searchResult ? (
          <>
            <ArtistsList artists={searchResult.artists.artists} />
            <UsersList users={searchResult.users} />
          </>
        ) : null}
      </div>
    </div>
  );
};

const GenreTag = ({ genre }: { genre: string }) => {
  return <li className="bg-green-200 px-2 py-1 rounded-md">{genre}</li>;
};

const ArtistsList = ({ artists }: { artists: Array<Artist> }) => {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <h2 className="text-2xl font-bold">Artists</h2>
      <ul className="flex flex-col">
        {artists.map((artist) => (
          <ArtistListItem key={artist.id} artist={artist} />
        ))}
      </ul>
    </div>
  );
};

const ArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <li className="flex flex-col gap-2 p-4 rounded-md shadow-lg hover:shadow-xl">
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

const UsersList = ({ users }: { users: Array<User> }) => {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <h2 className="text-2xl font-bold">Users</h2>
      <ul className="flex flex-col">
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
};

const UserListItem = ({ user }: { user: User }) => {
  return (
    <li>
      {user.firstName} {user.lastName}
    </li>
  );
};

export default Search;
