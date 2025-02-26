import { tokenMiddleware } from "../middleware/jwtMiddleware";
import {
  addConcert,
  getConcertById,
  getConcertsByArtistId,
  removeConcert,
} from "../controllers/concerts.controller";
import express from "express";

export const concertsRouter = express.Router();

concertsRouter.get("/concerts/:concertId", tokenMiddleware, getConcertById);
concertsRouter.post("/users/:userId/concerts/", tokenMiddleware, addConcert);
concertsRouter.delete(
  "/users/:userId/concerts",
  tokenMiddleware,
  removeConcert
);
concertsRouter.get(
  "/artists/:artistId/concerts",
  tokenMiddleware,
  getConcertsByArtistId
);
