import { db } from "../database/connect.js";
import { v4 as uuidv4 } from "uuid";

const getAllComments = (blog_id, callback) => {
  const query = `
    SELECT
      C.comment_id,
      C.content,
      C.created_at,
      CONCAT(U.last_name, ' ', U.first_name) AS user_name,
      U.image AS user_image
    FROM comment AS C
    INNER JOIN user AS U
    ON C.user_id = U.user_id
    WHERE C.blog_id = ?
    ORDER BY C.created_at DESC;
  `;

  db.query(query, [blog_id], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      callback(err, null);
    } else {
      console.log("Fetched comments successfully");
      callback(null, results);
    }
  });
};

const commentController = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected to comment controller");

    socket.on("new-comment", (newComment) => {
      console.log("Received new comment:", newComment);
      const comment_id = uuidv4();
      const query =
        "INSERT INTO comment (comment_id, blog_id, user_id, content, created_at, isArchived) VALUES (?, ?, ?, ?, NOW(), false);";

      db.query(
        query,
        [
          comment_id,
          newComment.blog_id,
          newComment.user_id,
          newComment.content,
        ],
        (err, result) => {
          if (err) {
            console.error("Error adding comment:", err);
          } else {
            console.log("Comment added successfully");
            const addedComment = {
              comment_id,
              blog_id: newComment.blog_id,
              user_id: newComment.user_id,
              content: newComment.content,
              created_at: new Date(),
              isArchived: false,
            };
            io.emit("comment-updated", addedComment);
          }
        }
      );
    });
  });
};

export default commentController;
