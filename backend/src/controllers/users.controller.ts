import express from "express";
import { db } from "../db/db";
import { queries as userQueries } from "../db/queries/users";
import { queries as authQueries } from "../db/queries/auth";
import { queries as concertQueries } from "../db/queries/concerts";
import validator from "validator";

export const getUserById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json({ message: "ID is missing" });
      return;
    }

    if (!validator.isUUID(id)) {
      res.status(400).json({ message: "ID is not a valid UUID" });
      return;
    }

    const result = await db.query(userQueries.getUserById, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "User with id doesn't exist" });
      return;
    }

    res.status(200).json(result.rows[0]);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const updateUserById = async (
  req: express.Request,
  res: express.Response
) => {
  const client = await db.connect();
  try {
    const { firstName, lastName, email } = req.body;
    const { id } = req.params;
    if (
      firstName === undefined ||
      lastName === undefined ||
      email === undefined
    ) {
      res.status(400).json({ message: "Field is missing" });
      return;
    }

    if (id === undefined) {
      res.status(400).json({ message: "ID is missing" });
    }

    if (!validator.isUUID(id)) {
      res.status(400).json({ message: "ID is not a valid UUID" });
      return;
    }

    const result = await client.query(userQueries.updateUserById, [
      firstName,
      lastName,
      email,
      id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "User with ID doesn't exist" });
      return;
    }
    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
    return;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
    return;
  } finally {
    client.release();
  }
};

export const deleteUserById = async (
  req: express.Request,
  res: express.Response
) => {
  const client = await db.connect();
  try {
    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json({ message: "ID is missing" });
      return;
    }

    if (!validator.isUUID(id)) {
      res.status(400).json({ message: "ID is not a valid UUID" });
      return;
    }

    const result = await client.query(authQueries.deleteUserById, [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "User with ID doesn't exist" });
      return;
    }
    await client.query("COMMIT");
    res.status(204).send();
    return;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
    return;
  } finally {
    client.release();
  }
};

// Concert related queries

export const getConcertByUserIdAndConcertId = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId, concertId } = req.params;

  if (userId === undefined || concertId === undefined) {
    res.status(400).json({ message: "Missing userId and/or concertId" });
    return;
  }

  if (!validator.isUUID(userId)) {
    res.status(400).json({ message: "userId is not a valid UUID" });
    return;
  }

  try {
    const result = await db.query(
      concertQueries.getConcertByUserIdAndConcertId,
      [userId, concertId]
    );
    const row = result.rows[0];

    res.status(200).json({ concert: row ?? null });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addConcertToUser = async (
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

export const removeConcertFromUser = async (
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
