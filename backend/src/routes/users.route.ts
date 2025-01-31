import { tokenMiddleware } from "../middleware/jwtMiddleware";
import {
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/users.controller";
import express from "express";

export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", tokenMiddleware, updateUserById);
usersRouter.delete("/:id", tokenMiddleware, deleteUserById);
