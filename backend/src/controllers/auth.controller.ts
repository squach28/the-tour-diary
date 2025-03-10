import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/db";
import { queries as authQueries } from "../db/queries/auth";
import { queries as userQueries } from "../db/queries/users";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";

// POST - Sign Up
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
    res.status(201).json({ message: "User was sucessfully created" });
    return;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Something went wrong" });
  } finally {
    client.release();
  }
};

// POST - Log In
export const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    res.status(400).json({ mesasage: "Missing email or password" });
    return;
  }
  try {
    const result = await db.query(authQueries.getCredentialsByEmail, [email]);
    if (result.rows.length === 0) {
      res
        .status(400)
        .json({ message: `User with email, ${email}, doesn't exist` });
      return;
    }

    const { hash } = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, hash);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    const { id } = result.rows[0];

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 900000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Success" });
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Field missing" });
    return;
  }
};

// POST - Log out
export const logout = (req: express.Request, res: express.Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

// GET - Check Auth
export const checkAuth = (req: express.Request, res: express.Response) => {
  try {
    const token = req.cookies.accessToken;
    if (token === undefined) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const decoded = verifyAccessToken(token);
    res.status(200).json({ id: decoded.id });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

// POST - Refresh Token
export const refresh = (req: express.Request, res: express.Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (token === undefined) {
      res.status(401).json({ message: "Refresh token is missing" });
      return;
    }

    const decoded = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(decoded.id);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 900000,
    });
    res.status(200).json({ message: "Success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
