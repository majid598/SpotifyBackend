import { TryCatch } from "../Middlewares/error.js";
import { Folder } from "../Models/Folder.js";
import { PlayList } from "../Models/Playlist.js";
import { User } from "../Models/user.js";
import ErrorHandler from "../Utils/utility.js";

const newPlayList = TryCatch(async (req, res, next) => {
  const { folder } = req.body;
  const user = await User.findById(req.user);
  const playLists = await PlayList.find({ user: req.user });
  const playList = await PlayList.create({
    user: req.user,
    name: `My Playlist #${playLists.length + 1}`,
    folder,
  });

  user.playLists.push(playList);

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Playlist Created",
    playList,
  });
});
const newPlayListByFolder = TryCatch(async (req, res, next) => {
  const { folder } = req.body;
  const { folderId } = req.query;
  const forFolder = await Folder.findById(folderId);
  const user = await User.findById(req.user);
  const playLists = await PlayList.find({ user: req.user });
  const playList = await PlayList.create({
    user: req.user,
    name: `My Playlist #${playLists.length + 1}`,
    folder,
    folderId,
  });

  forFolder.PlayLists.push(playList);
  user.playLists.push(playList);
  await forFolder.save();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Playlist Created",
  });
});
const myPlayLists = TryCatch(async (req, res, next) => {
  const playLists = await PlayList.find({ user: req.user, folder: false })
    .sort({ createdAt: -1 })
    .populate("user", "name");
  return res.status(200).json({
    success: true,
    playLists,
  });
});
const singlePlayList = TryCatch(async (req, res, next) => {
  const playList = await PlayList.findById(req.params.id).populate(
    "user",
    "name"
  );
  return res.status(200).json({
    success: true,
    playList,
  });
});
const folderById = TryCatch(async (req, res, next) => {
  const folder = await Folder.findById(req.params.id);
  return res.status(200).json({
    success: true,
    folder,
  });
});
const folderPlaylists = TryCatch(async (req, res, next) => {
  const playLists = await PlayList.find({
    folderId: req.params.id,
    user: req.user,
  }).populate("user", "name");
  return res.status(200).json({
    success: true,
    playLists,
  });
});
const editPlayList = TryCatch(async (req, res, next) => {
  const { name, description } = req.body;
  const data = { name, description };
  if (!name) return next(new ErrorHandler("Playlist name is required", 400));
  const playList = await PlayList.findByIdAndUpdate(req.params.id, data);
  await playList.save();
  return res.status(200).json({
    success: true,
    message: "Playlist Edited",
  });
});
const deletePlayList = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  const playList = await PlayList.findById(req.params.id);
  user.playLists.pull(playList._id);
  await playList.deleteOne();
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Playlist Deleted",
  });
});
const deleteFolder = TryCatch(async (req, res, next) => {
  await Folder.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Folder Deleted",
  });
});
const addToPlayList = TryCatch(async (req, res, next) => {
  const { id, title, artist, url, img } = req.body;
  const playList = await PlayList.findById(req.params.id);
  if (playList.songs.find((song) => song.id === id))
    return next(new ErrorHandler("Song already exist"));
  const song = { id, title, artist, url, img };
  playList.songs.push(song);
  await playList.save();
  return res.status(200).json({
    success: true,
    message: `${title} add to playlist`,
  });
});
const removeFromPlayList = TryCatch(async (req, res, next) => {
  const playList = await PlayList.findById(req.params.id);
  const song = playList.songs.find((song) => song.id === req.params.songId);
  playList.songs.pull(song);
  await playList.save();
  return res.status(200).json({
    success: true,
    message: `${song.title} removed from playlist`,
  });
});
const likeSong = TryCatch(async (req, res, next) => {
  const { id, title, artist, url, img } = req.body;
  const user = await User.findById(req.user);
  if (user.likedSongs.find((song) => song.id === id))
    return next(new ErrorHandler("Song already exist"));
  const song = { id, title, artist, url, img };
  user.likedSongs.push(song);
  await user.save();
  return res.status(200).json({
    success: true,
    message: `${title} add to playlist`,
  });
});

const pinPlayList = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  const playList = await PlayList.findById(req.params.id);
  if (user.pinedPlayLists.indexOf(playList._id) === -1) {
    user.pinedPlayLists.push(playList);
  } else {
    user.pinedPlayLists.splice(user.pinedPlayLists.indexOf(playList._id), 1);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: `Playlist pinned`,
  });
});

const newFolder = TryCatch(async (req, res, next) => {
  await Folder.create({
    name: "New Folder",
    user: req.user,
  });
  return res.status(200).json({
    success: true,
    message: `Folder Created`,
  });
});
const allFolders = TryCatch(async (req, res, next) => {
  const folders = await Folder.find({ user: req.user });
  return res.status(200).json({
    success: true,
    folders,
  });
});
const moveToFolder = TryCatch(async (req, res, next) => {
  const { playlistId } = req.body;
  const folder = await Folder.findById(req.params.id);
  const playlist = await PlayList.findById(playlistId);
  folder.playLists.push(playlist);
  playlist.folderId = folder._id;
  playlist.folder = true;
  await folder.save();
  await playlist.save();
  return res.status(200).json({
    success: true,
    message: "Playlist added into folder",
  });
});

export {
  newPlayList,
  newPlayListByFolder,
  myPlayLists,
  singlePlayList,
  editPlayList,
  deletePlayList,
  addToPlayList,
  removeFromPlayList,
  likeSong,
  pinPlayList,
  newFolder,
  allFolders,
  deleteFolder,
  folderById,
  folderPlaylists,
};
