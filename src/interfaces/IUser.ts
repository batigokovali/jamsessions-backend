import { Model, Document } from "mongoose";
import { ISession } from "./ISession";

export interface IUser {
  username: string;
  email: string;
  avatar: string;
  savedsessions: Array<string>;
  createdsessions: Array<string>;
  location: Location;
  role: Array<string>;
  refreshToken: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUsersModel extends Model<IUserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<IUserDocument | null>;
}
