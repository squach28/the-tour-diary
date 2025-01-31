import {
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/users.controller";
import express from "express";

export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", updateUserById);
usersRouter.delete("/:id", deleteUserById);
