import { Model } from "mongoose";
import { IUser } from "./IUser";
import { IComment } from "./IComment";

export interface ISession {
  user: IUser;
  title: string;
  description: string;
  comments: IComment[];
  date: string;
  geolocation: string;
}

export interface ISessionDocument extends ISession, Document {}
export interface ISessionsModel extends Model<ISessionDocument> {}
