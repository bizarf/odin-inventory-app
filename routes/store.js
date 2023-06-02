const express = require("express");
const router = express.Router();

// controller modules
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

// Product routes

/* GET home page. */
router.get("/", productController.index);

// GET request for the product creation form
router.get("/product/create", productController.product_create_get);

// POST request for the product creation form
router.post("/product/create", productController.product_create_post);

// GET request for deleting a product
router.get("/product/:id/delete", productController.product_delete_get);

// POST request for deleting a product
router.get("/product/:id/delete", productController.product_delete_post);

// GET request for updating a product
router.get("/product/:id/update", productController.product_update_get);

// POST request for updating a product
router.get("/product/:id/update", productController.product_update_post);

// GET request for the list of all products
router.get("/products", productController.product_list);

// GET request for a page with the product details
router.get("/product/:id", productController.product_detail);

// Category routes

// GET request for the category creation form
router.get("/category/create", categoryController.category_create_get);

// POST request for the category creation form
router.post("/category/create", categoryController.category_create_post);

// GET request for deleting a category
router.get("/category/:id/delete", categoryController.category_delete_get);

// POST request for deleting a category
router.post("/category/:id/delete", categoryController.category_delete_post);

// GET request for updating a category
router.get("/category/:id/update", categoryController.category_update_get);

// POST request for updating a category
router.post("/category/:id/update", categoryController.category_update_post);

// GET request for the list of all categories
router.get("/categories", categoryController.category_list);

// GET request for a page with the category details
router.get("/category/:id", categoryController.category_detail);

module.exports = router;
