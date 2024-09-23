import { ObjectId } from "mongodb";
import { database } from "./database";
export interface seller
{
    _id:ObjectId,
    name:string,
    email:string,
    password:string,
    image:string,
    phoneNumber:number
    balance:number,
    address:string,
    approved:boolean
}

export const sellers = database.collection<seller>("sellers");