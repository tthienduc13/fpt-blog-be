import { db } from "../database/connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
configDotenv();

export const getAllCategory = (req, res) => {
  const query = "SELECT * FROM category";

  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

export const getCategoryById = (req, res) => {
  const query = "SELECT * FROM category where category_id = ?";
  const category_id = req.params.category_id;
  db.query(query, [category_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

export const getAllTag = (req, res) => {
  const query = "SELECT * FROM tag";

  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

export const getTagById = (req, res) => {
  const query = "SELECT * FROM tag where tag_id = ?";
  const tag_id = req.params.tag_id;
  db.query(query, [tag_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

export const createBlog = (req, res) => {
  const blog_id = uuidv4();
  const defaultViewCount = 0;
  const query =
    "INSERT INTO blog (blog_id, user_id, blog_title, content, status, view, visual, created_at) VALUES (?,?,?,?,?,?,?,NOW())";

  db.query(
    query,
    [
      blog_id,
      req.body.user_id,
      req.body.blog_title,
      req.body.content,
      req.body.status,
      defaultViewCount,
      req.body.visual,
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Blog sent to server");
    }
  );
};
