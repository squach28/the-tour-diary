import express from "express";
import { queries as concertQueries } from "../db/queries/concerts";
import { db } from "../db/db";

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
