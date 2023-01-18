const express = require("express");
const productRouter = express.Router();

const {
  createProduct,
  editProduct,
  deleteProduct,
  getaProduct,
  getAllProducts
} = require("../controller/product-controller");

productRouter.post("/create", createProduct);
productRouter.get("/:id", getaProduct);
productRouter.get("/", getAllProducts);

module.exports = productRouter;
