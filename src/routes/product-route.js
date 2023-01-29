const express = require("express");
const productRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

const {
  createProduct,
  editProduct,
  deleteProduct,
  getaProduct,
  getAllProducts,
} = require("../controller/product-controller");

productRouter.post("/create", authMiddleware, isAdmin, createProduct);
productRouter.get("/:id", authMiddleware, isAdmin, getaProduct);
productRouter.put("/update/:id", authMiddleware, isAdmin, editProduct);
productRouter.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);
productRouter.get("/", authMiddleware, isAdmin, getAllProducts);

module.exports = productRouter;
