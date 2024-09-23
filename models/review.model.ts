import { ObjectId } from "mongodb";
import { database } from "./database";
export interface review
{ 
    item_id:ObjectId,
    buyer_id:ObjectId,
    rating:number,
    comment:string,
    image?:string,
    date:Date,
    certfied_buyer:boolean
}

export const reviews = database.collection<review>("reviews")
