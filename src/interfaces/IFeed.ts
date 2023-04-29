import { Model, Document } from "mongoose";
import { IUser } from "./IUser";

export interface IFeed {
  user: IUser;
  title: string;
  description: string;
  media: string;
}

export interface IFeedDocument extends IFeed, Document {}

export interface IFeedsModel extends Model<IFeedDocument> {}
