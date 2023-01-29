const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../config/jwt-token");
const { generateRefreshToken } = require("../../config/refreshToken");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const crypto = require("crypto");
const { sendEmail } = require("./email-controller");
const User = require('../models/user-model');

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
  updatePassword,
} = require("../services/user-service");

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
    throw new Error(error);
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
    throw new Error(error);
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
  const userInfo = await getUserInfoByQuery({ refreshToken: refreshToken });
  if (!userInfo) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbiden
  }

  req.body = { _id: userInfo._id, refreshToken: "" };
  const updateInfo = await editUser(req);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //forbiden
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

//update password
const editPassword = asyncHandler(async (req, res) => {
  try {
    const updateInfo = await updatePassword(req);
    res.json(updateInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await getUserInfo(email);
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    //console.log("user", user);
    await user.save();

    const resetUrl = `Hi, Please follow this link to reset your password. This link is valid till 10 munites from now. <a href="http://localhost:500/api/user/password-reset/${token}">click here</a>`;
    const data = {
      to: email,
      text: "Hey user",
      subject: "Forgot password link",
      html: resetUrl,
    };
    //console.log(data);
    await sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {$gt: Date.now()},
  });
  if (!user) throw new Error('Token expired, Please try again');
  user.password = password;
  user.passwordResetToken = undefined,
  user.passwordResetExpires = undefined,
  await user.save();
  res.json(user);
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
  editPassword,
  forgotPasswordToken,
  resetPassword
};
