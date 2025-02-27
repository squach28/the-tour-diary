import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Concert } from "../types/Concert";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";

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
  const { user } = useAuth();

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

  const toggleConcertAttendance = async (concert: Concert) => {
    try {
      if (user) {
        if (concert.attended) {
          await api.delete(`/users/${user.id}/concerts`, {
            data: { concertId: concert.id },
          });
        } else {
          await api.post(`/users/${user.id}/concerts`, {
            data: { concertId: concert.id },
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setConcerts((prev) =>
        prev.map((item) =>
          item.id === concert.id ? { ...item, attended: !item.attended } : item
        )
      );
    }
  };

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {concerts ? (
        <ul>
          {concerts.map((concert) => (
            <ConcertListElement
              key={concert.id}
              concert={concert}
              toggleConcertAttendance={toggleConcertAttendance}
            />
          ))}
        </ul>
      ) : null}
    </>
  );
};

const ConcertListElement = ({
  concert,
  toggleConcertAttendance,
}: {
  concert: Concert;
  toggleConcertAttendance: (concert: Concert) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string) => {
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(Number(year), Number(month), Number(day));
    return formattedDate.toLocaleDateString("en-US");
  };

  const handleMarkAttendanceClicked = () => {
    try {
      setLoading(true);
      toggleConcertAttendance(concert);
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
      <div className="flex gap-2 items-center">
        <FontAwesomeIcon
          className={`${concert.attended ? "text-green-500" : "text-red-500"}`}
          icon={concert.attended ? faCheck : faX}
          size="lg"
        />
        <span
          className={`rounded-md hover:shadow-md hover:cursor-pointer ${
            concert.attended ? "text-green-500" : "text-red-500"
          }`}
        >
          {concert.attended && !loading ? "Attended" : "Didn't attend"}
        </span>
      </div>
      <button
        className={`px-6 py-3 ${
          concert.attended ? "bg-red-400" : "bg-blue-400"
        } text-white rounded-md font-bold`}
        disabled={loading}
        onClick={handleMarkAttendanceClicked}
      >
        {concert.attended ? "Mark as not attended" : "Mark as attended"}
      </button>
    </li>
  );
};

export default Concerts;
