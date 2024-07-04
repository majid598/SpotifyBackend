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
  newFolder,
  allFolders,
  newPlayListByFolder,
  deleteFolder,
} from "../Controllers/PlayList.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const router = express.Router();

router.post("/new", isAuthenticated, newPlayList);
router.get("/new/folder", isAuthenticated, newFolder);
router.post("/new/by-folder", isAuthenticated, newPlayListByFolder);

router.get("/my", isAuthenticated, myPlayLists);
router.get("/my/folders", isAuthenticated, allFolders);

router.get("/get/:id", isAuthenticated, singlePlayList);
router.put("/edit/:id", isAuthenticated, editPlayList);
router.put("/pin/:id", isAuthenticated, pinPlayList);
router.post("/add-to-playlist/:id", isAuthenticated, addToPlayList);
router.post("/like/song", isAuthenticated, likeSong);
router.delete("/remove/:id/:songId", isAuthenticated, removeFromPlayList);
router.delete("/delete/folder/:id", isAuthenticated, deleteFolder);
router.delete("/delete/:id", isAuthenticated, deletePlayList);

export default router;
