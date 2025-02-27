import { Artist } from "./Artist";

export interface Concert {
  id: string;
  versionId: string;
  eventDate: string;
  lastUpdated: string;
  artist: Artist;
  venue: Venue;
  sets: Sets;
  info: string;
  url: string;
  attended: boolean;
}

export interface Venue {
  id: string;
  name: string;
  city: City;
  url: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  coords: Coords;
  country: Country;
}

export interface Coords {
  lat: number;
  long: number;
}

export interface Country {
  code: string;
  name: string;
}

export interface Sets {
  set: Set[];
}

export interface Set {
  song: Song[];
}

export interface Song {
  name: string;
  info?: string;
}
