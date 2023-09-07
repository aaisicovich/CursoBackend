import express from "express";
import __dirname from "./utils.js";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import { Server } from "socket.io";
import mongoose from "mongoose";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.routes.js";
import viewsRouter from "./routes/views.routes.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const puerto = 8080; 
const app = express();
const server = http.createServer(app);
const io = new Server(server); 

const dbConnectionString = "mongodb+srv://asd123:<password>@cluster0.nea2e8m.mongodb.net/?retryWrites=true&w=majority";

app.use(cookieParser()); 
app.use(session({
    store:MongoStore.create({
        mongoUrl:"mongodb+srv://asd123:<password>@cluster0.nea2e8m.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
        ttl:20
    }),
    secret:"secret",
    resave:false,
    saveUninitialized:false
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const httpServer = app.listen(puerto, () => {
  console.log("Servidor Activo en el puerto: " + puerto);
});
const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CM = new ChatManager();

app.set("views", __dirname + "/views");
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/", viewsRouter);

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



socketServer.on("connection", (socket) => {
  console.log("Nueva Conexión!");

  const products = PM.getProducts();
  socket.emit("realTimeProducts", products);

  socket.on("nuevoProducto", (data) => {
      const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnails:data.thumbnails};
      PM.addProduct(product);
      const products = PM.getProducts();
      socket.emit("realTimeProducts", products);
  });

  socket.on("eliminarProducto", (data) => {
      PM.deleteProduct(parseInt(data));
      const products = PM.getProducts();
      socket.emit("realTimeProducts", products);
  });

  socket.on("newMessage", async (data) => {
      CM.createMessage(data);
      const messages = await CM.getMessages();
      socket.emit("messages", messages);
  });
});
export { app, server, io };
