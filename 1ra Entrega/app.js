import express from "express";
import handlebars from 'express-handlebars';
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io'; 
import ProductManager from "./dao/ProductManager.js";
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const server = http.createServer(app);
const io = new Server(server); 

const dbConnectionString = "mongodb+srv://asd123:<password>@cluster0.nea2e8m.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Conexión a MongoDB establecida");
    // Aquí puedes iniciar el servidor de Express
    app.listen(3000, () => {
      console.log("Servidor en funcionamiento en el puerto 3000");
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });


let productManager = new ProductManager(io);

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on("productAdded", ({title, description, code, price, status, stock, category, thumbnails}) => {
        productManager.addProduct({title, description, code, price, status, stock, category, thumbnails});

        io.emit("productAdded", productManager.getProducts());
    })

    socket.on("productDeleted", (productoId) => {
        productManager.deleteProduct(productoId);

        io.emit("productDeleted", productManager.getProducts());
    })

});

app.engine('handlebars', handlebars.engine); 
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/', viewsRouter);

app.use(express.json());
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);

const puerto = 8080; 
server.listen(puerto, () => {
    console.log("Servidor activo en el puerto: " + puerto);
});

export { app, server, io };
