import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { Track } from "../types/Track";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Concert } from "../types/Concert";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as filledHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

const ArtistDetails = () => {
  const params = useParams();
  const [artistDetails, setArtistDetails] = useState<{
    artist: Artist;
    topSongs: Array<Track>;
    futureConcerts: Array<Concert>;
    pastConcerts: Array<Concert>;
    favorite: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getArtistById = async (id: string) => {
      try {
        const response = await api.get(`/artists/${id}`);
        setArtistDetails(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      const artistId = params.id;
      getArtistById(artistId);
    }
  }, []);

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {artistDetails ? (
        <Box className="p-4">
          <Box className="flex justify-between">
            <FontAwesomeIcon
              className="hover:cursor-pointer"
              size="xl"
              onClick={() => navigateBack()}
              icon={faArrowLeft}
            />
            <FavoriteIcon
              favorite={artistDetails.favorite}
              artistId={artistDetails.artist.id}
            />
          </Box>
          <Box className="max-w-lg mx-auto">
            <Avatar
              src={artistDetails.artist.images[0].url}
              alt={artistDetails.artist.name}
              sx={{
                width: "150px",
                height: "150px",
                marginX: "auto",
              }}
            />
            <Box className="text-center">
              <Typography variant="h3" sx={{ py: 2 }}>
                {artistDetails.artist.name}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center", py: 2 }}
              >
                <Typography>Genres: </Typography>
                {artistDetails.artist.genres.map((genre) => (
                  <Genre key={genre} genre={genre} />
                ))}
              </Stack>
            </Box>
            <TopSongsList tracks={artistDetails.topSongs} />
            <FutureConcerts futureConcerts={artistDetails.futureConcerts} />
            <PastConcerts
              pastConcerts={artistDetails.pastConcerts}
              artistId={artistDetails.artist.id}
            />
          </Box>
        </Box>
      ) : null}
    </>
  );
};

const FavoriteIcon = ({
  favorite,
  artistId,
}: {
  favorite: boolean;
  artistId: string;
}) => {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFavoriteClicked = async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      if (user === null) {
        return;
      }
      if (favorite) {
        await api.delete(`/users/${user.id}/artists/${artistId}`);
        setIsFavorite((prev) => !prev);
      } else {
        await api.post(`/users/${user.id}/artists`, {
          artistId,
        });
        setIsFavorite((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FontAwesomeIcon
      className={`transition-transform duration-300 cursor-pointer ${
        isFavorite ? " text-red-500 scale-125" : "text-black scale-100"
      }`}
      size="xl"
      icon={isFavorite ? filledHeart : emptyHeart}
      onClick={handleFavoriteClicked}
    />
  );
};

const TopSongsList = ({ tracks }: { tracks: Array<Track> }) => {
  return (
    <>
      <Typography variant="h5" className="font-bold">
        Top Songs
      </Typography>
      <List>
        {tracks.map((track, rank) => (
          <Box key={track.id}>
            {rank === 0 ? <Divider /> : null}
            <TopSongListItem track={track} rank={rank} />
            <Divider />
          </Box>
        ))}
      </List>
    </>
  );
};

const TopSongListItem = ({ track, rank }: { track: Track; rank: number }) => {
  return (
    <ListItem className="flex gap-2 items-center p-2">
      <Typography variant="h6">{rank + 1}</Typography>
      <Avatar
        variant="rounded"
        src={track.album.images[0].url}
        alt={track.album.name}
      />
      <ListItemText primary={track.name}></ListItemText>
    </ListItem>
  );
};

const Genre = ({ genre }: { genre: string }) => {
  return <Chip label={genre} />;
};

const FutureConcerts = ({
  futureConcerts,
}: {
  futureConcerts: Array<Concert>;
}) => {
  return (
    <>
      <Typography variant="h5" className="font-bold py-2">
        Future Concerts
      </Typography>
      {futureConcerts.length > 0 ? (
        <List>
          {futureConcerts.map((concert, index) => (
            <Box key={concert.id}>
              {index === 0 ? <Divider /> : null}
              <ConcertListElement key={concert.id} concert={concert} />
              <Divider />
            </Box>
          ))}
        </List>
      ) : (
        <p>No upcoming concerts</p>
      )}
    </>
  );
};

const PastConcerts = ({
  pastConcerts,
  artistId,
}: {
  pastConcerts: Array<Concert>;
  artistId: string;
}) => {
  return (
    <>
      <Typography variant="h5">Past Concerts</Typography>
      {pastConcerts.length > 0 ? (
        <>
          <List>
            {pastConcerts.map((concert, index) => (
              <>
                {index === 0 ? <Divider /> : null}
                <ConcertListElement key={concert.id} concert={concert} />
                <Divider />
              </>
            ))}
          </List>
          <Link to={`/artists/${artistId}/concerts`}>See all concerts</Link>
        </>
      ) : (
        <p>No concerts yet performed by artist</p>
      )}
    </>
  );
};

const ConcertListElement = ({ concert }: { concert: Concert }) => {
  const [day, month, year] = concert.eventDate.split("-");
  const formattedDate = new Date(Number(year), Number(month), Number(day));

  const getConcertMonth = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
    };
    return formattedDate.toLocaleDateString("en-US", options);
  };

  const getConcertDay = () => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
    };
    return formattedDate.toLocaleDateString("en-US", options);
  };

  const getVenueLocation = () => {
    return concert.venue.city.name + " " + concert.venue.city.country.name;
  };

  return (
    <ListItemButton
      component={Link}
      to={`/concerts/${concert.id}`}
      alignItems="flex-start"
    >
      <Stack spacing={1} sx={{ px: 2 }}>
        <Typography variant="h6">{getConcertMonth()}</Typography>
        <Typography variant="h6">{getConcertDay()}</Typography>
      </Stack>
      <Divider orientation="vertical" />
      <ListItemText
        primary={getVenueLocation()}
        secondary={concert.venue.name}
        sx={{ m: 0 }}
      ></ListItemText>
    </ListItemButton>
  );
};

export default ArtistDetails;
