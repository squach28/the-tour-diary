import { tokenMiddleware } from "../middleware/jwtMiddleware";
import {
  getArtistById,
  getArtistsByQuery,
} from "../controllers/artists.controller";
import express from "express";
import { artistMiddleware } from "../middleware/artistMiddleware";

export const artistsRouter = express.Router();

artistsRouter.get("/:id", tokenMiddleware, artistMiddleware, getArtistById);
artistsRouter.get("/", tokenMiddleware, getArtistsByQuery);
