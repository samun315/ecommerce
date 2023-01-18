const jwt = require("jsonwebtoken");

const generateRefreshToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };
