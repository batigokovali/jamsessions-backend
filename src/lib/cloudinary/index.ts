import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const avatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "jamsessions/users/avatars",
    } as { folder: string },
  }),
}).single("avatar");

export const mediaUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      resource_type: "auto",
      folder: "jamsessions/feed/medias",
    } as { folder: string },
  }),
}).single("media");
