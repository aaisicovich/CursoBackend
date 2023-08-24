import fs from "fs";
import { cartModel } from "./models/Cart.js";

class CartManager {
    // constructor() {
    //     this.carts = [];
    //     this.path = "Carrito.json";
    //     this.createFile();
    // }

    // createFile() {
    //     if (!fs.existsSync(this.path)) {
    //         fs.writeFileSync(this.path, JSON.stringify(this.carts));
    //     } else {
    //         this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    //     }
    // }

    // newCart() {
    //     this.carts.push({id:this.generateId(), products:[]});
    //     this.saveCart();
    //     console.log("Cart created!");

    //     return true;
    // }
    async newCart() {
      await cartModel.create({products:[]});
      console.log("Cart created!");

      return true;
  }


    // getCart(id) {
    //     this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));

    //     return this.carts.find(item => item.id === id);
    // }
    async getCart(id) {
      if (this.validateId(id)) {
          return await cartModel.findOne({_id:id}).lean() || null;
      } else {
          console.log("Not found!");
          
          return null;
      }
  }


    // getCarts() {
    //     let carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));

    //     return carts;
    // }
    async getCarts() {
      return await cartModel.find().lean();
  }

    // generateId() {
    //     let max = 0;
    //     let carts = this.getCarts();

    //     carts.forEach(item => {
    //         if (item.id > max) {
    //             max = item.id;
    //         }
    //     });

    //     return max+1;
    // }
    // saveCart() {
    //     fs.writeFileSync(this.path, JSON.stringify(this.carts));
    // }

    // addProductToCart(cid, pid) {
    //     this.carts = this.getCarts();
    //     const cart = this.carts.find(item => item.id === cid);
    //     let product = cart.products.find(item => item.product === pid);

    //     if (product) {
    //         product.quantity+= 1;
    //     } else {
    //         cart.products.push({product:pid, quantity:1});
    //     }

    //     this.saveCart();
    //     console.log("Product added!");

    //     return true;
    // }    
    async addProductToCart(cid, pid) {
      try {
          if (this.validateId(cid)) {
              const cart = await this.getCart(cid);
              const product = cart.products.find(item => item.product === pid);

              if (product) {
                  product.quantity+= 1;
              } else {
                  cart.products.push({product:pid, quantity:1});
              }

              await cartModel.updateOne({_id:cid}, {products:cart.products});
              console.log("Product added!");
  
              return true;
          } else {
              console.log("Not found!");
              
              return false;
          }
      } catch (error) {
          return false
      }
  }
  
  validateId(id) {
      return id.length === 24 ? true : false;
  }

}

export default CartManager;