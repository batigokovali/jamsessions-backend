import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model";
import { createAccessToken, createRefreshToken } from "../../lib/auth/tools";
import { JWTTokenAuth, IUserRequest } from "../../lib/auth/jwt";
import { avatarUploader } from "../../lib/cloudinary";
import passport from "passport";
import { IGoogleLoginRequest } from "../../lib/auth/googleOAuth";

const q2m = require("query-to-mongo");

const UsersRouter = Express.Router();

//Sign Up ✅
UsersRouter.post("/register", async (req, res, next) => {
  try {
    const emailInUse = await UsersModel.findOne({ email: req.body.email });
    if (!emailInUse) {
      const newUser = new UsersModel(req.body);
      const user = await newUser.save();
      const payload = { _id: user._id, email: user.email };
      const accessToken = await createAccessToken(payload);
      const refreshToken = await createRefreshToken(payload);
      await UsersModel.findByIdAndUpdate(user._id, { refreshToken });
      res.status(201).send({ user, accessToken, refreshToken });
    } else {
      res
        .status(409)
        .send({ message: `This email '${req.body.email}' is already in use!` });
    }
  } catch (error) {
    next(error);
  }
});

//Login ✅
UsersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, email: user.email };
      const accessToken = await createAccessToken(payload);
      const refreshToken = await createRefreshToken(payload);
      res.send({ user, accessToken, refreshToken });
    } else {
      next(createHttpError(401, "Creditentials are wrong!"));
    }
  } catch (error) {
    next(error);
  }
});

//Login with Google ✅
UsersRouter.get(
  "/login/googleLogin",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
  async (req, res, next) => {
    try {
      res.redirect(
        `${process.env.FE_DEV_URL}/app?accessToken=${
          (req.user as IGoogleLoginRequest).accessToken
        }`
      );
      console.log(req.user);
    } catch (error) {
      next(error);
    }
  }
);

// Log out ✅
UsersRouter.delete("/delete", JWTTokenAuth, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate((req as IUserRequest).user!._id, {
      refreshToken: "",
    });
    res.send({ message: "Successfully logged out!" });
  } catch (error) {
    next(error);
  }
});

// Get profile info ✅
UsersRouter.get("/me", JWTTokenAuth, async (req, res, next) => {
  try {
    const mongoQuery = (req as IUserRequest).user!._id;
    const { user } = await UsersModel.SavedAndCreatedSessions(mongoQuery);
    res.send({ user });
  } catch (error) {
    next(error);
  }
});

// Edit profile info ✅
UsersRouter.put("/me", avatarUploader, JWTTokenAuth, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate((req as IUserRequest).user!._id, {
      avatar: req.file?.path,
      ...req.body,
    });
  } catch (error) {
    next(error);
  }
});

// Get users by ID ✅
UsersRouter.get("/:userID", JWTTokenAuth, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userID);
    if (user) res.send(user);
    else
      next(
        createHttpError(404, `User with id ${req.params.userID} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

// Set an avatar ✅
UsersRouter.post(
  "/me/avatar",
  avatarUploader,
  JWTTokenAuth,
  async (req, res, next) => {
    await UsersModel.findByIdAndUpdate((req as IUserRequest).user!._id, {
      avatar: req.file?.path,
    });
    res.send({ avatarURL: req.file?.path });
  }
);

export default UsersRouter;
