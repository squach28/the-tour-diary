import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Concert } from "../types/Concert";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

type ConcertsResponse = {
  itemsPerPage: number;
  page: number;
  setlist: Array<Concert>;
  total: number;
  type: string;
};

const Concerts = () => {
  const params = useParams();
  const [concerts, setConcerts] = useState<Array<Concert>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchConcertsByArtistId = async (artistId: string) => {
      try {
        const response = await api.get(`/artists/${artistId}/concerts`);
        const concerts: ConcertsResponse = response.data;
        setConcerts(concerts.setlist);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    const { id } = params;

    if (id) {
      fetchConcertsByArtistId(id);
    }
  }, []);
  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {concerts ? (
        <ul>
          {concerts.map((concert) => (
            <ConcertListElement key={concert.id} concert={concert} />
          ))}
        </ul>
      ) : null}
    </>
  );
};

const ConcertListElement = ({ concert }: { concert: Concert }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string) => {
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(Number(year), Number(month), Number(day));
    return formattedDate.toLocaleDateString("en-US");
  };

  const handleAttendedClicked = () => {
    try {
      setLoading(true);
      if (user) {
        if (concert.attended) {
          api.delete(`/users/${user.id}/concerts`, {
            data: { concertId: concert.id },
          });
        } else {
          api.post(`/users/${user.id}/concerts`, {
            data: { concertId: concert.id },
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex flex-col justify-center items-center gap-2 min-w-1/2 min-h-36 shadow-md p-2 text-center my-4">
      <div>
        <span>{concert.venue.city.name}, </span>
        <span>{concert.venue.city.country.name}</span>
      </div>
      <p>{concert.venue.name}</p>

      <p>{formatDate(concert.eventDate)}</p>
      <button
        className={`px-4 py-3 border-1 rounded-md hover:shadow-md hover:cursor-pointer`}
        onClick={handleAttendedClicked}
        disabled={loading}
      >
        {concert.attended && !loading ? "Attended" : "Didn't attend"}
        {loading ? "Loading..." : null}
      </button>
    </li>
  );
};

export default Concerts;
