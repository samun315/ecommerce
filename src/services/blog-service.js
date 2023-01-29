const express = require("express");
const validateMongoDbId = require("../utils/validateMongodbId");

const Blog = require("../models/blog-model");
const expressAsyncHandler = require("express-async-handler");

const addBlog = async (req, res) => {
  try {
    return await Blog.create(req.body);
  } catch (error) {
    throw error;
  }
};

const updateBlog = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    return await Blog.findByIdAndUpdate(id, req.body, { new: true });
  } catch (error) {
    throw error;
  }
});

module.exports = { addBlog, updateBlog };
