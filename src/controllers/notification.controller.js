import { db } from "../database/connect.js";
import { config as configDotenv } from "dotenv";
configDotenv();

const getNotification = (req, res) => {
  const notification_id = req.params.notification_id;
  const query = `SELECT
    n.notification_id,
      CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    n.notification_title as title,
    n.content,
    n.image,
    n.created_at
  FROM
    notification n
  JOIN
    user u
  ON
    n.user_id = u.user_id
  WHERE
    notification_id = ?
  `;
  db.query(query, [notification_id], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(200).json(data[0]);
  });
};

const getAllNotification = (req, res) => {
  const page = parseInt(req.query.page);
  const page_size = 6;
  const offset = (page - 1) * page_size;

  const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM notification
  `;

  const query = `SELECT
  n.notification_id,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  n.notification_title as title,
  n.content,
  n.image,
  n.created_at
FROM
  notification n
JOIN
  user u
ON
  n.user_id = u.user_id
ORDER BY
  n.created_at DESC
LIMIT
  ?
OFFSET
  ?;
`;
  db.query(countQuery, (countErr, countData) => {
    if (countErr) {
      console.error(countErr);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      const total_count = countData[0].total_count;
      const total_pages = Math.ceil(total_count / page_size);

      db.query(query, [page_size, offset], (queryErr, data) => {
        if (queryErr) {
          console.error(queryErr);
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          return res.status(200).json({ data, total_pages });
        }
      });
    }
  });
};

export default { getAllNotification, getNotification };
