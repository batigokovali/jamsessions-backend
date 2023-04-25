import { Model } from "mongoose";
import { IUser } from "./IUser";

export interface Marketplace {
    brand: string;
    price: number;
    condition: string;
    photo?: string;
    author: IUser
}

export interface IMarketplaceDocument extends Document{}
export interface IMarketplaceModel extends Model<IMarketplaceDocument>{}