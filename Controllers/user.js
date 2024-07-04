import bcrypt, { compare } from "bcrypt";
import passport from "passport";
import { TryCatch } from "../Middlewares/error.js";
import { User } from "../Models/user.js";
import { cookieOptions, sendToken } from "../Utils/features.js";
import ErrorHandler from "../Utils/utility.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const newUser = TryCatch(async (req, res, next) => {
  const { email, name, password } = req.body;
  console.log(email, name, password);

  if (!email || !name || !password)
    return next(new ErrorHandler("All Feilds Are Required", 404));

  const user = await User.create({
    email,
    name,
    password,
  });

  sendToken(res, user, 200, `Account Registration Successful`);
});

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Email Or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Invalid Email Or Password", 404));

  sendToken(res, user, 200, `Welcome Back Mr ${user.name}`);
});

const myProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  return res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("logoMaker-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const googleLogin = TryCatch(async (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
});

const editProfile = TryCatch(async (req, res, next) => {
  const { name, profile } = req.body;
  const updatedData = {
    name,
    profile,
  };
  const user = await User.findByIdAndUpdate(req.user, updatedData);
  if (!req.user) return next(new ErrorHandler("No Account Found!", 404));

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Account Updated",
  });
});

const deleteAccount = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Account Deleted",
  });
});
const getAllUser = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});
const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  return res.status(200).json({
    success: true,
    user,
  });
});
const followUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const me = await User.findById(req.user);

  if (user.followers.indexOf(me._id) === -1) {
    user.followers.push(me._id);
  } else {
    user.followers.splice(user.followers.indexOf(me._id), 1);
  }
  if (me.following.indexOf(user._id) === -1) {
    me.following.push(user._id);
  } else {
    me.following.splice(me.following.indexOf(user._id), 1);
  }
  await user.save();
  await me.save();
  return res.status(200).json({
    success: true,
    message: `You Followed ${user.name}`,
  });
});

export {
  editProfile,
  googleLogin,
  login,
  logout,
  myProfile,
  newUser,
  deleteAccount,
  getAllUser,
  getUser,followUser
};
