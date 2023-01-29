const express = require("express");
const blogRoute = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

const { createBlog, editBlog } = require("../controller/blog-controller");

blogRoute.post("/create", authMiddleware, isAdmin, createBlog);
blogRoute.put("/update/:id", authMiddleware, isAdmin, editBlog);

module.exports = blogRoute;
