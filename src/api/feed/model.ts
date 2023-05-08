import mongoose, { Schema, model } from "mongoose";
import { IFeedDocument, IFeedsModel } from "../../interfaces/IFeed";

const FeedsSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: { type: String },
  },
  { timestamps: true }
);

// FeedsSchema.statics.findAll

export default model<IFeedDocument, IFeedsModel>("feed", FeedsSchema);
