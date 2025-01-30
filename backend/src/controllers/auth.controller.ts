import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/db";
import { queries as authQueries } from "../db/queries/auth";
import { queries as userQueries } from "../db/queries/users";

export const signup = async (req: express.Request, res: express.Response) => {
  const client = await db.connect();
  try {
    const { firstName, lastName, email, password } = req.body;
    if (
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      password === undefined
    ) {
      res.status(400).json({ message: "Field missing" });
      return;
    }
    const emailTaken = await db.query(authQueries.getUserByEmail, [email]);

    if (emailTaken.rows.length > 0) {
      res.status(400).json({ message: "Email is already taken" });
      return;
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const authResult = await client.query(authQueries.insertUser, [
      email,
      hash,
    ]);
    const { id } = authResult.rows[0];
    await client.query(userQueries.insertUser, [
      id,
      firstName,
      lastName,
      email,
    ]);
    await client.query("COMMIT");
    res.status(200).json({ message: "User was sucessfully created" });
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
  } finally {
    client.release();
  }
};

export const login = (req: express.Request, res: express.Response) => {};
