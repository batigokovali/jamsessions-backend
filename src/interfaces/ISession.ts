import { Date, Model } from "mongoose";
import { IUser } from "./IUser";
import { IComment } from "./IComment";

export interface ISession {
  user: IUser;
  title: string;
  description: string;
  date: Date;
  role: Array<string>;
  genre: Array<string>;
  geolocation: string;
  comments: IComment[];
}

export interface ISessionDocument extends ISession, Document {}
export interface ISessionsModel extends Model<ISessionDocument> {
  findAllSessions(
    query: any
  ): Promise<{ sessions: ISessionDocument[]; total: number }>;
}
