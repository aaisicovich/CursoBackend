import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import { io } from "../app.js";

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get("/", (req, res) => {
    const products = productManager.getProducts();
    let {limit} = req.query;

    res.send({products:limit ? products.slice(0, limit) : products});
});

productsRouter.get("/:pid", (req, res) => {
    const products = productManager.getProducts();
    let pid = Number(req.params.pid);
    
    res.send({product:products.find(item => item.id === pid) || "El ID de Producto no existe"});
});

productsRouter.post("/", (req, res) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"Falta el campo title"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Falta el campo descripcion"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Falta el campo code"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Falta el campo price"});
        return false;
    }

    status = !status && true;

    if (!stock) {
        res.status(400).send({status:"error", message:"Falta el campo stock"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Falta el campo category"});
        return false;
    }

    if (!thumbnails) {
        res.status(400).send({status:"error", message:"Falta el campo thumbnails"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"Debe agregar al menos una imagen al thumbnails"});
        return false;
    }

    if (productManager.addProduct({title, description, code, price, status, stock, category, thumbnails})) {
        io.emit('productAdded', {title, description, code, price, status, stock, category, thumbnails} )
        res.send({status:"ok", message:"El Producto se agregó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Falla al agregar el producto"});
    }
});

productsRouter.put("/:pid", (req, res) => {
    let pid = Number(req.params.pid);
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"Falta el campo title"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Falta el campo descripcion"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Falta el campo code"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Falta el campo price"});
        return false;
    }

    status = !status && true;

    if (!stock) {
        res.status(400).send({status:"error", message:"Falta el campo stock"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Falta el campo category"});
        return false;
    }

    if (!thumbnails) {
        res.status(400).send({status:"error", message:"Falta el campo thumbnails"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"Debe agregar al menos una imagen al thumbnails"});
        return false;
    }

    if (productManager.updateProduct(pid, {title, description, code, price, status, stock, category, thumbnails})) {
        res.send({status:"ok", message:"El Producto se actualizó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Falla al actualizar el producto"});
    }
});

productsRouter.delete("/:pid", (req, res) => {
    let pid = Number(req.params.pid);

    if (productManager.deleteProduct(pid)) {
        res.send({status:"ok", message:"El Producto se eliminó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Falla al eliminar el producto"});
    }
});

export default productsRouter;