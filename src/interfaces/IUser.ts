import { Model, Document } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    avatar: string;
    savedsessionID: string;
    createdsessionID: string;
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