const express = require("express");
const router = express.Router();

const {
  addUser,
  userLogin,
  logout,
  getAllUser,
  getSigleUser,
  deleteSigleUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
} = require("../controller/user-controller");

const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

router.post("/register", addUser);
router.post("/login", userLogin);
router.get("/all-user", getAllUser);
router.get("/handle", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getSigleUser);
router.delete("/:id", deleteSigleUser);
//router.put("/:id", updateUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
