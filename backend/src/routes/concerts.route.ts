import { tokenMiddleware } from "../middleware/jwtMiddleware";
import { addConcert, removeConcert } from "../controllers/concerts.controller";
import express from "express";

export const concertsRouter = express.Router();

concertsRouter.post("/users/:userId/concerts/", tokenMiddleware, addConcert);
concertsRouter.delete(
  "/users/:userId/concerts",
  tokenMiddleware,
  removeConcert
);
