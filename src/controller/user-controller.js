const asyncHandler = require("express-async-handler");
const {
  getUserInfo,
  createUser,
  comparePassword,
  allUserInfo,
  getUserInfoById,
  deleteUserById,
  editUser,
  blockSingleUser,
  unblockSingleUser
} = require("../services/user-service");
const { generateToken } = require("../../config/jwt-token");

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

const updateUser = asyncHandler(async (req, res) => {
  try {
    updatedInfo = await editUser(req);
    res.send(updatedInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await getUserInfo(email);
    const passwordMatch = await comparePassword(email, password);
    if (passwordMatch) {
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

const getAllUser = asyncHandler(async (req, res) => {
  const userInfos = await allUserInfo();
  res.send(userInfos);
});

const getSigleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const singleUserInfo = await getUserInfoById(id);
    res.send(singleUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSigleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUserInfo = await deleteUserById(id);
    res.send(deletedUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const blockedUserInfo = await blockSingleUser(id);
    res.send(blockedUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

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
  unblockUser
};
