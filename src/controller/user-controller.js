const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  getUserInfo,
  getUserInfoByQuery,
  createUser,
  comparePassword,
  allUserInfo,
  getUserInfoById,
  deleteUserById,
  editUser,
  blockSingleUser,
  unblockSingleUser,
} = require("../services/user-service");
const { generateToken } = require("../../config/jwt-token");
const { generateRefreshToken } = require("../../config/refreshToken");

// create user
const addUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const userInfo = await getUserInfo(email);

    if (!userInfo) {
      //create a user
      const userData = await createUser(req);
      res.json(userData);
    } else {
      const customError = new Error("User already in exist");
      customError.statusCode = 400;
      throw customError;
    }
  } catch (error) {
    throw error;
  }
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  try {
    updatedInfo = await editUser(req);
    res.send(updatedInfo);
  } catch (error) {
    throw new Error(error);
  }
});

// login user
const userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await getUserInfo(email);
    const passwordMatch = await comparePassword(email, password);
    if (passwordMatch) {
      const refreshToken = await generateRefreshToken(userInfo._id);
      req.body = { _id: userInfo._id, refreshToken: refreshToken };
      const updateUser = editUser(req);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: userInfo._id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        mobile: userInfo.mobile,
        token: await generateToken(userInfo._id),
      });
    } else {
      const customError = new Error("Invalid credential");
      customError.statusCode = 400;
      throw customError;
    }
  } catch (error) {
    throw error;
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No refresh token found in cookies!");
  const refreshToken = cookie.refreshToken;
  const query = { refreshToken: refreshToken };
  const userInfo = await getUserInfoByQuery(query);
  if (!userInfo) throw new Error("No refresh token found in DB");
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || userInfo.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = await generateToken(userInfo._id);
    res.json({ accessToken });
  });
});

//logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const userInfo = await getUserInfoByQuery({"refreshToken": refreshToken});
  if (!userInfo) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204)  //forbiden
  }

  req.body = {_id: userInfo._id, refreshToken: "" }
  const updateInfo = await editUser(req);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);  //forbiden

});
// get all user
const getAllUser = asyncHandler(async (req, res) => {
  const userInfos = await allUserInfo();
  res.send(userInfos);
});

//get single user
const getSigleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const singleUserInfo = await getUserInfoById(id);
    res.send(singleUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

//delete user
const deleteSigleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUserInfo = await deleteUserById(id);
    res.send(deletedUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

//block user
const blockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const blockedUserInfo = await blockSingleUser(id);
    res.send(blockedUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

//unblock user
const unblockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const blockedUserInfo = await unblockSingleUser(id);
    res.send(blockedUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addUser,
  userLogin,
  getAllUser,
  getSigleUser,
  deleteSigleUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
};
