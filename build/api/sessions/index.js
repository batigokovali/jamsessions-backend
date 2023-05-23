"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../users/model"));
const jwt_1 = require("../../lib/auth/jwt");
const http_errors_1 = __importDefault(require("http-errors"));
const SessionsRouter = express_1.default.Router();
const q2m = require("query-to-mongo"); //new import syntax didn't work!
//Post a Session
SessionsRouter.post("/", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSession = new model_1.default(Object.assign({ user: req.user._id }, req.body));
        const session = yield newSession.save();
        yield model_2.default.findByIdAndUpdate(req.user._id, {
            $push: { createdSessions: session._id },
        });
        res.status(201).send({ session });
    }
    catch (error) {
        next(error);
    }
}));
//Save a session
SessionsRouter.post("/:sessionID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedSession = yield model_1.default.findById(req.params.sessionID);
        const check = yield model_2.default.find({
            _id: req.user._id,
        });
        console.log(check);
        if (check.some((user) => user.savedSessions.some((session) => session._id.toString() === req.params.sessionID))) {
            yield model_2.default.findByIdAndUpdate(req.user._id, {
                $pull: { savedSessions: savedSession === null || savedSession === void 0 ? void 0 : savedSession._id },
            });
            res.send(`Session with ID ${req.params.sessionID} is removed!`);
        }
        else {
            yield model_2.default.findByIdAndUpdate(req.user._id, {
                $push: { savedSessions: savedSession === null || savedSession === void 0 ? void 0 : savedSession._id },
            });
            res.send(`Session with ID ${req.params.sessionID} is saved!`);
        }
    }
    catch (error) {
        next(error);
    }
}));
//Remove a saved session
//Get all sessions
SessionsRouter.get("/", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoQuery = q2m(req.query);
        const { sessions, total } = yield model_1.default.findAllSessions(mongoQuery);
        res.send({
            links: mongoQuery.links(process.env.FE_DEV_URL, total),
            total,
            numberOfPages: Math.ceil(total / mongoQuery.options.limit),
            sessions,
        });
    }
    catch (error) {
        next(error);
    }
}));
//Get single session by session ID
SessionsRouter.get("/:sessionID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield model_1.default.find({
            _id: req.params.sessionID,
        }).populate({
            path: "user",
            select: "_id username avatar",
        });
        res.send(session);
    }
    catch (error) {
        next(error);
    }
}));
//Edit a session
SessionsRouter.put("/:sessionID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield model_1.default.findById(req.params.sessionID);
        if ((session === null || session === void 0 ? void 0 : session.user.toString()) === req.user._id) {
            const updatedSession = yield model_1.default.findByIdAndUpdate(req.params.sessionID, req.body, {
                new: true,
                runValidators: true,
            });
            res.send(updatedSession);
        }
        else {
            next((0, http_errors_1.default)(401, "This user does not have the permission to edit the session!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
//Delete a session
SessionsRouter.delete("/:sessionID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield model_1.default.findById(req.params.sessionID);
        if ((session === null || session === void 0 ? void 0 : session.user.toString()) === req.user._id) {
            const deletedSession = yield model_1.default.findById(req.params.sessionID);
            yield model_2.default.findByIdAndUpdate(req.user._id, {
                $pull: { createdSessions: deletedSession._id },
            });
            yield model_1.default.findByIdAndDelete(req.params.sessionID);
            res
                .status(200)
                .send(`Session with ID ${req.params.sessionID} has been deleted!`);
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = SessionsRouter;
