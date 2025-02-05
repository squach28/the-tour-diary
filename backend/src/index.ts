import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route";
import { usersRouter } from "./routes/users.route";
import { concertsRouter } from "./routes/concerts.route";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("", concertsRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
