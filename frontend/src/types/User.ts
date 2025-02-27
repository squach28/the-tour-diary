import { Artist } from "./Artist";
import { Concert } from "./Concert";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  concerts: Array<Concert>;
  favoriteArtists: Array<Artist>;
};
