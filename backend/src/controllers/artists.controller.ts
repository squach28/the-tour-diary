import express from "express";
import { fetchArtistById, fetchArtistTopSongsById } from "../utils/spotify";

export const getArtistById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (id === undefined) {
      res.status(400).json({ message: "ID is missing in params" });
      return;
    }

    const artist = await fetchArtistById(id);
    const tracks = await fetchArtistTopSongsById(id);
    const topSongs = tracks.tracks;
    res.status(200).json({ artist, topSongs });
    return;
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
