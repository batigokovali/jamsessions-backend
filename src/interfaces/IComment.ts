import { Model } from "mongoose";
import { IUser } from "./IUser";

export interface Comment {
    author: IUser;
    content: string;
  }

export interface ICommentDocument extends IUser, Comment{}
export interface ICommentsModel extends Model<ICommentDocument>{}