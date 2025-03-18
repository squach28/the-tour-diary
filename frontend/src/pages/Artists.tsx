import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/api";
import { Artist } from "../types/Artist";

const Artists = () => {
  const [searchParams, _] = useSearchParams();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchArtists = async (query: string) => {
      try {
        setLoading(true);
        const response = await api.get(`/artists?query=${query}`);
        setArtists(response.data.artists.artists);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    const query = searchParams.get("query");

    if (query) {
      fetchArtists(query);
    }
  }, [searchParams]);

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {artists && !loading ? <ArtistsList artists={artists} /> : null}
    </>
  );
};

const ArtistsList = ({ artists }: { artists: Array<Artist> }) => {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold">Artists</h2>
      </div>
      <ul className={`flex flex-col gap-2`}>
        {artists.map((artist) => (
          <ArtistListItem key={artist.id} artist={artist} />
        ))}
      </ul>
    </div>
  );
};

const ArtistListItem = ({ artist }: { artist: Artist }) => {
  return (
    <li className="flex flex-col gap-2 p-4 rounded-md border border-gray-300 hover:bg-gray-200">
      <Link to={`/artists/${artist.id}`}>
        <div className="flex gap-4">
          <img
            width="25%"
            height="25%"
            className="rounded-full"
            src={artist.images.length > 0 ? artist.images[0].url : ""}
            alt={artist.name}
          />
          <div>
            <p className="font-bold text-xl">{artist.name}</p>
            <div className="flex gap-2">
              {artist.genres.map((genre) => (
                <span
                  className="text-xs rounded-sm bg-blue-200 p-2"
                  key={genre}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Artists;
