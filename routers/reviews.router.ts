import { Router } from "express";
import multer from "multer";
import { reviewsController } from "../controllers/review.controller";
import { auth } from "../helper/auth";
export const reviewsRouter = Router()

reviewsRouter.post("/addreview",multer().single("image"),auth,reviewsController.addreview)
reviewsRouter.delete("/deletereview",auth,reviewsController.deletereview)