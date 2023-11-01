import { db } from "../database/connect.js";
import { v4 as uuidv4 } from "uuid";
import { config as configDotenv } from "dotenv";
configDotenv();

const getAllCategory = (req, res) => {
  const query = "SELECT * FROM category";

  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

const getCategoryById = (req, res) => {
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

const getAllTag = (req, res) => {
  const query = "SELECT * FROM tag";

  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

const getTagById = (req, res) => {
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

const getTagByCategory = (req, res) => {
  const query = "SELECT * FROM tag where category_id = ?";
  const category_id = req.params.category_id;
  db.query(query, [category_id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

const createBlog = (req, res) => {
  const blog_id = uuidv4();
  const defaultViewCount = 0;
  const query =
    "INSERT INTO blog (blog_id, user_id, blog_title, category_id, content, status, view, visual, created_at) VALUES (?,?,?,?,?,?,?,?,NOW())";

  db.query(
    query,
    [
      blog_id,
      req.body.user_id,
      req.body.blogTitle,
      req.body.category_id,
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

      const createdBlog = {
        blog_id: blog_id, // Include the blog_id in the created blog object
        user_id: req.body.user_id,
        blogTitle: req.body.blogTitle,
        category_id: req.body.category_id,
        content: req.body.content,
        status: req.body.status,
        view: defaultViewCount,
        visual: req.body.visual,
        created_at: new Date().toISOString(),
      };

      return res.status(200).json(createdBlog); // Return the created blog object
    }
  );
};

const getPendingBlog = (req, res) => {
  const status = 0;
  const page = parseInt(req.query.page); // Use req.query to access the page parameter
  const page_size = 6; // Define the desired number of results per page
  const offset = (page - 1) * page_size;

  const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM blog
    WHERE status = ?;
  `;

  const query = `
    SELECT
        b.blog_id,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name,
        b.blog_title,
        c.description AS category_description,
        b.content,
        b.status,
        b.view,
        b.visual,
        b.created_at,
        b.published_at,
        GROUP_CONCAT(t.title) AS tag_titles
    FROM
        blog b
    LEFT JOIN
        category c
    ON
        b.category_id = c.category_id
    LEFT JOIN
        user u
    ON
        b.user_id = u.user_id
    LEFT JOIN
        blog_tags bt
    ON
        b.blog_id = bt.blog_id
    LEFT JOIN
        tag t
    ON
        bt.tag_id = t.tag_id
    WHERE
        b.status = ?
    GROUP BY
        b.blog_id
    ORDER BY
        b.created_at DESC
    LIMIT
        ?
    OFFSET
        ?;
  `;

  db.query(countQuery, [status], (countErr, countData) => {
    if (countErr) {
      console.error(countErr);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      const total_count = countData[0].total_count;
      const total_pages = Math.ceil(total_count / page_size);

      db.query(query, [status, page_size, offset], (queryErr, data) => {
        if (queryErr) {
          console.error(queryErr);
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          data.forEach((blog) => {
            blog.tag_titles = blog.tag_titles.split(",");
          });

          return res.status(200).json({ data, total_pages });
        }
      });
    }
  });
};

const getPostedBlog = (req, res) => {
  const page = parseInt(req.query.page); // Use req.query to access the page parameter
  const page_size = 6; // Define the desired number of results per page
  const offset = (page - 1) * page_size;

  const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM blog
    WHERE user_id = ?;
  `;

  const query = `
    SELECT
        b.blog_id,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name,
        b.blog_title,
        c.description AS category_description,
        b.content,
        b.status,
        b.view,
        b.visual,
        b.created_at,
        b.published_at,
        GROUP_CONCAT(t.title) AS tag_titles
    FROM
        blog b
    LEFT JOIN
        category c
    ON
        b.category_id = c.category_id
    LEFT JOIN
        user u
    ON
        b.user_id = u.user_id
    LEFT JOIN
        blog_tags bt
    ON
        b.blog_id = bt.blog_id
    LEFT JOIN
        tag t
    ON
        bt.tag_id = t.tag_id
    WHERE
        b.user_id = ?
    GROUP BY
        b.blog_id
    ORDER BY
        b.published_at DESC
    LIMIT
        ?
    OFFSET
        ?;
  `;

  db.query(countQuery, [req.params.user_id], (countErr, countData) => {
    if (countErr) {
      console.error(countErr);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      const total_count = countData[0].total_count;
      const total_pages = Math.ceil(total_count / page_size);

      db.query(
        query,
        [req.params.user_id, page_size, offset],
        (queryErr, data) => {
          if (queryErr) {
            console.error(queryErr);
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            data.forEach((blog) => {
              blog.tag_titles = blog.tag_titles.split(",");
            });

            return res.status(200).json({ data, total_pages });
          }
        }
      );
    }
  });
};

const createBlogTags = (req, res) => {
  const { blog_id, tags } = req.body;
  const blogTagsIds = tags.map(() => uuidv4());
  const blogTagsValues = tags.map((tag, index) => [
    blogTagsIds[index],
    blog_id,
    tag,
  ]);

  const query =
    "INSERT INTO blog_tags (blog_tags_id, blog_id, tag_id) VALUES ?";
  db.query(query, [blogTagsValues], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json({ message: "Blog tags created successfully" });
  });
};

const approveBlog = (req, res) => {
  const query =
    "UPDATE blog SET status = 1, published_at = NOW() WHERE blog_id = ?";
  db.query(query, [req.params.blog_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json("Successfully publish blog");
  });
};

const rejectBlog = (req, res) => {
  const query =
    "UPDATE blog SET status = 2, published_at = NOW() WHERE blog_id = ?";
  db.query(query, [req.params.blog_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json("Successfully reject blog");
  });
};

const getBlogWithTags = (req, res) => {
  const query = `
    SELECT
        b.blog_id,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name,
        b.blog_title,
        c.description AS category_description,
        b.content,
        b.status,
        b.view,
        b.visual,
        b.created_at,
        b.published_at,
        GROUP_CONCAT(t.title) AS tag_titles
    FROM
        blog b
    LEFT JOIN
        category c
    ON
        b.category_id = c.category_id
    LEFT JOIN
        user u
    ON
        b.user_id = u.user_id
    LEFT JOIN
        blog_tags bt
    ON
        b.blog_id = bt.blog_id
    LEFT JOIN
        tag t
    ON
        bt.tag_id = t.tag_id
    WHERE
        b.blog_id = ?
    GROUP BY
        b.blog_id;
  `;

  const blogId = req.params.blog_id;

  db.query(query, [blogId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    data[0].tag_titles = data[0].tag_titles.split(",");

    return res.status(200).json(data[0]);
  });
};

const saveBLog = (req, res) => {
  const blog_id = req.params.blog_id;
};

export default {
  getAllCategory,
  getPendingBlog,
  getAllTag,
  getTagById,
  createBlog,
  getCategoryById,
  getPostedBlog,
  getTagByCategory,
  createBlogTags,
  approveBlog,
  rejectBlog,
  getBlogWithTags,
};
