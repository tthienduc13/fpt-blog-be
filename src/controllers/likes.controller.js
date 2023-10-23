import { db } from "../database/connect.js";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
configDotenv();

const likePost = (req, res) => {
  const like_id = uuidv4();
  const query =
    "INSERT INTO blog_like (like_id, user_id, blog_id, created_at) VALUES (?,?,?,NOW())";
  db.query(
    query,
    [like_id, req.body.user_id, req.body.blog_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      return res.status(200).json("Liked");
    }
  );
};

const unlikePost = (req, res) => {
  const query = `DELETE FROM blog_like WHERE user_id = ? AND blog_id = ?;`;
  db.query(query, [req.body.user_id, req.body.blog_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    return res.status(200).json("Unliked");
  });
};

const getLikeCountForBlog = (req, res) => {
  const blog_id = req.params.blog_id;
  const query = `SELECT COUNT(*) AS like_count FROM blog_like WHERE blog_id = ?;`;

  db.query(query, [blog_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    const likeCount = parseInt(result[0].like_count, 10);
    return res.status(200).json(likeCount);
  });
};

const getLikeCountForComment = (req, res) => {
  const comment_id = req.params.comment_id;
  const query = `SELECT COUNT(*) AS like_count FROM comment_like WHERE comment_id = ?;`;

  db.query(query, [comment_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    const likeCount = parseInt(result[0].like_count, 10);
    return res.status(200).json(likeCount);
  });
};

const checkUserLikedBlog = (req, res) => {
  const userId = req.params.user_id;
  const blogId = req.params.blog_id;

  const query =
    "SELECT COUNT(*) AS likeCount FROM blog_like WHERE user_id = ? AND blog_id = ?";
  db.query(query, [userId, blogId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      const hasLiked = result[0].likeCount > 0;
      res.status(200).json(hasLiked);
    }
  });
};

const checkUserLikedComment = (req, res) => {
  const userId = req.params.user_id;
  const comment = req.params.comment_id;

  const query =
    "SELECT COUNT(*) AS likeCount FROM comment_like WHERE user_id = ? AND comment_id = ?";
  db.query(query, [userId, comment], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      const hasLiked = result[0].likeCount > 0;
      res.status(200).json(hasLiked);
    }
  });
};

export default {
  likePost,
  unlikePost,
  getLikeCountForBlog,
  getLikeCountForComment,
  checkUserLikedBlog,
  checkUserLikedComment,
};
