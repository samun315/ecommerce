const asyncHandler = require("express-async-handler");
const {
  addProduct,
  getProductInfoById,
  getAllProductInfo
} = require("../services/product-service");

const getaProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const productInfo = await getProductInfoById(id);
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const productInfo = await getAllProductInfo();
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const productInfo = await addProduct(req);
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const editProduct = asyncHandler(async (req, res) => {
  try {
    const productInfo = await addProduct(req);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productInfo = await addProduct(req);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, editProduct, deleteProduct, getaProduct, getAllProducts };
