import userRoutes from "./user.route.js";
import blogRoutes from "./blog.route.js";
import authRoutes from "./auth.route.js";
import commentsRoutes from "./comments.route.js";
import likesRoutes from "./likes.route.js";
import moderatorRoutes from "./moderator.route.js";
import notificationRoute from "./notification.route.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FU-BLOG COMMUNITY",
      version: "0.1",
      description:
        "This is the document for API of FU-BLOG COMMUNITY made with Express and documented by Swagger.",
      contact: {
        name: "ducnltdev",
        email: "ducnltdev@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const spacs = swaggerJsdoc(options);

const initRoutes = (app) => {
  app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spacs));
  app.use("/api/auth", authRoutes);
  app.use("/api/comments", commentsRoutes);
  app.use("/api/likes", likesRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/moderator", moderatorRoutes);
  app.use("/api/notification", notificationRoute);
};

export default initRoutes;
