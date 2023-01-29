const { Router } = require("express");

const authRouter = require("./auth-route");
const productRouter = require("./product-route");
const blogRouter = require("./blog-route");

const { notFound, errorHandler } = require("../middlewares/error-handler");

const router = Router();

router.use("/api/user", authRouter);
router.use("/api/products", productRouter);
router.use("/api/blogs", blogRouter);

router.use(notFound);

module.exports = router;
