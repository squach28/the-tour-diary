export const queries = {
  getUserByEmail: "SELECT email FROM auth WHERE email = $1",
  insertUser:
    "INSERT INTO auth (email, password_hash) VALUES ($1, $2) RETURNING id",
};
