import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { secretkey } from "../controllers/buyers.controller";
import { Request } from "express";
import { itemRequest } from "../requests/item.request";
export const auth:RequestHandler = async (req:Request<{},{},{id:any},{}>, res, next) => {
    let token:string|undefined =req.headers.authorization?.split(" ")[1];
    if(token)
    {
        try
        {
        let decodedToken =jwt.verify(token,secretkey);
        req.body.id = decodedToken.sub;
        next();
        }
        catch
        {
            res.send("invalid token")
        }
    }
    else
    {
        res.send("token not found")
    }
}
export const authitem:RequestHandler = async (req:Request<{},{},itemRequest,{}>, res, next) => {
    let token:string|undefined =req.headers.authorization?.split(" ")[1];
    if(token)
    {
        try
        {
        let decodedToken =jwt.verify(token,secretkey);
        req.body.seller_id= decodedToken.sub;
        next();
        }
        catch
        {
            res.send("invalid token")
        }
    }
    else
    {
        res.send("token not found")
    }
}