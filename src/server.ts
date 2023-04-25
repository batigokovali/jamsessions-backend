import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import express from "express";
import cors, { CorsOptions } from "cors";
import { badRequestHandler, unauthorizedHandler, forbiddenHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers";
import CreateHttpError from "http-errors";
import { googleStrategy } from "./lib/auth/googleOAuth";
import passport from "passport";

//Connection
const port = process.env.PORT || 3001;
const server = express();
passport.use("google", googleStrategy);

//Cors
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions: CorsOptions = {
  origin: (currentOrigin, corsNext) => {
    if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {corsNext(null, true);} 
    else {
      corsNext(CreateHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))}
  },
};

server.use(cors(corsOptions));
server.use(express.json());

//Endpoints

//Error Handlers
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

//Mongoose
mongoose.connect(process.env.MONGO_DEV_URL as string);
mongoose.connection.on("connected", () => {console.log("Connection established to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
