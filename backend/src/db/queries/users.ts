export const queries = {
  insertUser:
    "INSERT INTO users (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)",
  getUserById: "SELECT * FROM users WHERE id = $1",
  updateUserById:
    "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 SET RETURNING *",
  deleteUserById: "DELETE FROM users WHERE id = $1",
};
