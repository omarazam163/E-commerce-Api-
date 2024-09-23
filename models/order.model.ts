import { ObjectId } from "mongodb";
import { database } from "./database";
export interface order
{
    _id:ObjectId,
    orderedItems:
    {
        item_id:ObjectId,
        itemName:string,
        quantity:number,
        price:number
        seller_id:ObjectId
    }[],
    date:Date,
    status:"shipping"|"delivered"|"proccessing"|"cancelled"|"confirmed",
    address:string,
    total:number,
}