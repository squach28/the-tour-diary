import express from "express";
import { queries as concertQueries } from "../db/queries/concerts";
import { db } from "../db/db";
import { fetchConcertById, fetchConcertsByArtistId } from "../utils/setlist";
import { queries as artistQueries } from "../db/queries/artists";
import { User } from "../types/User";
import { Concert } from "types/Concert";

interface RequestWithToken extends express.Request {
  user: User;
}

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

const didUserGoToConcerts = async (
  userId: string,
  concertIds: Array<string>
): Promise<boolean | null> => {
  try {
    const result = await db.query(
      concertQueries.getConcertByUserIdAndConcertIds,
      [userId, concertIds]
    );
    const didUserGo = result.rowCount === 1;
    return didUserGo;
  } catch (e) {
    return null;
  }
};

export const getConcertsByArtistId = async (
  req: RequestWithToken,
  res: express.Response
) => {
  try {
    const { artistId } = req.params;
    const userId = req.user.id;

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
    const setlist: Array<Concert> = concerts.setlist;
    const concertIds = setlist.map((concert) => concert.id);
    const attendedResult = await db.query(
      concertQueries.getConcertByUserIdAndConcertIds,
      [userId, concertIds]
    );
    const attendedConcertIds = new Set(
      attendedResult.rows.map((row) => row.concert_id)
    );

    const concertsWithAttendance = setlist.map((concert) => {
      return {
        ...concert,
        attended: attendedConcertIds.has(concert.id),
      };
    });

    concerts.setlist = concertsWithAttendance;

    res.status(200).json(concerts);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
