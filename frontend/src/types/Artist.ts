import { Concert } from "./Concert";
import { Image } from "./Image";

export type Artist = {
  id: string;
  followers: { href: string | null; total: number };
  href: string;
  name: string;
  images: Array<Image>;
  genres: Array<string>;
};
