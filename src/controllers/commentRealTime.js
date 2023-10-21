import { db } from "../database/connect.js";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";

const commentControllet = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected to comment controller");
        socket.on("new-comment", (commentData) => {
            console.log("da nhan duoc comment moi", commentData)
            const comment_id = uuidv4();
            const query =
                "INSERT INTO comment (comment_id, blog_id, user_id, content, created_at, isArchived) VALUES (?, ?, ?, ?, NOW(), false); ";
            db.query(
                query,
                [comment_id, commentData.blog_id, commentData.user_id, commentData.content],
                (err, result) => {
                    console.log(comment_id, commentData.blog_id, commentData.user_id, commentData.content)

                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                    }
                    else {
                        console.log("done add comment", comment_id, commentData.blog_id, commentData.user_id, commentData.content)
                    }
                }
            );
            // io.emit("comment-update", commentData);
        });
    })
}

export default commentControllet;