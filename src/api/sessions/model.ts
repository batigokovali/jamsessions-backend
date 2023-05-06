import mongoose, { Schema, model } from "mongoose";
import { ISessionDocument, ISessionsModel } from "../../interfaces/ISession";

const SessionsSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  comments: [
    { user: { type: mongoose.Types.ObjectId, ref: "user" } },
    { comment: { type: String } },
  ],
  role: [{ type: String }],
  date: { type: Date, required: true },
  geolocation: { type: String },
});

export default model<ISessionDocument, ISessionsModel>(
  "session",
  SessionsSchema
);
