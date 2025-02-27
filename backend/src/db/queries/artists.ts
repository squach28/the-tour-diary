export const queries = {
  getArtistBySpotifyId: "SELECT * FROM artists WHERE spotify_id = $1",
  insertArtist: "INSERT INTO artists (spotify_id, mbid) VALUES ($1, $2)",
  insertArtistToUserFavorites:
    "INSERT INTO user_favorite_artists (user_id, artist_id) VALUES ($1, $2) RETURNING id",
  removeArtistFromUserFavorites:
    "DELETE FROM user_favorite_artists WHERE user_id = $1 and artist_id = $2",
  getFavoriteArtistsByUserId:
    "SELECT user_id, artist_id FROM user_favorite_artists WHERE user_id = $1",
  isArtistInUserFavorites:
    "SELECT EXISTS (SELECT 1 FROM user_favorite_artists WHERE user_id = $1 AND artist_id = $2) AS is_favorite",
};
