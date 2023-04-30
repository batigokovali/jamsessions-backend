import cors, { CorsOptions } from "cors";
import express from "express";
import createHttpError from "http-errors";
import googleStrategy from "./lib/auth/googleOAuth";
import passport from "passport";
import {
  badRequestHandler,
  unauthorizedHandler,
  forbiddenHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers";
import UsersRouter from "./api/users";
import FeedsRouter from "./api/feed";
import SessionsRouter from "./api/sessions";

//Connection
const expressServer = express();
passport.use("google", googleStrategy);

//Cors
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions: CorsOptions = {
  origin: (currentOrigin, corsNext) => {
    if (!currentOrigin || whitelist.includes(currentOrigin)) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(
          400,
          `The following origin is not allowed! ${currentOrigin}`
        )
      );
    }
  },
};

expressServer.use(cors(corsOptions));
expressServer.use(express.json());

//Endpoints
expressServer.use("/users", UsersRouter);
expressServer.use("/feed", FeedsRouter);
expressServer.use("/sessions", SessionsRouter);

//Error Handlers
expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

export { expressServer };
