import express from "express";
import { searchByArtistName } from "../utils/spotify";
import { db } from "../db/db";
import { queries as userQueries } from "../db/queries/users";

// GET - Search by Query
export const searchByQuery = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const ARTIST_SEARCH_LIMIT = 5;
    const { query } = req.query;
    const artists = await searchByArtistName(
      query as string,
      ARTIST_SEARCH_LIMIT
    );
    const usersResult = await db.query(userQueries.getUsersByUsername, [query]);
    const users = usersResult.rows.map((user) => {
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
      };
    });
    res.status(200).json({ artists, users });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
