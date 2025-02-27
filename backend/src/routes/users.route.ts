import {
  authorizeUserMiddleware,
  tokenMiddleware,
} from "../middleware/jwtMiddleware";
import {
  addArtistToUserFavorites,
  addConcertToUser,
  deleteUserById,
  getConcertByUserIdAndConcertId,
  getUserById,
  removeArtistFromUserFavorites,
  removeConcertFromUser,
  updateUserById,
} from "../controllers/users.controller";
import express from "express";

export const usersRouter = express.Router();

usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", tokenMiddleware, updateUserById);
usersRouter.delete("/:id", tokenMiddleware, deleteUserById);

// Concert related endpoints
usersRouter.get(
  "/:userId/concerts/:concertId",
  tokenMiddleware,
  getConcertByUserIdAndConcertId
);
usersRouter.post(
  "/:userId/concerts",
  tokenMiddleware,
  authorizeUserMiddleware,
  addConcertToUser
);
usersRouter.delete(
  "/:userId/concerts/:concertId",
  authorizeUserMiddleware,

  tokenMiddleware,
  removeConcertFromUser
);

// Artist related queries
usersRouter.post(
  "/:userId/artists",
  tokenMiddleware,
  authorizeUserMiddleware,
  addArtistToUserFavorites
);
usersRouter.delete(
  "/:userId/artists/:artistId",
  tokenMiddleware,
  authorizeUserMiddleware,
  removeArtistFromUserFavorites
);
