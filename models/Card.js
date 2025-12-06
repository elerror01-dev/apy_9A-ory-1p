import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    like: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const cards = mongoose.model("cards", cardSchema);
