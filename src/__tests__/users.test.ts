import mongoose from "mongoose";
import dotenv from "dotenv";
import supertest from "supertest";
import { expressServer } from "../server";
import UsersModel from "../api/users/model"

dotenv.config();
const client = supertest(expressServer);

const validUser = {
    
}