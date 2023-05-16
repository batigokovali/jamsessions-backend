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
  genre: [{ type: String }],
  date: { type: Date, required: true },
  location: { lat: { type: Number }, lng: { type: Number } },
});

SessionsSchema.statics.findAllSessions = async function (query) {
  const sessions = await this.find(query.criteria, query.options.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({ path: "user", select: "username" });
  const total = await this.countDocuments(query.criteria);
  return { sessions, total };
};

export default model<ISessionDocument, ISessionsModel>(
  "session",
  SessionsSchema
);
