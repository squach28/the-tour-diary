export const queries = {
  getArtistBySpotifyId: "SELECT * FROM artists WHERE spotify_id = $1",
  insertArtist: "INSERT INTO artists (spotify_id, mbid) VALUES ($1, $2)",
  insertArtistToUserFavorites:
    "INSERT INTO user_artists (user_id, artist_id) VALUES ($1, $2) RETURNING id",
};
