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

const getMentionData = (req, res) => {
  const query =
    "SELECT user_id as id, CONCAT(first_name, ' ', last_name) as display FROM user";

  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

const getUserInfo = (req, res) => {
  const user_id = req.params.user_id;
  const query = "SELECT * FROM user WHERE user_id = ?";

  db.query(query, [user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const { user_id, remember, password, ...info } = data[0];
    return res.json(info);
  });
};

const deleteUser = (req, res) => {
  const user_id = req.params.user_id;
  const query = "DELETE FROM user WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};

const updateAvatar = (req, res) => {
  const user_id = req.params.user_id;
  const query = "UPDATE user SET image = ? WHERE user_id = ?";
  db.query(query, [req.body.image, user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Update avatar successfully" });
  });
};

const updateInfo = (req, res) => {
  const user_id = req.params.user_id;
  const updateData = req.body;

  const query = "UPDATE user SET ? WHERE user_id = ?";

  db.query(query, [updateData, user_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update user information" });
    } else {
      res
        .status(200)
        .json({ message: "User information updated successfully" });
    }
  });
};

export default {
  getUserInfo,
  getAllUsers,
  deleteUser,
  updateAvatar,
  updateInfo,
  getMentionData,
};
