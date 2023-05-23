"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const UsersSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        type: String,
        required: true,
        default: "https://musicalbrick.com/wp-content/uploads/2019/08/KTS-1.jpg",
    },
    savedSessions: [{ type: mongoose_1.default.Types.ObjectId, ref: "session" }],
    createdSessions: [{ type: mongoose_1.default.Types.ObjectId, ref: "session" }],
    refreshToken: { type: String },
    location: { lat: { type: Number }, lng: { type: Number } },
    role: [{ type: String }],
    googleID: { type: String },
});
UsersSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = this;
        if (newUser.password && newUser.isModified("password")) {
            const password = newUser.password;
            const hashedPW = yield bcrypt_1.default.hash(password, 11);
            newUser.password = hashedPW;
        }
    });
});
UsersSchema.pre("findOneAndUpdate", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if (update.password) {
            const password = update.password;
            const hashedPW = yield bcrypt_1.default.hash(password, 11);
            update.password = hashedPW;
        }
    });
});
UsersSchema.methods.toJSON = function () {
    const currentUserDoc = this;
    const currentUser = currentUserDoc.toObject();
    delete currentUser.password;
    delete currentUser.createdAt;
    delete currentUser.updatedAt;
    delete currentUser.__v;
    return currentUser;
};
UsersSchema.statics.SavedAndCreatedSessions = function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findById(query).populate({
            path: "savedSessions createdSessions",
            populate: {
                path: "user",
                select: "_id username avatar",
            },
            select: "_id user title description role genre date location",
        });
        return { user };
    });
};
UsersSchema.static("checkCredentials", function (email, plainPW) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (user) {
            const passwordMatch = yield bcrypt_1.default.compare(plainPW, user.password);
            if (passwordMatch)
                return user;
            else
                throw new http_errors_1.default[401]("Wrong password!");
        }
        else
            throw new http_errors_1.default[401](`No user found!`);
    });
});
exports.default = (0, mongoose_1.model)("user", UsersSchema);
