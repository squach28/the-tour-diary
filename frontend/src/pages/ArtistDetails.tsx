import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { Track } from "../types/Track";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ArtistDetails = () => {
  const params = useParams();
  const [artistDetails, setArtistDetails] = useState<{
    artist: Artist;
    topSongs: Array<Track>;
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
          <FontAwesomeIcon
            size="xl"
            onClick={() => navigateBack()}
            icon={faArrowLeft}
          />
          <img
            className="w-1/2 h-1/2 rounded-full mx-auto p-4"
            src={artistDetails.artist.images[0].url}
            alt=""
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
          <h2 className="text-2xl font-bold">Top Songs</h2>
          <ol className="flex flex-col gap-2 mt-4 list-decimal list-outside">
            {artistDetails.topSongs.map((song, index) => (
              <li
                className="flex gap-4 items-center p-2 border border-gray-300 shadow-md rounded-md"
                key={song.id}
              >
                <p className="text-lg font-bold">{index + 1}</p>
                <img
                  width="48"
                  height="48"
                  className="rounded-lg"
                  src={song.album.images[0].url}
                  alt={song.album.name}
                />
                <p>{song.name}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </>
  );
};

const Genre = ({ genre }: { genre: string }) => {
  return <li className="p-2 shadow-md">{genre}</li>;
};

export default ArtistDetails;
