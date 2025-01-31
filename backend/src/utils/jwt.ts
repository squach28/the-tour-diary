import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateJWT = async (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
