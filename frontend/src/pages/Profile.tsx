import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/api";
import { Concert } from "../types/Concert";
import { User } from "../types/User";
import { Artist } from "../types/Artist";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async (id: string) => {
      setLoading(true);
      try {
        const user = await api.get(`/users/${id}`);
        setUserData(user.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    if (userId === undefined && user) {
      fetchUserData(user.id);
    } else {
      fetchUserData(userId as string);
    }
  }, []);

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {userData ? (
        <div className="p-4">
          <UserDetails user={userData} />
          <PastConcerts pastConcerts={userData.concerts} />
          <FavoriteArtistsList artists={userData.favoriteArtists} />
        </div>
      ) : null}
    </>
  );
};

const UserDetails = ({ user }: { user: User }) => {
  return (
    <div className="w-1/2 text-center mx-auto p-2 mt-4">
      <span className="text-3xl font-bold">
        {user.firstName} {user.lastName}
      </span>
    </div>
  );
};

const PastConcerts = ({ pastConcerts }: { pastConcerts: Array<Concert> }) => {
  return (
    <>
      <h2 className="text-2xl font-bold py-2">I went to...</h2>
      {pastConcerts.length > 0 ? (
        <>
          <ul className="flex flex-nowrap gap-8 overflow-x-scroll snap-x">
            {pastConcerts.map((concert) => (
              <ConcertListElement key={concert.id} concert={concert} />
            ))}
          </ul>
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

const FavoriteArtistsList = ({ artists }: { artists: Array<Artist> }) => {
  return (
    <>
      <h2 className="font-bold text-3xl">Favorite Artists</h2>
      <ul className="flex flex-col">
        {artists.map((artist) => (
          <FavoriteArtistListItem key={artist.id} artist={artist} />
        ))}
      </ul>
    </>
  );
};

const FavoriteArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <li>
      <img src={artist.images[0].url ?? ""} alt={artist.name} />
      <p>{artist.name}</p>
    </li>
  );
};

export default Profile;
