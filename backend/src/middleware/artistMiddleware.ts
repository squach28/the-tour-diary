import express from "express";
import { db } from "../db/db";
import { queries as artistQueries } from "../db/queries/artists";
import { fetchArtistById } from "../utils/spotify";
import { Artist } from "../types/Artist";
import { fetchArtistByName } from "../utils/musicBrainz";

interface RequestWithArtist extends express.Request {
  artist: Artist;
}

export const artistMiddleware = async (
  req: RequestWithArtist,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const artist = await fetchArtistById(id);
    console.log(artist);
    const artistExists = await db.query(artistQueries.getArtistBySpotifyId, [
      id,
    ]);
    // artist isn't in db, must do api calls to add spotify_id and mbid information
    if (artistExists.rowCount === 0) {
      const { name } = artist;
      const response = await fetchArtistByName(name);
      const client = await db.connect();
      try {
        const mbid = response.id;
        await client.query(artistQueries.insertArtist, [id, mbid]);
      } catch (e) {
        console.log(e);
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
      await client.query("BEGIN");
    }

    req.artist = artist;
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
};
