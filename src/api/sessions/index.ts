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
