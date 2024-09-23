import { RequestHandler,Request,Response } from "express"
import { sellerRegister,sellerLogin,updateSeller,sellerLoginUpdate } from "../requests/seller.request"
import { sellers,seller } from "../models/seller.model"
import { ObjectId } from "mongodb"
import  Jwt  from "jsonwebtoken"
import fs from 'fs/promises';
const register:RequestHandler= async (req:Request<{},{},sellerRegister,{}>,res)=>{
    if(await sellers.findOne({email:req.body.email}))
    {
        return res.send("email already exists")
    }
    else
    {
        const newSeller:seller={
            _id:new ObjectId(),
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phoneNumber:req.body.phoneNumber,
            balance:0,
            image:"./images/sellerimages/def.jpg",
            address:req.body.address,
            approved:false,
        }
        if(req.file)
        {
            let path = `./images/sellerimages/${newSeller._id}.jpg`;
            await fs.writeFile(path,req.file.buffer);
            newSeller.image = path;
        }
        else
        {
            newSeller.image = "./images/sellerimages/def.jpg";
        }
        await sellers.insertOne(newSeller);
        res.send("done")

    }
}

const login:RequestHandler=async (req:Request<{},{},sellerLogin,{}>,res) => {
    let sellerData= await sellers.findOne({email:req.body.email,password:req.body.password})
    if(sellerData)
    {
        let token =Jwt.sign({ email:sellerData.email },"1662003omer",{
            expiresIn:"2d",
            jwtid: new Date().getTime().toString(),
            subject:sellerData._id.toString(),
        })
        res.send({token})
    }
    else
    {
        res.send("email or password in incorrect")
    }
}

const updateSeller:RequestHandler=async (req:Request<{},{},updateSeller,{}>,res) => {
    let sellerdata =await sellers.findOne({_id:ObjectId.createFromHexString(req.body.id)})
    if(sellerdata)
    {
        sellerdata.name = (req.body.name)?req.body.name:sellerdata.name
        sellerdata.phoneNumber = (req.body.phoneNumber)?req.body.phoneNumber:sellerdata.phoneNumber
        sellerdata.address = (req.body.address)?req.body.address:sellerdata.address

        if(req.file&&sellerdata.image!==`./images/sellerimages/def.jpg`)
        {
            let path = `./images/sellerimages/${sellerdata._id}.jpg`;
            await fs.writeFile(path,req.file.buffer);
            sellerdata.image = path;
        }
        sellers.updateOne({_id:ObjectId.createFromHexString(req.body.id)},{$set:{name:sellerdata.name,phoneNumber:sellerdata.phoneNumber,address:sellerdata.address,image:sellerdata.image}})
        res.send("done")
    }
    else
    {
        res.send("invalid token")
    }
}
const updatep:RequestHandler = async (req:Request<{},{},sellerLoginUpdate,{}>,res) => {
    let sellerdata =await sellers.findOne({email:req.body.email,password:req.body.password})
    if(sellerdata)
    {
        await sellers.updateOne({email:req.body.email,password:req.body.password},{$set:{password:req.body.newpassword}})
    }
    else
    {
        res.send("invalid credentials")
    }
}

const deleteseler:RequestHandler = async(req:Request<{},{},sellerLogin,{}>,res)=>{
    let userdata=await sellers.findOne({email:req.body.email,password:req.body.password});
    if(userdata)
    {
        await sellers.deleteOne({email:req.body.email,password:req.body.password})
        await fs.unlink(userdata.image)
        res.send("done")
    }
    else
    {
        res.send("invalid credentials")
    }
}
const approve = async(req:Request<{},{},sellerLogin,{}>,res:Response)=>{
    let sellerdata =await sellers.findOne({email:req.body.email,password:req.body.password})
    if(sellerdata)
    {
        await sellers.updateOne({email:req.body.email,password:req.body.password},{$set:{approved:true}})
        res.send("done")
    }
    else
    {
        res.send("invalid credentials")
    }
}

export const sellerController={register,login,updateSeller,updatep,deleteseler,approve}