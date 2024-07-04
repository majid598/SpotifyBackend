import mongoose, { model } from "mongoose";

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    PlayLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayList",
      },
    ],
    name: String,
    photo: String,
  },
  {
    timestamps: true,
  }
);

export const Folder = mongoose.models.Folder || model("Folder", schema);
