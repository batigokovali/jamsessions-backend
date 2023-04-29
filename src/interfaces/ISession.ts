import { Model } from "mongoose";
import { IUser } from "./IUser";

export interface ISession {
    author: IUser;
    content: {
      title: string;
      description: string;
    };
    comments: Comment[];
    date: Date;
    location: Location;
  }

export interface ISessionDocument extends ISession, Document {}

export interface ISessionModel extends Model<ISessionDocument> {}