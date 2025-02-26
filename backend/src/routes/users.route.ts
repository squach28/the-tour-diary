import { tokenMiddleware } from "../middleware/jwtMiddleware";
import {
  addConcertToUser,
  deleteUserById,
  getUserById,
  removeConcertFromUser,
  updateUserById,
} from "../controllers/users.controller";
import express from "express";

export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", tokenMiddleware, updateUserById);
usersRouter.delete("/:id", tokenMiddleware, deleteUserById);

// Concert related endpoints
usersRouter.post("/users/:userId/concerts/", tokenMiddleware, addConcertToUser);
usersRouter.delete(
  "/users/:userId/concerts",
  tokenMiddleware,
  removeConcertFromUser
);
