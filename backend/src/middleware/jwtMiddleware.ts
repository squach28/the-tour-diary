import express from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "types/User";

interface RequestWithToken extends express.Request {
  user: User;
}

export const tokenMiddleware = (
  req: RequestWithToken,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (authorization === undefined) {
      res.status(401).json({ message: "Token is missing" });
      return;
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id } as User;

    if (req.params.id && req.params.id !== req.user.id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};
