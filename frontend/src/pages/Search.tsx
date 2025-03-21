import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { User } from "../types/User";
import { SearchBar } from "../components/SearchBar";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

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
    <Box className="max-w-2xl mx-auto px-4 pb-2">
      <SearchBar onSubmit={onSubmit} value={query as string} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Results for: {query}
      </Typography>
      {loading ? <Typography>Loading...</Typography> : null}
      {searchResult && !loading ? (
        <>
          <ArtistsList
            artists={searchResult.artists.artists}
            query={query as string}
          />
          <UsersList users={searchResult.users} />
        </>
      ) : null}
    </Box>
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
    <Box className="max-w-2xl mx-auto pt-4">
      <Typography variant="h4">Artists</Typography>
      <List>
        {artists.map((artist, index) => (
          <>
            {index === 0 ? null : <Divider />}
            <ArtistListItem key={artist.id} artist={artist} />
            {index === artists.length - 1 ? null : <Divider />}
          </>
        ))}
        <ListItemButton
          component={Link}
          to={`/artists?query=${query}`}
          className="flex flex-col items-center p-4 "
        >
          <ListItemText>
            <Typography variant="button">See all results</Typography>
          </ListItemText>
        </ListItemButton>
      </List>
    </Box>
  );
};

const ArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <ListItemButton
      component={Link}
      to={`/artists/${artist.id}`}
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <Avatar
          src={artist.images.length > 0 ? artist.images[0].url : ""}
          alt={artist.name}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="h6">{artist.name}</Typography>}
      ></ListItemText>
    </ListItemButton>
  );
};

const UsersList = ({ users }: { users: Array<User> }) => {
  return (
    <Box className="max-w-2xl mx-auto pt-4">
      <Typography variant="h4">Users</Typography>
      <List>
        {users.map((user, index) => (
          <>
            {index === 0 ? null : <Divider />}
            <UserListItem key={user.id} user={user} />
            {index === users.length - 1 ? null : <Divider />}
          </>
        ))}
      </List>
      {users.length === 0 ? <Typography>No users found</Typography> : null}
    </Box>
  );
};

const UserListItem = ({ user }: { user: User }) => {
  return (
    <ListItemButton component={Link} to={`/profile/${user.id}`}>
      <ListItemText>{user.firstName + " " + user.lastName}</ListItemText>
    </ListItemButton>
  );
};

export default Search;
