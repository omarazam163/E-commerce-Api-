import { Router } from "express";
import { items, item } from "../models/items.model";
import multer from "multer";
import { auth,authitem } from "../helper/auth";
import { itemsController } from "../controllers/items.controller";
export const itemsRouter = Router();
itemsRouter.post("/create",multer().array("images",4),authitem,auth,itemsController.post);
itemsRouter.get("/get",itemsController.get)
itemsRouter.put("/update",authitem,authitem,auth,itemsController.put)
itemsRouter.delete("/delete",authitem,auth,itemsController.deleteItem)