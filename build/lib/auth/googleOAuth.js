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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const tools_1 = require("./tools");
const model_1 = __importDefault(require("../../api/users/model"));
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_URL } = process.env;
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${API_URL}/users/login/googleLogin`, //will be changed
}, (_, __, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, given_name, family_name, sub, picture } = profile._json;
        const user = yield model_1.default.findOne({ email });
        if (user) {
            const accessToken = yield (0, tools_1.createAccessToken)({
                _id: user._id,
                email: user.email,
            });
            passportNext(null, { accessToken });
        }
        else {
            const newUser = new model_1.default({
                email,
                googleId: sub,
                avatar: picture,
                username: given_name + family_name,
                password: Math.random().toString(36).slice(-10),
            });
            const createdUser = yield newUser.save();
            const accessToken = yield (0, tools_1.createAccessToken)({
                _id: createdUser._id,
                email: createdUser.email,
            });
            passportNext(null, { accessToken });
        }
    }
    catch (error) {
        passportNext(error);
    }
}));
exports.default = googleStrategy;
