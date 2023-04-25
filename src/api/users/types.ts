import { Model, Document, ObjectId } from "mongoose";

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  savedsessionID?: string;
  createdsessionID?: string;
  refreshToken: string;
}

export interface UserDoc extends User, Document {}

export interface UsersModel extends Model<UserDoc> {
  checkCredentials(email: string, password: string): Promise<UserDoc | null>;
}
