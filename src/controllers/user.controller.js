import { query } from "express";
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
    res.status(200).json({ message: "You have deleted successfully" });
  });
};

const updateProfile = (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let deparment = req.body.deparment;
  let major = req.body.major;
  let avatar = req.body.avatar;
  const query = "Update user set = ? where = ?";
  db.query(query, [firstname, lastname, deparment, major, avatar]), (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Your profile updated successfully" });
  }
};




  export default { getUserInfo, getAllUsers, deleteUser, updateProfile};
