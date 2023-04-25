import { Model } from "mongoose";
import { IUser } from "./IUser";

export interface Sessions {
    author: IUser;
    content: {
      title: string;
      description: string;
    };
    comments: Comment[];
  }

export interface ISessionDocument extends Document {}

export interface ISessionModel extends Model<ISessionDocument> {}