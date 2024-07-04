import express from "express";
import passport from "passport";
import {
  deleteAccount,
  editProfile,
  followUser,
  getAllUser,
  getUser,
  login,
  logout,
  myProfile,
  newUser,
} from "../Controllers/user.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const router = express.Router();

router.post("/new", newUser);

router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/login",
  passport.authenticate("google", { failureRedirect: "/api/v1/user/google" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, myProfile);
router.put("/me/profile/edit", isAuthenticated, editProfile);
router.delete("/me/profile/delete", isAuthenticated, deleteAccount);
router.get("/get/all", isAuthenticated, getAllUser);
router.get("/get/:id", isAuthenticated, getUser);
router.get("/follow/:id", isAuthenticated, followUser);

export default router;
