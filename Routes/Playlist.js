import express from "express";
import {
  myPlayLists,
  newPlayList,
  singlePlayList,
  editPlayList,
  deletePlayList,
  addToPlayList,
  removeFromPlayList,
  pinPlayList,
  likeSong,
} from "../Controllers/PlayList.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const router = express.Router();

router.get("/new", isAuthenticated, newPlayList);

router.get("/my", isAuthenticated, myPlayLists);

router.get("/get/:id", isAuthenticated, singlePlayList);
router.put("/edit/:id", isAuthenticated, editPlayList);
router.put("/pin/:id", isAuthenticated, pinPlayList);
router.post("/add-to-playlist/:id", isAuthenticated, addToPlayList);
router.post("/like/song", isAuthenticated, likeSong);
router.delete("/remove/:id/:songId", isAuthenticated, removeFromPlayList);
router.delete("/delete/:id", isAuthenticated, deletePlayList);

export default router;
