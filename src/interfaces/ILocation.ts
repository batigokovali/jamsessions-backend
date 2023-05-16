import { Date, Model } from "mongoose";

export interface ILocation {
  lat: number;
  lng: number;
}

export interface ILocationDocument extends ILocation, Document {}
