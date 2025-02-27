import express from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "types/User";

interface RequestWithToken extends express.Request {
  user: User;
}

// middleware to check if token from user is valid
export const tokenMiddleware = (
  req: RequestWithToken,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    // check user send a token through cookies
    if (accessToken === undefined) {
      res.status(401).json({ message: "Token is missing" });
      return;
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = { id: decoded.id } as User;

    next();
  } catch (e) {
    // token isn't valid, send error message
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
