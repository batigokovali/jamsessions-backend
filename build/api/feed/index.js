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
const jwt_1 = require("../../lib/auth/jwt");
const http_errors_1 = __importDefault(require("http-errors"));
const cloudinary_1 = require("../../lib/cloudinary");
const FeedsRouter = express_1.default.Router();
//Post a Feed
FeedsRouter.post("/", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newFeed = new model_1.default(Object.assign({ user: req.user._id }, req.body));
        const feed = yield newFeed.save();
        res.status(201).send({ feed });
    }
    catch (error) {
        next(error);
    }
}));
//Get all feeds for logged in user
FeedsRouter.get("/", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeds = yield model_1.default.find({
            user: req.user._id,
        });
        res.send(feeds);
    }
    catch (error) {
        next(error);
    }
}));
//Get all feeds for a user
FeedsRouter.get("/user/:userID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeds = yield model_1.default.find({
            user: req.params.userID,
        });
        res.send(feeds);
    }
    catch (error) {
        next(error);
    }
}));
//Edit a feed
FeedsRouter.put("/:feedID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feed = yield model_1.default.findById(req.params.feedID);
        if ((feed === null || feed === void 0 ? void 0 : feed.user.toString()) === req.user._id) {
            const updatedFeed = yield model_1.default.findByIdAndUpdate(req.params.feedID, req.body, { new: true, runValidators: true });
            res.send(updatedFeed);
        }
        else {
            next((0, http_errors_1.default)(401, "This user does not have the permission to edit the feed!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
//Delete a feed
FeedsRouter.delete("/:feedID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feed = yield model_1.default.findById(req.params.feedID);
        if ((feed === null || feed === void 0 ? void 0 : feed.user.toString()) === req.user._id) {
            const updatedFeed = yield model_1.default.findByIdAndDelete(req.params.feedID);
            res.send().status(201);
        }
        else {
            next((0, http_errors_1.default)(401, "This user does not have the permission to edit the feed!"));
        }
        res.status(200).send();
    }
    catch (error) {
        next(error);
    }
}));
//fetch a feed by ID from params
FeedsRouter.get("/:feedID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feed = yield model_1.default.findById(req.params.feedID);
        res.send(feed);
    }
    catch (error) {
        next(error);
    }
}));
//fetch a feed by ID from body
FeedsRouter.get("/", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feed = yield model_1.default.findById(req.body.feedID);
        res.send(feed);
    }
    catch (error) {
        next(error);
    }
}));
//Post a media to Feed
FeedsRouter.post("/media", cloudinary_1.mediaUploader, jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newFeed = new model_1.default(Object.assign({ user: req.user._id, media: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }, req.body));
        const feed = yield newFeed.save();
        res.status(201).send({ feed });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = FeedsRouter;
