export const queries = {
  getConcertByUserIdAndConcertId:
    "SELECT concert_id FROM user_concerts WHERE user_id = $1 AND concert_id = $2",
  getConcertByUserIdAndConcertIds:
    "SELECT concert_id FROM user_concerts WHERE user_id = $1 AND concert_id = ANY($2)",
  insertConcertByUserId:
    "INSERT INTO user_concerts (user_id, concert_id) VALUES ($1, $2)",
  deleteConcertByUserId:
    "DELETE FROM user_concerts WHERE user_id = $1 AND concert_id = $2",
};
