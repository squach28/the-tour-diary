type Image = {
  url: string;
  width: number;
  height: number;
};

export type Artist = {
  id: string;
  followers: { href: string | null; total: number };
  href: string;
  name: string;
  images: Array<Image>;
  genres: Array<string>;
};
