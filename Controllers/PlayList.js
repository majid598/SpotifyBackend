import { TryCatch } from "../Middlewares/error.js";
import { PlayList } from "../Models/Playlist.js";
import { User } from "../Models/user.js";
import ErrorHandler from "../Utils/utility.js";

const newPlayList = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  const playLists = await PlayList.find({ user: req.user });
  const playList = await PlayList.create({
    user: req.user,
    name: `My Playlist #${playLists.length + 1}`,
  });

  user.playLists.push(playList);

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Playlist Created",
    playList,
  });
});
const myPlayLists = TryCatch(async (req, res, next) => {
  const playLists = await PlayList.find({ user: req.user })
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
  console.log(req.user);
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

export {
  newPlayList,
  myPlayLists,
  singlePlayList,
  editPlayList,
  deletePlayList,
  addToPlayList,
  removeFromPlayList,
  likeSong,
  pinPlayList,
};
