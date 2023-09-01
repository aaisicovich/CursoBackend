import { Router } from "express";
import CartManager from "../dao/CartManager.js";

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

cartsRouter.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const products = req.body.products;

    try {
        if (await cartManager.updateCartProducts(cid, products)) {
            res.status(200).json({ message: "Carrito actualizado con nuevos productos" });
        } else {
            res.status(404).json({ error: "Carrito no encontrado o fallo al actualizar" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (await cartManager.updateProductQuantity(cid, pid, quantity)) {
            res.status(200).json({ message: "Cantidad de producto actualizada en el carrito" });
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado o fallo al actualizar" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cantidad de producto en el carrito" });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        if (await cartManager.clearCart(cid)) {
            res.status(200).json({ message: "Productos eliminados del carrito" });
        } else {
            res.status(404).json({ error: "Carrito no encontrado o fallo al eliminar productos" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar los productos del carrito" });
    }
});

export default cartsRouter;