import express from "express";
import { buyerRouter } from "./routers/buyers.router";
import { sellerRouter } from "./routers/sellers.router";
import { itemsRouter } from "./routers/items.router";
import { reviewsRouter } from "./routers/reviews.router";
const app = express();
app.use(express.json());
app.use("/api/buyers",buyerRouter);
app.use("/api/sellers",sellerRouter);
app.use("/api/items",itemsRouter);
app.use("/api/reviews",reviewsRouter);
app.listen(3000, () => {
    console.log("server is running on port 3000");
})