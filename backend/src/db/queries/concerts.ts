export const queries = {
  getConcertByUserIdAndConcertId:
    "SELECT * FROM user_concerts WHERE user_id = $1 AND concert_id = $2",
  insertConcertByUserId:
    "INSERT INTO user_concerts (user_id, concert_id) VALUES ($1, $2)",
  deleteConcertByUserId:
    "DELETE FROM user_concerts WHERE user_id = $1 AND concert_id = $2",
};
