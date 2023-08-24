const fs = require('fs');
const path = require('path');

class ProductManager {

    constructor() {
        this.path = path.resolve(__dirname, '..', 'Products.json');

        if (fs.existsSync(this.path)) {

            const fileContent = fs.readFileSync(this.path, "utf-8");
            this.products = JSON.parse(fileContent);

        } else {
            this.products = [];
        }

        this.prodId = this.products.length === 0 ? 1 : this.products.reduce((max, item) => {
            if (item && item.id > max) {
                return item.id;
            } else {
                return max;
            }
        }, 0) + 1; //Para generar el ID autoincremental

    }

    createFile() {
        if (!existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify(this.products))
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if (
            title === undefined || title === null ||
            description === undefined || description === null ||
            price === undefined || price === null ||
            thumbnail === undefined || thumbnail === null ||
            code === undefined || code === null ||
            stock === undefined || stock === null
        ) {
            console.log("Todos los parametros son obligatorios"); //Todos los campos deben venir cargados
            return false;
        } else {

            let existCode = this.products.find(product => product.code === code);

            if (existCode) {
                console.log('El CODE ya existe en el array de productos');
                return null;

            } else {

                let product = {
                    id: this.prodId,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock
                };

                this.products.push(product);
                this.prodId++;
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log('Producto agregado satisfactoriamente');

            }
        }

    }

    async getProducts(limit) {
        try {
            const fileContent = fs.readFileSync(this.path, "utf-8");
            if (!fileContent) {
                console.error("El archivo está vacío.");
                return [];
            }

            this.products = JSON.parse(fileContent);

            // Si se provee Limit
            if (limit && Number.isInteger(Number(limit)) && Number(limit) > 0) {
                return this.products.slice(0, Number(limit));
            }

            return this.products;

        } catch (err) {
            console.error("Error al leer o parsear el archivo:", err.message);
            this.products = [];
            return [];
        }
    }

    getProductById(id) {

        let product = this.products.find(product => product.id === id);

        if (product) {

            console.log(product);
            return product;

        } else {

            console.log('Not found');
            return null;

        }

    }

    updateProduct(id, title, description, price, thumbnail, code, stock) {

        let position = this.products.findIndex(item => item.id === id);

        if (position !== -1) {

            this.products[position].title = title;
            this.products[position].description = description;
            this.products[position].price = price;
            this.products[position].thumbnail = thumbnail;
            this.products[position].code = code;
            this.products[position].stock = stock;

            fs.writeFileSync(this.path, JSON.stringify(this.products));

        } else {

            console.log('Producto no encontrado');
        }
    }

    deleteProduct(id) {

        let position = this.products.findIndex((product) => product.id === id);

        if (position !== -1) {
            this.products.splice(position, 1);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log('Producto eliminado satisfactoriamente');
        } else {
            console.log('Producto no encontrado');
        }
    }
}

module.exports = ProductManager;
//Tests de primer entrega
/*
let prodManager = new ProductManager();

prodManager.getProducts();// Devuelvo vacio

prodManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

prodManager.getProducts(); // Devuelve 1 producto

prodManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc321', 25);

prodManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25); //Da erro de que CODe ya existe

prodManager.getProducts(); // Devuelve 2 productos

prodManager.getProductById(1); //Devuelve el producto de ID 1
*/
//Test de segunda entrega
/*
let prodM = new ProductManager();

prodM.getProducts(); //Devuelve vacio

prodM.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'zzz123', 25);

prodM.getProducts(); // Devuelve 1 producto

prodM.getProductById(1); // Devuelve 1 producto

prodM.getProductById(2); //Arroja error

prodM.updateProduct(1, 'producto prueba', 'Este es un producto prueba', 300, 'Sin imagen', 'ab23', 55)

prodM.deleteProduct(1); //Borra el producto con ID 1
prodM.deleteProduct(44); //Arroja error
*/
