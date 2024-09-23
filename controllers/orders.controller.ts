import { RequestHandler, Request, Response } from "express";
import { buyers, buyer } from "../models/buyer.model";
import { items, item } from "../models/items.model";
import { ObjectId } from "mongodb";
import { cartItem } from "../models/cart.model";
import { order } from "../models/order.model";
import { sellers } from "../models/seller.model";
const emptyTheCart: RequestHandler = async (
    req: Request<{}, {}, { id: any; addressNumber: number }, {}>,
    res: Response
) => {

    let userdata = await buyers.findOne({
        _id: ObjectId.createFromHexString(req.body.id),
    });
    await buyers.updateOne(
        { _id: ObjectId.createFromHexString(req.body.id) },
        { $set: { orders: [] } }
    )
    if (userdata) {
        console.log(userdata.cart.length);
        if (userdata.cart.length !== 0) {
            if (userdata.addresses && userdata.addresses.length !== 0) {
                let cart: cartItem[] = userdata.cart;
                let order: order = {
                    _id: new ObjectId(),
                    orderedItems: [],
                    date: new Date(),
                    status: "proccessing",
                    address: userdata.addresses[req.body.addressNumber],
                    total: 0,
                };
                let total: number = 0;
                order.total = total;
                for await (let item of cart) {
                    let shopitem = await items.findOne({ _id: item.item });
                    if (shopitem) {
                        if (shopitem.quantity === 0) {
                            return res.send("out of stock");
                        }
                        let remain = shopitem.quantity - item.quantity;
                        await items.updateOne({ _id: shopitem._id }, { $set: { quantity: remain } });
                        order.orderedItems.push({
                            item_id: shopitem._id,
                            itemName: shopitem.name,
                            quantity: item.quantity,
                            price: shopitem.price * item.quantity,
                            seller_id: shopitem.seller_id,
                        });
                        total += item.quantity * shopitem.price;
                    }
                }
                order.total = total;
                await buyers.updateOne(
                    { _id: ObjectId.createFromHexString(req.body.id) },
                    { $set: { cart: [] } }
                );
                await buyers.updateOne(
                    { _id: ObjectId.createFromHexString(req.body.id) },
                    { $push: { orders: order } }
                );
                res.send("done");
            } else {
                res.send("address not found");
            }
        } else {
            res.send("your cart is not empty");
        }
    } else {
        res.send("buyer not found");
    }
};
export const confirmOrder: RequestHandler = async (req: Request<{}, {}, { order_id: string, user_id: string }, {}>, res) => {
    let userdata = await buyers.findOne({ _id: ObjectId.createFromHexString(req.body.user_id) });

    if (userdata) {
        let wantedorder = userdata.orders.filter((ordder) => ordder._id.toHexString() === req.body.order_id)
        if (wantedorder.length !== 0) {
            if (wantedorder[0].status === "proccessing") {
                for await (let item of wantedorder[0].orderedItems) {
                    await sellers.updateOne({ _id: item.seller_id }, { $inc: { balance: item.price } });
                }
                await buyers.updateOne(
                    { _id: ObjectId.createFromHexString(req.body.user_id), "orders._id": ObjectId.createFromHexString(req.body.order_id) },
                    {
                        $set: {
                            "orders.$.status": "confirmed",
                        }
                    }

                )
                res.status(200).send("done")
            }
            else {
                res.status(404).send("order is already confirmed or cancelled")
            }
        }
        else {
            res.status(404).send("order not found")
        }
    }
}

export const cancelOrder: RequestHandler = async (req: Request<{}, {}, { order_id: string, user_id: string }, {}>, res) => {
    let userdata = await buyers.findOne({ _id: ObjectId.createFromHexString(req.body.user_id) });
    if (userdata) {
        let wantedorder = userdata.orders.filter((ordder) => ordder._id.toHexString() === req.body.order_id)
        if (wantedorder.length !== 0) {
            if (wantedorder[0].status === "proccessing") {
                for await (let item of wantedorder[0].orderedItems) {
                    await items.updateOne({ _id: item.item_id }, { $inc: { quantity: item.quantity } });
                }
                await buyers.updateOne(
                    { _id: ObjectId.createFromHexString(req.body.user_id), "orders._id": ObjectId.createFromHexString(req.body.order_id) },
                    {
                        $set: {
                            "orders.$.status": "cancelled",
                        }
                    }

                )
                res.status(200).send("done")
            }
            else {
                res.status(404).send("order is already confirmed")
            }
        }
    }
    else {
        res.status(404).send("buyer not found")
    }
}

export const shipping: RequestHandler = async (req: Request<{}, {}, { user_id: string, order_id: string }, {}>, res) => {
    let userdata = await buyers.findOne({ _id: ObjectId.createFromHexString(req.body.user_id) });
    if (userdata) {
        let wantedorder = userdata.orders.filter((ordder) => ordder._id.toHexString() === req.body.order_id)
        if (wantedorder.length !== 0) {
            if (wantedorder[0].status === "confirmed") {
                await buyers.updateOne(
                    { _id: ObjectId.createFromHexString(req.body.user_id), "orders._id": ObjectId.createFromHexString(req.body.order_id) },
                    {
                        $set: {
                            "orders.$.status": "shipping",
                        }
                    }

                )
                res.status(200).send("done")
            }
            else {
                res.status(404).send("order is not confirmed yet")
            }
        }
    }
}
export const delivered: RequestHandler = async (req: Request<{}, {}, { user_id: string, order_id: string }, {}>, res) => {
    let userdata = await buyers.findOne({ _id: ObjectId.createFromHexString(req.body.user_id) });
    if (userdata) {
        let wantedorder = userdata.orders.filter((ordder) => ordder._id.toHexString() === req.body.order_id)
        if (wantedorder.length !== 0) {
            if (wantedorder[0].status === "shipping") {
                await buyers.updateOne(
                    { _id: ObjectId.createFromHexString(req.body.user_id), "orders._id": ObjectId.createFromHexString(req.body.order_id) },
                    {
                        $set: {
                            "orders.$.status": "delivered",
                        }
                    }

                )
                res.status(200).send("done")
            }
            else {
                res.status(404).send("order is not shipped yet")
            }
        }
    }
}
export const getOrders: RequestHandler = async (req: Request<{}, {}, { id: any }, {}>, res) => {
    let userdata = await buyers.findOne({ _id: ObjectId.createFromHexString(req.body.id) });
    if (userdata) {
        res.json(userdata.orders)
    }
    else {
        res.status(404).send("buyer not found")
    }
}
export const getOneorder: RequestHandler = async (req: Request<{}, {}, { order_id: string, id: any }, {}>, res) => {
    let userdata = await buyers.findOne({ _id: ObjectId.createFromHexString(req.body.id) });
    if (userdata) {
        let wantedorder = userdata.orders.filter((ordder) => ordder._id.toHexString() === req.body.order_id)
        if (wantedorder.length !== 0) {
            res.json(wantedorder[0])
        }
        else {
            res.status(404).send("order not found")
        }
    }
    else {
        res.status(404).send("buyer not found")
    }
}
export const ordersController = { emptyTheCart, confirmOrder, cancelOrder, shipping, delivered, getOrders, getOneorder };
