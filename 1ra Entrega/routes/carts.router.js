import { Router } from "express";
import CartManager from "../CartManager.js";

const cartsRouter = Router();
const cartManager = new CartManager();

cartsRouter.post("/", (req, res) => {
    if (cartManager.newCart()) {
        res.send({status:"ok", message:"Carrito creado"});
    } else {
        res.status(500).send({status:"error", message:"Imposible crear el carrito"});
    }
});

cartsRouter.get("/:cid", (req, res) => {
    const cid = Number(req.params.cid);
    const cart = cartManager.getCart(cid);

    if (cart) {
        res.send({products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"No se encuentra el ID del carrito"});
    }
});

cartsRouter.post("/:cid/products/:pid", (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const cart = cartManager.getCart(cid);

    if (cart) {
        if (cartManager.addProductToCart(cid, pid)) {
            res.send({status:"ok", message:"Producto agregado!"});
        } else {
            res.status(400).send({status:"error", message:"Fallo al agregar el producto al carrito"});
        }
    } else {
        res.status(400).send({status:"error", message:"No se encuentra el ID del carrito"});
    }
});

export default cartsRouter;