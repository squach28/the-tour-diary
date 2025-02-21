import express from "express";
import { fetchArtistById, fetchArtistTopSongsById } from "../utils/spotify";
import { Artist } from "../types/Artist";
import { db } from "../db/db";
import { queries as artistQueries } from "../db/queries/artists";
import { fetchConcertsByArtistId } from "../utils/setlist";
import { Concert } from "../types/Concert";

interface RequestWithArtist extends express.Request {
  artist: Artist;
}

export const getArtistById = async (
  req: RequestWithArtist,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (id === undefined) {
      res.status(400).json({ message: "ID is missing in params" });
      return;
    }

    const artist = req.artist;

    if (artist === undefined) {
      res.status(404).json({ message: "Artist not found" });
      return;
    }
    const tracks = await fetchArtistTopSongsById(id);
    const topSongs = tracks.tracks;
    const artistInfo = await db.query(artistQueries.getArtistBySpotifyId, [id]);
    const { mbid } = artistInfo.rows[0];
    const concertsResponse = await fetchConcertsByArtistId(mbid);
    const concerts = concertsResponse.setlist;
    const futureConcerts = concerts.filter((concert: Concert) => {
      const [day, month, year] = concert.eventDate.split("-");
      const concertDate = new Date(Number(year), Number(month), Number(day));
      if (concertDate > new Date()) {
        return concert;
      }
    });

    res.status(200).json({ artist, topSongs, futureConcerts });
    return;
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
