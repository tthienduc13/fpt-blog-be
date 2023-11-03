import { db } from "../database/connect.js";
import { v4 as uuidv4 } from "uuid";

const commentController = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected to comment controller");
    socket.on("new-comment", (newComment) => {
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

    socket.on("new-notification", (newNotification) => {
      const notification_id = uuidv4();
      const query =
        "INSERT INTO notification (notification_id, user_id, notification_title, content, image, created_at) VALUES (?, ?, ?, ?,?, NOW());";

      db.query(
        query,
        [
          notification_id,
          newNotification.user_id,
          newNotification.notification_title,
          newNotification.content,
          newNotification.image,
        ],
        (err, result) => {
          if (err) {
            console.error("Error adding notification:", err);
          } else {
            console.log("Notification added successfully");
            const addedNotification = {
              notification_id,
              user_id: newNotification.user_id,
              notification_title: newNotification.notification_title,
              content: newNotification.content,
              image: newNotification.image,
              created_at: new Date(),
            };
            io.emit("notification-updated", addedNotification);
          }
        }
      );
    });

    socket.on("delete-comment", (deleteComment) => {
      const query =
        "DELETE FROM comment WHERE user_id = ? and comment_id = ? ;";

      db.query(
        query,
        [deleteComment.user_id, deleteComment.comment_id],
        (err, result) => {
          if (err) {
            console.error("Error deleting comment:", err);
          } else {
            console.log("Comment deleted successfully");
            io.emit("comment-updated");
          }
        }
      );
    });

    socket.on("reply", (replyComment) => {
      const commentReply_id = uuidv4();
      const query =
        "INSERT INTO comment_reply (commentReply_id, user_id, comment_id, content, isArchived, created_at) VALUES (?, ?, ?, ?,false , NOW()); ";
      db.query(
        query,
        [
          commentReply_id,
          replyComment.user_id,
          replyComment.comment_id,
          replyComment.content,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          io.emit("replied");
        }
      );
    });

    socket.on("like", (newLike) => {
      const like_id = uuidv4();
      const query =
        "INSERT INTO blog_like (like_id, user_id, blog_id, created_at) VALUES (?,?,?,NOW())";
      db.query(
        query,
        [like_id, newLike.user_id, newLike.blog_id],
        (err, result) => {
          if (err) {
            console.log("Error like blog:", err);
          }
          io.emit("liked");
        }
      );
    });

    socket.on("unlike", (unLike) => {
      const query = `DELETE FROM blog_like WHERE user_id = ? AND blog_id = ?;`;
      db.query(query, [unLike.user_id, unLike.blog_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        }
        io.emit("unliked");
      });
    });

    socket.on("like-comment", (newCommentLike) => {
      const like_id = uuidv4();
      const query =
        "INSERT INTO comment_like (like_id, user_id, comment_id, created_at) VALUES (?,?,?,NOW())";
      db.query(
        query,
        [like_id, newCommentLike.user_id, newCommentLike.comment_id],
        (err, result) => {
          if (err) {
            console.log("Error like comment:", err);
          }
          io.emit("comment-liked");
        }
      );
    });

    socket.on("unlike-comment", (unLikeComment) => {
      const query = `DELETE FROM comment_like WHERE user_id = ? AND comment_id = ?;`;
      db.query(
        query,
        [unLikeComment.user_id, unLikeComment.comment_id],
        (err, result) => {
          if (err) {
            console.log("Error unlike comment", err);
          }
          io.emit("comment-unliked");
        }
      );
    });
  });
};

export default commentController;
