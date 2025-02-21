type Image = {
  width: number;
  height: number;
  url: string;
};

type Followers = {
  href: string | null;
  total: number;
};

export type Artist = {
  id: string;
  images: Array<Image>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
  genres: Array<string>;
  followers: Followers;
};
