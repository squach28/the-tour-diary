import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";
import { Track } from "../types/Track";

const ArtistDetails = () => {
  const params = useParams();
  const [artistDetails, setArtistDetails] = useState<{
    artist: Artist;
    topSongs: Array<Track>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {artistDetails ? (
        <div className="p-4">
          <img
            className="w-1/2 h-1/2 rounded-full mx-auto p-4"
            src={artistDetails.artist.images[0].url}
            alt=""
          />
          <div className="text-center">
            <h1 className="text-center text-3xl font-bold">
              {artistDetails.artist.name}
            </h1>
            <ul>
              {artistDetails.artist.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          </div>
          <ol className="list-decimal list-inside">
            {artistDetails.topSongs.map((song) => (
              <li key={song.id}>{song.name}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </>
  );
};

export default ArtistDetails;
