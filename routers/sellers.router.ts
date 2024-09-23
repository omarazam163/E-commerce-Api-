import { Router } from "express";
import multer from "multer";
import { sellerController } from "../controllers/sellers.controller";
import {auth} from "../helper/auth"
export const sellerRouter = Router();

sellerRouter.post("/register",multer().single("image"),sellerController.register);
sellerRouter.get("/login",sellerController.login);
sellerRouter.put("/update",multer().single("image"),auth,sellerController.updateSeller);
sellerRouter.put("/updatepass",auth,sellerController.updatep);
sellerRouter.delete("/deleteseler",auth,sellerController.deleteseler)
sellerRouter.patch("/approve",auth,sellerController.approve)