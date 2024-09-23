import { RequestHandler,Request } from "express"
import { item,items } from "../models/items.model";
import { buyer, buyers } from "../models/buyer.model";
import { cartItem } from "../models/cart.model";
import { ObjectId } from "mongodb";
import { cartaddRequest } from "../requests/cart.request";
const post:RequestHandler=async (req:Request<{},{},cartaddRequest,{}>,res)=>{
    console.log(req.body.id)
    let userdata = await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)});
    if(userdata)
    {
        let itemdata = await items.findOne({_id:ObjectId.createFromHexString(req.body.item_id)});
        if(itemdata)
        {
            await buyers.updateOne({_id:ObjectId.createFromHexString(req.body.id)},{$push:{cart:{item:itemdata._id,quantity:req.body.quantity,name:itemdata.name}}})
            res.status(200).send("done")
        }
        else
        {
            res.status(404).send("item not found");
        }
    }
    else
    {
        res.status(404).send("buyer not found")
    }

}

const deleteOne:RequestHandler=async (req:Request<{},{},{id:string,item_id:string},{}>,res)=>{ 
    let userdata = await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)});
    if(userdata)
    {
        await buyers.updateOne({_id:ObjectId.createFromHexString(req.body.id)},{$pull:{cart:{item:ObjectId.createFromHexString(req.body.item_id)}}})
        res.status(200).send("done")
    }
    else
    {
        res.status(404).send("buyer not found")
    }
}
const updateQuantity:RequestHandler=async (req:Request<{},{},{id:string,item_id:string,quantity:number},{}>,res)=>{
    let userdata = await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)});
    if(userdata)
    {
        let itemdata = await items.findOne({_id:ObjectId.createFromHexString(req.body.item_id)});
        if(itemdata)
        {
            await buyers.updateOne({_id:ObjectId.createFromHexString(req.body.id)},{$pull:{cart:{item:ObjectId.createFromHexString(req.body.item_id)}}})
            await buyers.updateOne({_id:ObjectId.createFromHexString(req.body.id)},{$push:{cart:{item:itemdata._id,quantity:req.body.quantity,name:itemdata.name}}})
            res.status(200).send("done")
        }
        else
        {
            res.status(404).send("item not found");
        }
    }
    else
    {
        res.status(404).send("buyer not found")
    }
}

const getallcartItems:RequestHandler=async (req:Request<{},{},{id:any},{}>,res)=>{
    let userdata = await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)});
    if(userdata)
    {
        res.status(200).json(userdata.cart)
    }
    else
    {
        res.status(404).send("buyer not found")
    }
}
export const cartController={post,deleteOne,updateQuantity,getallcartItems}