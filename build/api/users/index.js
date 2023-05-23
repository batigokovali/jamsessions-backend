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
const http_errors_1 = __importDefault(require("http-errors"));
const model_1 = __importDefault(require("./model"));
const tools_1 = require("../../lib/auth/tools");
const jwt_1 = require("../../lib/auth/jwt");
const cloudinary_1 = require("../../lib/cloudinary");
const passport_1 = __importDefault(require("passport"));
const q2m = require("query-to-mongo");
const UsersRouter = express_1.default.Router();
//Sign Up ✅
UsersRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailInUse = yield model_1.default.findOne({ email: req.body.email });
        if (!emailInUse) {
            const newUser = new model_1.default(req.body);
            const user = yield newUser.save();
            const payload = { _id: user._id, email: user.email };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            const refreshToken = yield (0, tools_1.createRefreshToken)(payload);
            yield model_1.default.findByIdAndUpdate(user._id, { refreshToken });
            res.status(201).send({ user, accessToken, refreshToken });
        }
        else {
            res
                .status(409)
                .send({ message: `This email '${req.body.email}' is already in use!` });
        }
    }
    catch (error) {
        next(error);
    }
}));
//Login ✅
UsersRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_1.default.checkCredentials(email, password);
        if (user) {
            const payload = { _id: user._id, email: user.email };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            const refreshToken = yield (0, tools_1.createRefreshToken)(payload);
            res.send({ user, accessToken, refreshToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Creditentials are wrong!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
//Login with Google ✅
UsersRouter.get("/login/googleLogin", passport_1.default.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.redirect(`${process.env.FE_DEV_URL}/home?accessToken=${req.user.accessToken}`);
        console.log(req.user);
    }
    catch (error) {
        next(error);
    }
}));
// Log out ✅
UsersRouter.delete("/delete", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.default.findByIdAndUpdate(req.user._id, {
            refreshToken: "",
        });
        res.send({ message: "Successfully logged out!" });
    }
    catch (error) {
        next(error);
    }
}));
// Get profile info ✅
UsersRouter.get("/me", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoQuery = req.user._id;
        const { user } = yield model_1.default.SavedAndCreatedSessions(mongoQuery);
        res.send({ user });
    }
    catch (error) {
        next(error);
    }
}));
// Edit profile info ✅
UsersRouter.put("/me", cloudinary_1.avatarUploader, jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const updatedUser = yield model_1.default.findByIdAndUpdate(req.user._id, Object.assign({ avatar: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }, req.body));
        yield updatedUser.save();
        res.send("Password changed successfully!");
    }
    catch (error) {
        next(error);
    }
}));
// Get users by ID ✅
UsersRouter.get("/:userID", jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.params.userID);
        if (user)
            res.send(user);
        else
            next((0, http_errors_1.default)(404, `User with id ${req.params.userID} not found!`));
    }
    catch (error) {
        next(error);
    }
}));
// Set an avatar ✅
UsersRouter.post("/me/avatar", cloudinary_1.avatarUploader, jwt_1.JWTTokenAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    yield model_1.default.findByIdAndUpdate(req.user._id, {
        avatar: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path,
    });
    res.send({ avatarURL: (_c = req.file) === null || _c === void 0 ? void 0 : _c.path });
}));
exports.default = UsersRouter;
