import { ObjectId } from "mongodb"
export interface cartItem
{
    item:ObjectId,
    name:string,
    quantity:number
}

