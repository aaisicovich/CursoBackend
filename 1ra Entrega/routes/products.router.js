import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import { io } from "../app.js";

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get("/", (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Obtén todos los productos
    let products = productManager.getProducts();

    // Filtra según el query si se proporciona
    if (query) {
        products = products.filter(product => product.category === query || product.status === query);
    }

    // Aplica el ordenamiento si se proporciona
    if (sort === "asc") {
        products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
        products.sort((a, b) => b.price - a.price);
    }

    // Calcula el índice de inicio y fin para la paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    // Realiza la paginación
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calcula valores para la paginación
    const totalPages = Math.ceil(products.length / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    // Construye los links a las páginas previa y siguiente
    const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
    const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;

    // Construye la respuesta
    const response = {
        status: "success",
        payload: paginatedProducts,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink
    };

    res.status(200).json(response);
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