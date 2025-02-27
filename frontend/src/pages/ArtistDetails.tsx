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
        <div className="p-4">
          <div className="flex justify-between">
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
          </div>
          <img
            className="w-1/2 h-1/2 rounded-full mx-auto p-4"
            src={artistDetails.artist.images[0].url}
            alt={artistDetails.artist.name}
          />
          <div className="text-center">
            <h1 className="text-center text-3xl font-bold">
              {artistDetails.artist.name}
            </h1>
            <ul className="w-3/4 flex justify-around gap-2 mx-auto py-2">
              {artistDetails.artist.genres.map((genre) => (
                <Genre key={genre} genre={genre} />
              ))}
            </ul>
          </div>
          <TopSongsList tracks={artistDetails.topSongs} />
          <FutureConcerts futureConcerts={artistDetails.futureConcerts} />
          <PastConcerts
            pastConcerts={artistDetails.pastConcerts}
            artistId={artistDetails.artist.id}
          />
        </div>
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
      className={`transition-transform duration-300 ${
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
      <h2 className="text-2xl font-bold">Top Songs</h2>
      <ol className="flex flex-col gap-2 mt-4 list-decimal list-outside">
        {tracks.map((track, rank) => (
          <TopSongListItem key={track.id} track={track} rank={rank} />
        ))}
      </ol>
    </>
  );
};

const TopSongListItem = ({ track, rank }: { track: Track; rank: number }) => {
  return (
    <li className="flex gap-4 items-center p-2 border border-gray-300 shadow-md rounded-md">
      <p className="text-lg font-bold">{rank + 1}</p>
      <img
        width="48"
        height="48"
        className="rounded-lg"
        src={track.album.images[0].url}
        alt={track.album.name}
      />
      <p>{track.name}</p>
    </li>
  );
};

const Genre = ({ genre }: { genre: string }) => {
  return <li className="p-2 shadow-md">{genre}</li>;
};

const FutureConcerts = ({
  futureConcerts,
}: {
  futureConcerts: Array<Concert>;
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold py-2">Future Concerts</h2>
      {futureConcerts.length > 0 ? (
        <>
          <ul className="flex flex-nowrap gap-8 overflow-x-scroll">
            {futureConcerts.map((concert) => (
              <ConcertListElement key={concert.id} concert={concert} />
            ))}
          </ul>
        </>
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
      <h2 className="text-2xl font-bold py-2">Past Concerts</h2>
      {pastConcerts.length > 0 ? (
        <>
          <ul className="flex flex-nowrap gap-8 overflow-x-scroll snap-x">
            {pastConcerts.map((concert) => (
              <ConcertListElement key={concert.id} concert={concert} />
            ))}
          </ul>
          <Link to={`/artists/${artistId}/concerts`}>See all concerts</Link>
        </>
      ) : (
        <p>No concerts yet performed by artist</p>
      )}
    </>
  );
};

const ConcertListElement = ({ concert }: { concert: Concert }) => {
  const formatDate = (date: string) => {
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(Number(year), Number(month), Number(day));
    return formattedDate.toLocaleDateString("en-US");
  };
  return (
    <li className="flex flex-col justify-center items-center gap-2 min-w-1/2 min-h-36 shadow-md p-2 text-center my-4 snap-center">
      <div>
        <span>{concert.venue.city.name}, </span>
        <span>{concert.venue.city.country.name}</span>
      </div>
      <p>{concert.venue.name}</p>

      <p>{formatDate(concert.eventDate)}</p>
    </li>
  );
};

export default ArtistDetails;
