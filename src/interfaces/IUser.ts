import { Model, Document } from "mongoose";
import { ISessionDocument } from "./ISession";
import { ISession } from "./ISession";

export interface IUser {
  username: string;
  email: string;
  avatar: string;
  savedSessions: Array<ISession>;
  createdSessions: Array<ISession>;
  location: { lat: string; lng: string };
  role: Array<string>;
  refreshToken: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUsersModel extends Model<IUserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<IUserDocument | null>;
  SavedAndCreatedSessions(query: any): Promise<{ user: IUserDocument }>;
}
