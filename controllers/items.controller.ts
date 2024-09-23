import { RequestHandler,Request,Response } from "express"
import { item,items } from "../models/items.model"
import { sellers } from "../models/seller.model"
import { authitem } from "../helper/auth"
import { itemRequest,itemSearch,updateItem} from "../requests/item.request"
import { ObjectId } from "mongodb"
import fs from "fs/promises"
const post:RequestHandler=async (req:Request<{},{},itemRequest,{}>,res)=>{
    let sellerdata =await sellers.findOne({_id:ObjectId.createFromHexString(req.body.seller_id)})
    if(sellerdata&&sellerdata.approved===true)
    {
        let path:string="";
        let id=new ObjectId();
        if(req.files&&req.files instanceof Array&&req.files.length===4)
        {
            path=`./images/itemimages/${id}`
            await fs.mkdir(path)
            let counter =1;
            console.log("here")
            for await (const file of req.files) {
                let Imagepath=path+`/${counter}.jpg`;
                await fs.writeFile(Imagepath, file.buffer);
                counter++;
            }
        }
        else
        {
            return res.send("images not enough")
        }

        let newitem:item={
            _id:id,
            name:req.body.name,
            price:Number(req.body.price),
            description:req.body.description,
            category:req.body.category,
            seller_id:ObjectId.createFromHexString(req.body.seller_id),
            quantity:Number(req.body.quantity),
            imagedir:path
        }
        await items.insertOne(newitem);
        res.send("done")
    }
    else
    {
        res.send("seller not found")
    }
}

const get = async (req:Request<{},item[],{sellerId:string},itemSearch>, res:Response) => {
    let result:item[] = await items.find({}).toArray();
    console.log(req.body.sellerId)
    if(req.body.sellerId)
    {
        result = result.filter((item:item)=>item.seller_id.toHexString()===req.body.sellerId)
        return res.json(result)
    }
    else
    {
        if(Object.entries(req.query).length!==0)
        {
            if(req.query.name)
            {
                result=result.filter((item:item)=>item.name.includes(req.query.name))
            }
            if(req.query.cateogry)
            {
                result=result.filter((item:item)=>item.category===req.query.cateogry)
            }
            if(req.query.min&&req.query.max)
            {
                console.log(req.query.min)
                result=result.filter((item:item)=>item.price>=Number(req.query.min)&&item.price<=Number(req.query.max))
            }
            res.status(200).json(result)
        }
        else
        {
            res.status(404).send("no items found")
        }
    }
}

const put:RequestHandler=async (req:Request<{},{},updateItem,{}>,res) => {
    let itemdata =await items.findOne({_id:ObjectId.createFromHexString(req.body._id)});
    let sellerdata=await sellers.findOne({_id:ObjectId.createFromHexString(req.body.seller_id)});
    if(itemdata&&sellerdata)
    {
        if(sellerdata._id.toHexString()===itemdata.seller_id.toHexString())
        {
            if(req.body.name)
                {
                    itemdata.name = req.body.name
                }
                if(req.body.price)
                {
                    itemdata.price = req.body.price
                }
                if(req.body.description)
                {
                    itemdata.description = req.body.description
                }
                if(req.body.quantity)
                {
                    itemdata.quantity = req.body.quantity
                }
                await items.updateOne({_id:ObjectId.createFromHexString(req.body._id)},{$set:{name:itemdata.name,price:itemdata.price,description:itemdata.description,quantity:itemdata.quantity}})
                res.send("done")
        }
        else
        {
            res.send("seller and item not match")
        }
    }
    else
    {
        res.send("seller not found")
    }
}
const deleteItem:RequestHandler=async (req:Request<{},{},{_id:string,seller_id:string},{}>,res:Response) => {
    let itemdata =await items.findOne({_id:ObjectId.createFromHexString(req.body._id)});
    let sellerdata=await sellers.findOne({_id:ObjectId.createFromHexString(req.body.seller_id)});
    if(itemdata&&sellerdata)
    {
        if(sellerdata._id.toHexString()===itemdata.seller_id.toHexString())
            {
                await items.deleteOne({_id:ObjectId.createFromHexString(req.body._id)})
                await fs.rm(`./images/itemimages/${itemdata._id}`, { recursive: true,force: true });
                res.send("done")
            }
            else
            {
                res.send("seller and item not match")
            }
    }
    else
    {
        res.send("seller not found")
    }
}
export const itemsController={post,get,put,deleteItem}