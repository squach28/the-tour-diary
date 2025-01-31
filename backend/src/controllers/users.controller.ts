import express from "express";
import { db } from "../db/db";
import { queries as userQueries } from "../db/queries/users";
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

export const updateUserById = (req: express.Request, res: express.Response) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const deleteUserById = (req: express.Request, res: express.Response) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
