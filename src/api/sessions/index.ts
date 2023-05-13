import Express from "express";
import SessionsModel from "./model";
import UsersModel from "../users/model";
import { JWTTokenAuth, IUserRequest } from "../../lib/auth/jwt";
import createHttpError from "http-errors";

const SessionsRouter = Express.Router();
const q2m = require("query-to-mongo"); //new import syntax didn't work!

//Post a Session
SessionsRouter.post("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const newSession = new SessionsModel({
      user: (req as IUserRequest).user!._id,
      ...req.body,
    });
    const session = await newSession.save();
    await UsersModel.findByIdAndUpdate((req as IUserRequest).user!._id, {
      $push: { createdSessions: session._id },
    });
    res.status(201).send({ session });
  } catch (error) {
    next(error);
  }
});

//Save a session
SessionsRouter.post("/:sessionID", JWTTokenAuth, async (req, res, next) => {
  try {
    const savedSession = await SessionsModel.findById(req.params.sessionID);
    const check = await UsersModel.find({
      savedSessions: { _id: req.params.sessionID },
    });
    console.log(check);
    if (
      check.some((user) =>
        user.savedSessions.some(
          (session) => session._id.toString() === req.params.sessionID
        )
      )
    ) {
      await UsersModel.findByIdAndUpdate(
        (req as IUserRequest).user!._id,
        {
          $pull: { savedSessions: savedSession?._id },
        },
        { new: true }
      );
      res.send(`Session with ID ${req.params.sessionID} is removed!`);
    } else {
      await UsersModel.findByIdAndUpdate(
        (req as IUserRequest).user!._id,
        {
          $push: { savedSessions: savedSession?._id },
        },
        { new: true }
      );
      res.send(`Session with ID ${req.params.sessionID} is saved!`);
    }
  } catch (error) {
    next(error);
  }
});

//Remove a saved session

//Get all sessions
SessionsRouter.get("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { sessions, total } = await SessionsModel.findAllSessions(mongoQuery);
    res.send({
      links: mongoQuery.links(process.env.FE_DEV_URL, total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      sessions,
    });
  } catch (error) {
    next(error);
  }
});

//Get single session by session ID
SessionsRouter.get("/:sessionID", JWTTokenAuth, async (req, res, next) => {
  try {
    const session = await SessionsModel.find({
      _id: req.params.sessionID,
    });
    res.send(session);
  } catch (error) {
    next(error);
  }
});

//Edit a session
SessionsRouter.put("/:sessionID", JWTTokenAuth, async (req, res, next) => {
  try {
    const session = await SessionsModel.findById(req.params.sessionID);
    if (session?.user.toString() === (req as IUserRequest).user!._id) {
      const updatedSession = await SessionsModel.findByIdAndUpdate(
        req.params.sessionID,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.send(updatedSession);
    } else {
      next(
        createHttpError(
          401,
          "This user does not have the permission to edit the session!"
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//Delete a session
SessionsRouter.delete("/:sessionID", JWTTokenAuth, async (req, res, next) => {
  try {
    const session = await SessionsModel.findById(req.params.sessionID);
    if (session?.user.toString() === (req as IUserRequest).user!._id) {
      const deletedSession = await SessionsModel.findById(req.params.sessionID);
      await UsersModel.findByIdAndUpdate((req as IUserRequest).user!._id, {
        $pull: { createdSessions: deletedSession!._id },
      });
      await SessionsModel.findByIdAndDelete(req.params.sessionID);
      res
        .status(200)
        .send(`Session with ID ${req.params.sessionID} has been deleted!`);
    }
  } catch (error) {
    next(error);
  }
});

export default SessionsRouter;
