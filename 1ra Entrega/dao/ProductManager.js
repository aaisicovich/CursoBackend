//const fs = require("fs");
import fs from "fs";
import Product from "./models/Product.js";

class ProductManager {
  // constructor(io) {
  //   this.products = [];
  //   this.path = "Products.json";
  //   this.createFile();
  //   this.io = io;
  // }

  // createFile() {
  //   if (!fs.existsSync(this.path)) {
  //     fs.writeFileSync(this.path, JSON.stringify(this.products));
  //   }
  // }

  // addProduct(product) {
  //   if (this.validateCode(product.code)) {
  //     console.log("Code ya existente");

  //     return false;
  //   } else {
  //     const producto = {
  //       id: this.generateId(),
  //       title: product.title,
  //       description: product.description,
  //       code: product.code,
  //       price: product.price,
  //       status: product.status,
  //       stock: product.stock,
  //       category: product.category,
  //       thumbnails: product.thumbnails,
  //     };
  //     this.products = this.getProducts();
  //     this.products.push(producto);
  //     this.saveProducts();
  //     //io.emit('productAdded', product);
  //     console.log("Producto agregado");

  //     return true;
  //   }
  // } FileSystem
  async addProduct(product) {
    try {
      if (await this.validateCode(product.code)) {
        console.log("Code ya existente");
        return false;
      } else {
        await Product.create(product)
        console.log("Producto agregado");
        return true;
      }
    } catch (error) {
      return false;
    }

  }

  // updateProduct(id, product) {
  //   this.products = this.getProducts();
  //   let pos = this.products.findIndex((item) => item.id === id);

  //   if (pos > -1) {
  //     this.products[pos].title = product.title;
  //     this.products[pos].description = product.description;
  //     this.products[pos].code = product.code;
  //     this.products[pos].price = product.price;
  //     this.products[pos].status = product.status;
  //     this.products[pos].stock = product.stock;
  //     this.products[pos].category = product.category;
  //     this.products[pos].thumbnails = product.thumbnails;
  //     this.saveProducts();
  //     console.log("Producto actualizado");

  //     return true;
  //   } else {
  //     console.log("No encontrado!");

  //     return false;
  //   }
  // } FileSystem

  async updateProduct(id, product) {
    try {
      if (this.validateId(id)) {   
          if (await this.getProductById(id)) {
              await productModel.updateOne({_id:id}, product);
              console.log("Product updated!");
  
              return true;
          }
      }
      
      return false;
  } catch (error) {
      console.log("Not found!");

      return false;
  }
}

  // deleteProduct(id) {
  //   this.products = this.getProducts();
  //   let pos = this.products.findIndex((item) => item.id === id);

  //   if (pos > -1) {
  //     this.products.splice(pos, 1);
  //     0, 1;
  //     this.saveProducts();
  //     //io.emit('productDeleted', id);
  //     console.log("Producto #" + id + " borrado");

  //     return true;
  //   } else {
  //     console.log("No encontrado");

  //     return false;
  //   }
  // } FileSystem


  async deleteProduct(id) {
    try {
        if (this.validateId(id)) {    
            if (await this.getProductById(id)) {
                await productModel.deleteOne({_id:id});
                console.log("Product deleted!");

                return true;
            }
        }

        return false;
    } catch (error) {
        console.log("Not found!");

        return false;
    }
}

  // getProducts() {
  //   let products = JSON.parse(fs.readFileSync(this.path, "utf-8"));

  //   return products;
  // } FileSystem

  async getProducts(limit) {
    return await limit ? productModel.find().limit(limit).lean() : productModel.find().lean();
}

  // getProductById(id) {
  //   this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));

  //   return this.products.find((item) => item.id === id) || "No encontrado";
  // } FileSystem
  async getProductById(id) {
    if (this.validateId(id)) {
        return await productModel.findOne({_id:id}).lean() || null;
    } else {
        console.log("Not found!");
        
        return null;
    }
}


  // validateCode(code) {
  //   return this.products.some((item) => item.code === code);
  // }
  async validateCode(code) {
    return await productModel.findOne({code:code}) || false;
}

  validateId(id) {
    return id.length === 24 ? true : false;
}
  // generateId() {
  //   let max = 0;
  //   let products = this.getProducts();

  //   products.forEach((item) => {
  //     if (item.id > max) {
  //       max = item.id;
  //     }
  //   });

  //   return max + 1;
  // }

  // saveProducts() {
  //   fs.writeFileSync(this.path, JSON.stringify(this.products));
  // }
}

export default ProductManager;
