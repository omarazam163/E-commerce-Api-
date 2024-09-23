import { ObjectId } from "mongodb";
import { database } from "./database";
export interface item
{
    _id:ObjectId,
    name:string,
    price:number,
    imagedir:string,
    description:string,
    category:string,
    seller_id:ObjectId,
    quantity:number,
}

export const items = database.collection<item>("items");
