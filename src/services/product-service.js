const Product = require("../models/product-model");

const getProductInfoById = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw error;
  }
};

const getAllProductInfo = async () => {
  try {
    return await Product.find();
  } catch (error) {
    throw error;
  }
};

const getProductInfoByFilterQuery = async (query) => {
  try {
    return await Product.find(query);
  } catch (error) {
    throw error;
  }
};

const addProduct = async (req, res) => {
  try {
    return await Product.create(req.body);
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (req, res) => {
  try {
    return await Product.create(req.body);
  } catch (error) {
    throw error;
  }
};

const removeProduct = async (req, res) => {
  try {
    return await Product.create(req.body);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProductInfoById,
  getProductInfoByFilterQuery,
  addProduct,
  updateProduct,
  removeProduct,
  getAllProductInfo
};
