import Express from "express";
import FeedsModel from "./model";
import { IUserRequest, JWTTokenAuth } from "../../lib/auth/jwt";
import createHttpError from "http-errors";
import { mediaUploader } from "../../lib/cloudinary";

const FeedsRouter = Express.Router();

//Post a Feed
FeedsRouter.post("/", JWTTokenAuth, async (req, res, next) => {
  try {
    const newFeed = new FeedsModel({
      user: (req as IUserRequest).user!._id,
      ...req.body,
    });
    const feed = await newFeed.save();
    res.status(201).send({ feed });
  } catch (error) {
    next(error);
  }
});

//Edit a feed
FeedsRouter.put("/:feedID", JWTTokenAuth, async (req, res, next) => {
  try {
    const feed = await FeedsModel.findById(req.params.feedID);
    if (feed?.user.toString() === (req as IUserRequest).user!._id) {
      const updatedFeed = await FeedsModel.findByIdAndUpdate(
        req.params.feedID,
        req.body,
        { new: true, runValidators: true }
      );
      res.send(updatedFeed);
    } else {
      next(
        createHttpError(
          401,
          "This user does not have the permission to edit the feed!"
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//Delete a feed
FeedsRouter.delete("/:feedID", JWTTokenAuth, async (req, res, next) => {
  try {
    const feed = await FeedsModel.findById(req.params.feedID);
    if (feed?.user.toString() === (req as IUserRequest).user!._id) {
      const updatedFeed = await FeedsModel.findByIdAndDelete(req.params.feedID);
      res.send().status(201);
    } else {
      next(
        createHttpError(
          401,
          "This user does not have the permission to edit the feed!"
        )
      );
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

//fetch a feed by ID
FeedsRouter.get("/:feedID", JWTTokenAuth, async (req, res, next) => {
  try {
    const feed = await FeedsModel.findById(req.params.feedID);
    res.send(feed);
  } catch (error) {
    next(error);
  }
});

//Post a media to Feed
FeedsRouter.post(
  "/:feedID/media",
  mediaUploader,
  JWTTokenAuth,
  async (req, res, next) => {
    try {
      await FeedsModel.findByIdAndUpdate(req.params.feedID, {
        media: req.file?.path,
      });
      res.send({ mediaURL: req.file?.path });
    } catch (error) {
      next(error);
    }
  }
);

export default FeedsRouter;
