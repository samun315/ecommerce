const express = require("express");
const asyncHandler = require("express-async-handler");
const { addBlog, updateBlog } = require("../services/blog-service");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const blogInfo = await addBlog(req);
    res.json(blogInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const editBlog = asyncHandler(async (req, res) => {
  try {
    const updateInfo = await updateBlog(req);
    res.json(updateInfo);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBlog, editBlog };
