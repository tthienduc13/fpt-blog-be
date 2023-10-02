import { db } from "../database/connect.js";

const getAllUsers = (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    const profiles = data.map(({ password, ...info }) => info);
    return res.status(200).json(profiles);
  });
};

const getUserInfo = (req, res) => {
  const user_id = req.params.user_id;
  const query = "SELECT * FROM user WHERE user_id = ?";

  db.query(query, [user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    const { user_id, remember, password, ...info } = data[0];
    return res.json(info);
  });
};

export default { getUserInfo, getAllUsers };
