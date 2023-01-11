const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getUserInfoById, getUserInfo } = require("../services/user-service");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  //console.log("test: ", req.headers.authorization);
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userInfo = await getUserInfoById(decoded.id);
        req.user = userInfo;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired, Please login again.");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await getUserInfo(email);
  if (adminUser.role !== "admin") {
    throw new Error("You are not an admin.");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
