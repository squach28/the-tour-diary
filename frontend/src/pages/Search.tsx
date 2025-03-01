import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { User } from "../types/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
  const [index, setIndex] = useState(0);

  const calculateOffset = () => {
    if (index / 2 === 1) {
      return "full";
    }
    return `${index}/2`;
  };

  const decrementOffset = () => {
    if (index === 0) {
      return;
    }
    setIndex((prev) => prev - 1);
  };

  const incrementOffset = () => {
    if (index === artists.length - 1) {
      return;
    }
    setIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 overflow-x-hidden">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold">Artists</h2>
        <div className="flex gap-6 ml-auto">
          <FontAwesomeIcon
            className={index === 0 ? "text-gray-500" : "text-black"}
            size="xl"
            icon={faArrowLeft}
            onClick={decrementOffset}
          />
          <FontAwesomeIcon
            className={
              index === artists.length - 1 ? "text-gray-500" : "text-black"
            }
            size="xl"
            icon={faArrowRight}
            onClick={incrementOffset}
          />
        </div>
      </div>
      <ul className={`flex transition-all -translate-x-${calculateOffset()}`}>
        {artists.map((artist) => (
          <ArtistListItem key={artist.id} artist={artist} />
        ))}
        <li className=" min-w-1/2 min-h-48 flex flex-col items-center p-4 ">
          <Link to={`/artists?query=${query}`}>
            <div className="flex justify-center items-center w-[150px] h-[150px] max-w-[150px] max-h-[150px] border rounded-full">
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
    <li className="min-w-1/2 min-h-48 flex flex-col gap-2 p-4 rounded-md hover:bg-gray-200">
      <Link to={`/artists/${artist.id}`}>
        <div className="flex flex-col gap-4">
          <img
            width="150px"
            height="150px"
            className="max-w-[150px] max-h-[150px] rounded-full"
            src={artist.images.length > 0 ? artist.images[0].url : ""}
            alt={artist.name}
          />
          <span className="font-bold text-xl">{artist.name}</span>
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
