import { ObjectId } from "mongodb";
import { database } from "./database";
import { item } from "./items.model";
import { order } from "./order.model";
import { cartItem } from "./cart.model";
export interface buyer
{
    _id:ObjectId,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    addresses?:string[],
    phoneNumber:number,
    image:string,
    orders:order[],
    cart:cartItem[],
}



export const buyers = database.collection<buyer>("buyers");


