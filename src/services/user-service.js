const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const {validateMongoDbId} = require("../utils/validateMongodbId");

const getUserInfo = async (email) => {
  try {
    const userInfo = User.findOne({ email: email });
    return userInfo;
  } catch (error) {
    throw error;
  }
};

const allUserInfo = async (req, res) => {
  try {
    return await User.find();
  } catch (error) {
    throw error;
  }
};

const getUserInfoById = async (id) => {
  try {
    validateMongoDbId(id);
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (id) => {
  try {
    validateMongoDbId(id);
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

const blockSingleUser = async (id) => {
  validateMongoDbId(id);
  return await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
};

const unblockSingleUser = async (id) => {
  validateMongoDbId(id);
  return await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
};

const createUser = async (req) => {
  try {
    const newUser = User.create(req.body);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const editUser = async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongoDbId(_id);
    return await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (email, password) => {
  try {
    const userInfo = await getUserInfo(email);
    const isPasswordMatch = await bcrypt.compare(password, userInfo.password);
    return isPasswordMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserInfo,
  createUser,
  allUserInfo,
  comparePassword,
  getUserInfoById,
  deleteUserById,
  editUser,
  blockSingleUser,
  unblockSingleUser,
};
