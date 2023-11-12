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
  const page = parseInt(req.query.page);
  const page_size = 6;
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

const getCategoryPostById = (req, res) => {
  const page = parseInt(req.query.page);
  const page_size = 6;
  const offset = (page - 1) * page_size;

  const countQuery = `
    SELECT COUNT(*) AS total_count
    FROM blog
    WHERE category_id = ?;
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
        b.category_id = ? and status = 1 m
    GROUP BY
        b.blog_id
    ORDER BY
        b.published_at DESC
    LIMIT
        ?
    OFFSET
        ?;
  `;

  db.query(countQuery, [req.params.category_id], (countErr, countData) => {
    if (countErr) {
      console.error(countErr);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      const total_count = countData[0].total_count;
      const total_pages = Math.ceil(total_count / page_size);

      db.query(
        query,
        [req.params.category_id, page_size, offset],
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
  const blogId = req.params.blog_id;

  const queryBlogData = `
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

  const queryRelatedBlogIds = `
    SELECT
        b.blog_id
    FROM
        blog b
    WHERE
        b.category_id = (
            SELECT
                b.category_id
            FROM
                blog b
            WHERE
                b.blog_id = ?
        )
        AND b.blog_id <> ?
    ORDER BY
        b.created_at DESC
    LIMIT 3;
  `;

  db.query(queryBlogData, [blogId], (err, resultBlogData) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (resultBlogData.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const blogData = resultBlogData[0];
    blogData.tag_titles = blogData.tag_titles.split(",");

    db.query(
      queryRelatedBlogIds,
      [blogId, blogId],
      (err, resultRelatedBlogIds) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const relatedBlogIds = resultRelatedBlogIds.map((blog) => blog.blog_id);

        return res.status(200).json({ blogData, relatedBlogIds });
      }
    );
  });
};

const saveBlog = (req, res) => {
  const { blog_id, user_id } = req.body;
  const save_id = uuidv4();
  const query = `INSERT INTO blog_save (saved_id, blog_id, user_id, created_at)
  VALUES (?,?,?, NOW());`;
  db.query(query, [save_id, blog_id, user_id], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json({ message: "Post saved" });
  });
};

const unsaveBlog = (req, res) => {
  const { blog_id, user_id } = req.params;
  const query = `DELETE FROM blog_save WHERE user_id = ? and blog_id = ?`;
  db.query(query, [user_id, blog_id], (err, data) => {
    console.log(blog_id, user_id);
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json({ message: "Deleted saved" });
  });
};

const searchBlogsByCategoryAndTitle = (req, res) => {
  const categoryId = req.body.category_id;
  const searchString = req.body.search;
  console.log(categoryId, searchString);
  const query = `
    SELECT blog_id, blog_title AS title, visual
    FROM blog
    WHERE category_id = ? AND blog_title LIKE ?
  `;
  const searchPattern = `%${searchString}%`;
  db.query(query, [categoryId, searchPattern], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(data);
  });
};

const getFeaturedBlogs = (req, res) => {
  const query = `SELECT
 b.blog_id,
 u.user_id,
 b.blog_title,
 b.visual AS blogImage,
 CONCAT(u.first_name, ' ', u.last_name) AS postedBy,
 u.image as userImage,
 b.content,
 c.description AS category,
 b.created_at,
 COUNT(bl.like_id) AS like_count
FROM
 blog b
LEFT JOIN
 blog_like bl
ON
 b.blog_id = bl.blog_id
JOIN
 user u ON b.user_id = u.user_id
JOIN
 category c ON b.category_id = c.category_id
 WHERE
 b.status = 1
GROUP BY
 b.blog_id, b.blog_title, b.visual, postedBy, b.content,  c.description, b.created_at
ORDER BY
 b.published_at DESC, like_count DESC
  LIMIT 3;`;
  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

const getMajorBlog = (req, res) => {
  const categoryId = req.params.category_id;

  const query = `SELECT
  b.blog_id,
  u.user_id,
  b.blog_title,
  b.visual AS blogImage,
  CONCAT(u.first_name, ' ', u.last_name) AS postedBy,
  u.image as userImage,
  b.content,
  c.description AS category,
  b.created_at,
  COUNT(bl.like_id) AS like_count
FROM
  blog b
LEFT JOIN
  blog_like bl ON b.blog_id = bl.blog_id
JOIN
  user u ON b.user_id = u.user_id
JOIN
  category c ON b.category_id = c.category_id
WHERE
  b.category_id = ? AND b.status = 1
GROUP BY
  b.blog_id
ORDER BY
  b.published_at DESC
LIMIT 6;`;

  db.query(query, [categoryId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
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
  searchBlogsByCategoryAndTitle,
  getFeaturedBlogs,
  getMajorBlog,
  saveBlog,
  unsaveBlog,
  getCategoryPostById,
};
