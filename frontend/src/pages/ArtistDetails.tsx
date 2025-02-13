import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";

const ArtistDetails = () => {
  const params = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getArtistById = async (id: string) => {
      try {
        const response = await api.get(`/artists/${id}`);
        const artistDetails = response.data;
        setArtist(artistDetails);
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
      {artist ? (
        <div>
          <img
            className="w-1/2 h-1/2 rounded-full mx-auto p-4"
            src={artist.images[0].url}
            alt=""
          />
          <div className="text-center">
            <h1 className="text-center text-3xl font-bold">{artist.name}</h1>
            <ul>
              {artist.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ArtistDetails;
