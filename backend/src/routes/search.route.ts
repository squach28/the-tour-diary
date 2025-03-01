import { searchByQuery } from "../controllers/search.controller";
import express from "express";
import { tokenMiddleware } from "../middleware/jwtMiddleware";

export const searchRouter = express.Router();

searchRouter.get("/", tokenMiddleware, searchByQuery);
