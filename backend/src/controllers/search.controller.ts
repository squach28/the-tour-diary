import express from "express";
import { searchByArtistName } from "../utils/spotify";

// GET - Search by Artist
export const searchByArtist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { artistName } = req.query;
    const result = await searchByArtistName(artistName as string);
    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
