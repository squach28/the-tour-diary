import express from "express";
import { fetchArtistById, fetchArtistTopSongsById } from "../utils/spotify";
import { Artist } from "../types/Artist";

interface RequestWithArtist extends express.Request {
  artist: Artist;
}

export const getArtistById = async (
  req: RequestWithArtist,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (id === undefined) {
      res.status(400).json({ message: "ID is missing in params" });
      return;
    }

    const artist = req.artist;
    if (artist === undefined) {
      res.status(404).json({ message: "Artist not found" });
      return;
    }
    const tracks = await fetchArtistTopSongsById(id);
    const topSongs = tracks.tracks;
    res.status(200).json({ artist, topSongs });
    return;
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
