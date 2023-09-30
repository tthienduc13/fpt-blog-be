import { db } from "../database/connect.js";
const getUserInfo = (req, res) => {
  const user_id = req.params.user_id;
  const query = "SELECT * FROM user WHERE user_id = ?";

  db.query(query, [user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    const { user_id, remember, password, ...info } = data[0];
    return res.json(info);
  });
};

export default { getUserInfo };
