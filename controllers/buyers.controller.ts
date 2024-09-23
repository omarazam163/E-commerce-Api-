import { RequestHandler,Request } from "express";
import { buyers,buyer } from "../models/buyer.model";
import { items } from "../models/items.model";
import { buyerRegister,buyerLogin,updateBuyer,buyerLoginUpdate } from "../requests/buyer.request";
import { ObjectId } from "mongodb";
import  jwt  from "jsonwebtoken";
import fs from 'fs/promises';


export let secretkey:string= "1662003omer";
const register: RequestHandler = async (req:Request<{},{},buyerRegister,{}>, res) => {
    if(await buyers.findOne({email:req.body.email}))
    {
        return res.send("email already exists");
    }
    const asddess:string[]=[]
    asddess.push(req.body.address)
    const newBuyer:buyer = {
        _id:new ObjectId(),
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password,
        addresses:asddess,
        image:"./images/userimages/def.jpg",
        phoneNumber:req.body.phoneNumber,
        cart:[],
        orders:[],
    }
    if(req.file)
    {
        let bath = `./images/userimages/${newBuyer._id}.jpg`;
        await fs.writeFile(bath,req.file.buffer);
        newBuyer.image = bath;
    }
    else
    {
        newBuyer.image = "./images/userimages/def.jpg";
    }
    await buyers.insertOne(newBuyer);
    res.send("done");
};
const login:RequestHandler = async (req:Request<{},{token:string},buyerLogin>,res)=>{
    let buyerdata =await buyers.findOne({email:req.body.email})
    if(buyerdata)
    {
        let token =jwt.sign({ email:buyerdata.email },secretkey,{
            expiresIn:"2d",
            jwtid: new Date().getTime().toString(),
            subject:buyerdata._id.toString(),
        })
        res.send({token})
    }
    else{
        res.send("email not found")
    }
}


const updateBuyer:RequestHandler = async (req:Request<{},{},updateBuyer,{}>,res)=>{
    let buyerdata =await buyers.findOne({_id:ObjectId.createFromHexString(req.body.id)})
    if(buyerdata)
    {
        buyerdata.firstName = (req.body.firstName)?req.body.firstName:buyerdata.firstName
        buyerdata.lastName = (req.body.lastName)?req.body.lastName:buyerdata.lastName
        buyerdata.phoneNumber = (req.body.phoneNumber)?req.body.phoneNumber:buyerdata.phoneNumber
        if(req.file)
        {
            if(buyerdata.image&&buyerdata.image!="./images/userimages/def.jpg")
            {
                let bath = `./images/userimages/${buyerdata._id}.jpg`;
                await fs.writeFile(bath,req.file.buffer);
                buyerdata.image = bath;
            }
        }
        await buyers.updateOne({_id:ObjectId.createFromHexString(req.body.id)},{$set:{firstName:buyerdata.firstName,lastName:buyerdata.lastName,phoneNumber:buyerdata.phoneNumber,image:buyerdata.image}})
        res.send("done")
    }
}

const updateP:RequestHandler =async(req:Request<{},{},buyerLoginUpdate>,res)=>
{
    let buyerdata =await buyers.findOne({email:req.body.email,password:req.body.password})
    if(buyerdata)
    {
        await buyers.updateOne({email:req.body.email,password:req.body.password},{$set:{password:req.body.newpassword}})
    }
    else
    {
        res.send("invalid credentials")
    }
}


const deletebuyer:RequestHandler = async(req:Request<{},{},buyerLogin,{}>,res)=>{
    let buyerdata =await buyers.findOne({email:req.body.email,password:req.body.password})
    if(buyerdata)
    {
        await buyers.deleteOne({email:req.body.email,password:req.body.password})
        await fs.unlink(buyerdata.image)
        res.send("done")
    }
    else
    {
        res.send("invalid credentials")
    }
}


export const buyersController = { register,login,updateBuyer,updateP,deletebuyer}