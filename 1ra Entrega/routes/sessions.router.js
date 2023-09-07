import express from "express";
import UserManager from "../dao/UserManager.js";
import { createHash } from "../utils.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";

const router = express.Router();
const UM = new UserManager();

router.get("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}), async (req, res) => {
    if (!req.user) {
        return res.status(401).send({status:"Error", message:"Usuario y Contraseña incorrectos!"});
    }

    req.session.user = {first_name:req.user.first_name, last_name:req.user.last_name, email:req.user.email, age:req.user.age};
    res.send({status:"OK", message:"Hola, " + userLogged.first_name + "!"});
});

router.get("/faillogin", (req, res) => {
    res.send({status:"error", message:"Login inválido!"});
})


router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
    res.send({status:"OK", message:"Usuario registrado!"});
});

router.get("/failregister", (req, res) => {
    res.send({status:"Error", message:"Error! No se pudo registar el Usuario!"});
});

router.get("/restore", async (req, res) => {
    let {user, pass} = req.query;
    pass = createHash(pass);
    const passwordRestored = await UM.restorePassword(user, pass);

    if (passwordRestored) {
        res.send({status:"OK", message:"La contraseña se ha actualizado correctamente!"});
    } else {
        res.status(401).send({status:"Error", message:"No se pudo actualizar la contraseña!"});
    }    
})

export default router;