import { Model } from "mongoose";
import { IUser } from "./IUser";

export interface IComment {
  user: IUser;
  content: string;
}

export interface ICommentDocument extends IComment, Document {}
export interface ICommentsModel extends Model<ICommentDocument> {}
