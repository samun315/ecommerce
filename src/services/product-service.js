const Product = require("../models/product-model");

const getProductInfoById = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw error;
  }
};

const getAllProductInfo = async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((element) => delete queryObj[element]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exist!");
    }

    return await query;
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
    const { id } = req.params;
    return await Product.findByIdAndUpdate(id, req.body, { new: true });
  } catch (error) {
    throw error;
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    return await Product.findByIdAndDelete(id);
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
  getAllProductInfo,
};
