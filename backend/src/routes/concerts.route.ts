import { tokenMiddleware } from "../middleware/jwtMiddleware";
import {
  getConcertById,
  getConcertsByArtistId,
} from "../controllers/concerts.controller";
import express from "express";

export const concertsRouter = express.Router();

concertsRouter.get("/concerts/:concertId", tokenMiddleware, getConcertById);
concertsRouter.get(
  "/artists/:artistId/concerts",
  tokenMiddleware,
  getConcertsByArtistId
);
