import express from "express";
import { getArtistsByName } from "../utils/setlist";
export const searchByArtist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { artistName } = req.query;
    const result = await getArtistsByName(artistName as string);
    console.log(result);
    res.status(200).json({ message: "Success" });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
