import { getArtistById } from "../controllers/artists.controller";
import express from "express";

export const artistsRouter = express.Router();

artistsRouter.get("/:id", getArtistById);
