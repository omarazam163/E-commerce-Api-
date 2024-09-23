import { RequestHandler,Request,Response } from "express"
import { reviews,review } from "../models/review.model"
import { item,items } from "../models/items.model"
import { ObjectId } from "mongodb"
import { buyer,buyers } from "../models/buyer.model"
import { reviewRequest } from "../requests/review.request"
import { BlobOptions } from "buffer"
import fs from "fs/promises"
const addreview:RequestHandler=async (req:Request<{},{},reviewRequest,{}>,res)=>{

    let userdata = await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)});
    if(userdata)
    {
        let itemdata = await items.findOne({_id:ObjectId.createFromHexString(req.body.item_id)});
        if(itemdata)
        {
            let boughtit:boolean =false;
            userdata.orders.forEach(element => {
                if(element.orderedItems.filter((item)=>item.item_id.toHexString()===itemdata._id.toHexString()).length!==0)
                {
                    boughtit = true
                }
            })
            let newReview:review = {
                item_id: itemdata._id,
                buyer_id: userdata._id,
                rating: Number(req.body.rating),
                comment: req.body.comment,
                date: new Date(),
                certfied_buyer: boughtit
            }
            if(req.file)
            {
                newReview.image = `./images/reviewimages/${newReview.item_id}${newReview.buyer_id}.jpg`
                await fs.writeFile(newReview.image,req.file.buffer)
            }

            await reviews.insertOne(newReview)
            res.send("done")
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

const deletereview:RequestHandler=async (req:Request<{},{},{id:any,item_id:string},{}>,res)=>{
    let userdata = await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)});
    if(userdata)
    {
        await reviews.deleteOne({item_id:ObjectId.createFromHexString(req.body.item_id),buyer_id:ObjectId.createFromHexString(req.body.id)})
        await fs.unlink(`./images/reviewimages/${req.body.item_id}${req.body.id}.jpg`)
        res.send("done")
    }
    else
    {
        res.status(404).send("buyer not found")
    }
}

export const reviewsController = {addreview,deletereview}