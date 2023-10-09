import { db } from "../database/connect.js";

const assignModerator = (req, res) => {
  const query = "UPDATE user SET moderateStatus = ? WHERE user_id = ?";
  db.query(query, [true, req.params.user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Successfully assign as moderator");
  });
};

const removeModerator = (req, res) => {
  const query = "UPDATE user SET moderateStatus = ? WHERE user_id = ?";
  db.query(query, [false, req.params.user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Remove moderator successfully!");
  });
};

export default { assignModerator, removeModerator };
