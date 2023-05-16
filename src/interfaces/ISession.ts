import { Date, Model } from "mongoose";
import { IUser } from "./IUser";
import { IComment } from "./IComment";
import { ILocation } from "./ILocation";

export interface ISession {
  user: IUser;
  title: string;
  description: string;
  date: Date;
  role: Array<string>;
  genre: Array<string>;
  location: ILocation;
  comments: IComment[];
  _id: string;
}

export interface ISessionDocument extends ISession {}
export interface ISessionsModel extends Model<ISessionDocument> {
  findAllSessions(
    query: any
  ): Promise<{ sessions: ISessionDocument[]; total: number }>;
}
