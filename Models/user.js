import { hash } from "bcrypt";
import mongoose, { model } from "mongoose";
import validator from "validator";

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile: String,
    playLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayList",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      enum: ["user", "artist"],
      default: "user",
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    pinedPlayLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayList",
      },
    ],
    likedSongs: [
      {
        _id: false,
        id: String,
        title: String,
        artist: String,
        url: String,
        img: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    googleId: String,
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, 10);
});

export const User = mongoose.models.User || model("User", schema);
