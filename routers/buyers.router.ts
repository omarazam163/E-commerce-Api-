import { Router } from "express";
import { buyers,buyer, } from "../models/buyer.model";
import { items } from "../models/items.model";
import multer from "multer";
import {auth} from "../helper/auth";
import { buyersController } from "../controllers/buyers.controller";
import { cartController } from "../controllers/cart.controller";
import { ordersController } from "../controllers/orders.controller";
export const buyerRouter = Router();

buyerRouter.post("/register",multer().single("image"),buyersController.register);
buyerRouter.get("/login",buyersController.login);
buyerRouter.put("/update",multer().single("image"),auth,buyersController.updateBuyer);
buyerRouter.patch("/updatepass",auth,buyersController.updateP);
buyerRouter.delete("/deltebuyer",auth,buyersController.deletebuyer)
buyerRouter.post("/addtocart",auth,cartController.post)
buyerRouter.delete("/deletefromcart",auth,cartController.deleteOne)
buyerRouter.patch("/updatequantity",auth,cartController.updateQuantity)
buyerRouter.get("/getcart",auth,cartController.getallcartItems)
buyerRouter.post("/createorder",auth,ordersController.emptyTheCart)
buyerRouter.patch("/confirmorder",ordersController.confirmOrder)
buyerRouter.patch("/cancelorder",ordersController.cancelOrder)
buyerRouter.patch("/shipping",ordersController.shipping)
buyerRouter.patch("/delivered",ordersController.delivered)
buyerRouter.get("/getorders",auth,ordersController.getOrders)
buyerRouter.get("/getoneorder",auth,ordersController.getOneorder)