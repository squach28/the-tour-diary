import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { User } from "../types/User";
import { SearchBar } from "../components/SearchBar";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("query");

  useEffect(() => {
    const searchByQuery = async (query: string) => {
      try {
        setLoading(true);
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
  }, [searchParams]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search");
    setSearchParams((prev) => {
      return {
        ...prev,
        query,
      };
    });
  };

  return (
    <div>
      <div className="p-4 max-w-2xl mx-auto">
        <SearchBar onSubmit={onSubmit} value={query as string} />
        <h1 className="text-2xl font-bold text-center mb-4 border-0">
          Results for: {query}
        </h1>
        {loading ? <p>Loading...</p> : null}
        {searchResult && !loading ? (
          <>
            <ArtistsList
              artists={searchResult.artists.artists}
              query={query as string}
            />
            <UsersList users={searchResult.users} />
          </>
        ) : null}
      </div>
    </div>
  );
};

const ArtistsList = ({
  artists,
  query,
}: {
  artists: Array<Artist>;
  query: string;
}) => {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold">Artists</h2>
      </div>
      <ul className={`flex flex-col gap-2`}>
        {artists.map((artist) => (
          <ArtistListItem key={artist.id} artist={artist} />
        ))}
        <li className="flex flex-col items-center p-4 ">
          <Link to={`/artists?query=${query}`}>
            <div className="flex justify-center">
              <p className="font-bold">See all results</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

const ArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <li className="flex flex-col gap-2 p-4 rounded-md border border-gray-300 hover:bg-gray-200">
      <Link to={`/artists/${artist.id}`}>
        <div className="flex gap-4">
          <img
            width="25%"
            height="25%"
            className="rounded-full"
            src={artist.images.length > 0 ? artist.images[0].url : ""}
            alt={artist.name}
          />
          <div>
            <p className="font-bold text-xl">{artist.name}</p>
            <div className="flex gap-2">
              {artist.genres.map((genre) => (
                <span
                  className="text-xs rounded-sm bg-blue-200 p-2"
                  key={genre}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
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
      {users.length === 0 ? <p>No users found</p> : null}
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
