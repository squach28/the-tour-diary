import express from "express";
import { db } from "../db/db";
import { queries as artistQueries } from "../db/queries/artists";
import { fetchArtistById } from "../utils/spotify";
import { Artist } from "../types/Artist";
import { fetchArtistByNameAndTag } from "../utils/musicBrainz";

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
    const artistExists = await db.query(artistQueries.getArtistBySpotifyId, [
      id,
    ]);
    // artist isn't in db, must do api calls to add spotify_id and mbid information
    if (artistExists.rowCount === 0) {
      const { name, genres } = artist;
      const response = await fetchArtistByNameAndTag(name, genres[0]);
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
