import { ObjectId } from "mongodb";
export interface cartaddRequest
{
    item_id:string,
    quantity:number,
    id:any,
}
export interface deleteCartItem
{
    item_id:string,
    buyer_id:any
}
