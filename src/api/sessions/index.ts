import Express from "express";
import SessionsModel from "./model";
import UsersModel from "../users/model";
import { JWTTokenAuth, IUserRequest } from "../../lib/auth/jwt";
import createHttpError from "http-errors";
import { ISession } from "../../interfaces/ISession";

const SessionsRouter = Express.Router();

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
    // user?.createdsessions.push(newSession?._id.toString());
    res.status(201).send({ session });
  } catch (error) {
    next(error);
  }
});

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

export default SessionsRouter;