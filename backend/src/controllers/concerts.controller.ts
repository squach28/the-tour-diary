import express from "express";
import { queries as concertQueries } from "../db/queries/concerts";
import { db } from "../db/db";
import { fetchConcertById, fetchConcertsByArtistId } from "../utils/setlist";
import { queries as artistQueries } from "../db/queries/artists";

export const addConcert = async (
  req: express.Request,
  res: express.Response
) => {
  const client = await db.connect();
  try {
    const { concertId } = req.body;
    const { userId } = req.params;
    if (concertId === undefined || userId === undefined) {
      res.status(400).json({ message: "Missing concertId and/or userId" });
      return;
    }

    await db.query(concertQueries.insertConcertByUserId, [userId, concertId]);

    await client.query("COMMIT");
    res.status(201).json({ message: "Success" });
    return;
  } catch (e) {
    console.log(e);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
    return;
  } finally {
    client.release();
  }
};

export const removeConcert = async (
  req: express.Request,
  res: express.Response
) => {
  const client = await db.connect();
  try {
    const { concertId } = req.body;
    const { userId } = req.params;
    if (concertId === undefined || userId === undefined) {
      res.status(400).json({ message: "Missing concertId and/or userId" });
      return;
    }

    await db.query(concertQueries.deleteConcertByUserId, [userId, concertId]);

    await client.query("COMMIT");
    res.status(201).json({ message: "Success" });
    return;
  } catch (e) {
    console.log(e);
    await db.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
    return;
  } finally {
    client.release();
  }
};

export const getConcertById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { concertId } = req.params;

    if (concertId === undefined) {
      res.status(400).json({ message: "Missing concertId" });
      return;
    }

    const concert = await fetchConcertById(concertId);
    res.status(200).json(concert);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const getConcertsByArtistId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { artistId } = req.params;

    if (artistId === undefined) {
      res.status(400).json({ message: "artistId is missing" });
      return;
    }

    const artistDetails = await db.query(artistQueries.getArtistBySpotifyId, [
      artistId,
    ]);

    if (artistDetails.rowCount === 0) {
      res.status(404).json({ message: "Artist doesn't exist" });
      return;
    }

    const { mbid } = artistDetails.rows[0];

    const concerts = await fetchConcertsByArtistId(mbid);
    res.status(200).json(concerts);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
