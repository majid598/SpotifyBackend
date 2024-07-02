import express from "express";
import passport from "passport";
import {
  deleteAccount,
  editProfile,
  login,
  logout,
  myProfile,
  newUser
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

export default router;
