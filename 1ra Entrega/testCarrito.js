import CartManager from "./CartManager.js";

const cartManager = new CartManager();

cartManager.newCart();
console.log(cartManager.getCarts());
cartManager.addProductToCart(6, 2);
console.log(cartManager.getCarts());