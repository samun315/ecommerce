const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {
  addProduct,
  getProductInfoById,
  getAllProductInfo,
  updateProduct,
  removeProduct
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
    const productInfo = await getAllProductInfo(req);
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const productInfo = await addProduct(req);
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const editProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const productInfo = await updateProduct(req);
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productInfo = await removeProduct(req);
    res.json(productInfo);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, editProduct, deleteProduct, getaProduct, getAllProducts };
