import {
  checkAuth,
  login,
  logout,
  refresh,
  signup,
} from "../controllers/auth.controller";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/signup", signup);
authRouter.post("/refresh", refresh);
authRouter.get("/me", checkAuth);
