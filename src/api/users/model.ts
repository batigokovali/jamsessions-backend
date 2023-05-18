import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument, IUsersModel } from "../../interfaces/IUser";
import createHttpError from "http-errors";
import { JWTTokenAuth, IUserRequest } from "../../lib/auth/jwt";

const UsersSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    required: true,
    default: "https://musicalbrick.com/wp-content/uploads/2019/08/KTS-1.jpg",
  },
  savedSessions: [{ type: mongoose.Types.ObjectId, ref: "session" }],
  createdSessions: [{ type: mongoose.Types.ObjectId, ref: "session" }],
  refreshToken: { type: String },
  location: { lat: { type: Number }, lng: { type: Number } },
  role: [{ type: String }],
  googleID: { type: String },
});

UsersSchema.pre("save", async function () {
  const newUser = this;
  if (newUser.password && newUser.isModified("password")) {
    const password = newUser.password;
    const hashedPW = await bcrypt.hash(password, 11);
    newUser.password = hashedPW;
  }
});

UsersSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as { password?: string };
  if (update.password) {
    const password = update.password;
    const hashedPW = await bcrypt.hash(password, 11);
    update.password = hashedPW;
  }
});

UsersSchema.methods.toJSON = function () {
  const currentUserDoc = this;
  const currentUser = currentUserDoc.toObject();
  delete currentUser.password;
  delete currentUser.createdAt;
  delete currentUser.updatedAt;
  delete currentUser.__v;
  return currentUser;
};

UsersSchema.statics.SavedAndCreatedSessions = async function (query) {
  const user = await this.findById(query).populate({
    path: "savedSessions createdSessions",
    populate: {
      path: "user",
      select: "_id username avatar",
    },
    select: "_id user title description role genre date location",
  });
  return { user };
};

UsersSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password);
    if (passwordMatch) return user;
    else throw new createHttpError[401]("Wrong password!");
  } else throw new createHttpError[401](`No user found!`);
});

export default model<IUserDocument, IUsersModel>("user", UsersSchema);
