import express from 'express';
import path from 'path';
import ProductManager from '../dao/ProductManager.js';

const router = express.Router();
let productManager = new ProductManager();

router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products: products });
});

router.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home');
});

router.get("/chat", (req, res) => {
    res.render("chat");
});


export default router;
