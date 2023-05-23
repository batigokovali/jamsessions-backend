"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaUploader = exports.avatarUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
exports.avatarUploader = (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            folder: "jamsessions/users/avatars",
        },
    }),
}).single("avatar");
exports.mediaUploader = (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            resource_type: "auto",
            folder: "jamsessions/feed/medias",
        },
    }),
}).single("media");
