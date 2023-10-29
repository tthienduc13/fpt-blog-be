import { db } from "../database/connect.js";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
configDotenv();

const addComment = (req, res) => {
  const comment_id = uuidv4();
  const query =
    "INSERT INTO comment (comment_id, blog_id, user_id, content, created_at, isArchived) VALUES (?, ?, ?, ?, NOW(), false); ";
  db.query(
    query,
    [comment_id, req.body.blog_id, req.body.user_id, req.body.content],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      return res.status(200).json("Comment posted!");
    }
  );
};

const addReplyComment = (req, res) => {
  const commentReply_id = uuidv4();
  const query =
    "INSERT INTO comment_reply (commentReply_id, user_id, comment_id, content, isArchived, created_at) VALUES (?, ?, ?, ?,false , NOW()); ";
  db.query(
    query,
    [commentReply_id, req.body.user_id, req.body.comment_id, req.body.content],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      return res.status(200).json("Comment posted!");
    }
  );
};

const getCommentByBlog = (req, res) => {
  const blogId = req.params.blog_id; // Assuming the blog_id is passed in the request parameters

  const query = `
      SELECT
          C.blog_id,
          C.comment_id,
          C.content,
          C.created_at,
          u.user_id as user_id,
          CONCAT(U.last_name, ' ', U.first_name) AS user_name,
          U.image AS user_image
      FROM
          comment AS C
      INNER JOIN
          user AS U
      ON
          C.user_id = U.user_id
      WHERE
          C.blog_id = ?
        ORDER BY C.created_at DESC;
    `;

  db.query(query, [blogId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  });
};

const getReplyComment = (req, res) => {
  const parentCommentId = req.params.comment_id; // Assuming the parent comment's comment_id is passed in the request parameters
  const query = `
      SELECT
          CR.comment_id,
          CR.commentReply_id,
          CR.content,
          CR.created_at,
          CONCAT(U.last_name, ' ', U.first_name) AS user_name,
          U.image AS user_image
      FROM
          comment_reply AS CR
      INNER JOIN
          user AS U
      ON
          CR.user_id = U.user_id
      WHERE
          CR.comment_id = ?
      ORDER BY CR.created_at DESC;
    `;

  db.query(query, [parentCommentId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  });
};

export default {
  addComment,
  getCommentByBlog,
  addReplyComment,
  getReplyComment,
};
