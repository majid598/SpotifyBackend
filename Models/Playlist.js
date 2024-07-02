import { hash } from "bcrypt";
import mongoose, { model } from "mongoose";
import validator from "validator";

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    photo: String,
    description: String,
    songs: [
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
  },
  {
    timestamps: true,
  }
);

export const PlayList = mongoose.models.PlayList || model("PlayList", schema);
