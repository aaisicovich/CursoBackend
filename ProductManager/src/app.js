const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager();

// Endpoint todos los productos y la variante con ?=Limit
// Inside the /products route handler
app.get('/products', async (req, res) => {
    const { limit } = req.query;

    try {
        const products = await productManager.getProducts(limit);
        console.log(products);
        res.json(products);

    } catch (error) {
        res.status(500).json({ error: 'No se pudieron leer productos del archivo' });
    }
});

// Endpoint productos por ID
app.get('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
        try {
            const product = productManager.getProductById(id); 
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar producto' });
        }
    } else {
        res.status(400).json({ error: 'ID Invalido' });
    }
})

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});
