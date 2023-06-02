#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");

const products = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createProducts();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function categoryCreate(name, password) {
    const category = new Category({ name: name, password: password });
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
}

async function productCreate(
    name,
    description,
    category,
    price,
    stock,
    password
) {
    productdetail = {
        name: name,
        description: description,
        category: category,
        price: price,
        stock: stock,
        password: password,
    };

    const product = new Product(productdetail);
    await product.save();
    products.push(product);
    console.log(`Added product: ${name}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate("Fruits and Vegetables", "password12345"),
        categoryCreate("Bakery", "password12345"),
        categoryCreate("Meat", "password12345"),
        categoryCreate("Dairy", "password12345"),
        categoryCreate("Frozen", "password12345"),
    ]);
}

async function createProducts() {
    console.log("Adding Products");
    await Promise.all([
        productCreate(
            "Granny Smith Apple",
            "A single Granny Smith apple",
            categories[4],
            0.3,
            75,
            "password12345"
        ),
        productCreate(
            "Soft Medium Sliced White Bread 800g",
            "A soft medium sliced white bread.",
            categories[0],
            0.8,
            100,
            "password12345"
        ),
        productCreate(
            "Bananas x5",
            "A bunch of bananas.",
            categories[4],
            0.85,
            75,
            "password12345"
        ),
        productCreate(
            "Fresh Chicken Wings 1kg",
            "A pack of fresh cut chicken wings on the bone with skin.",
            categories[1],
            2.0,
            50,
            "password12345"
        ),
        productCreate(
            "Single Mango",
            "A single mango weighing at around 80g. ",
            categories[4],
            0.85,
            50,
            "password12345"
        ),
    ]);
}
