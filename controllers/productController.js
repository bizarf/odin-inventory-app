const Product = require("../models/product");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    const [numProducts, numCategories] = await Promise.all([
        Product.countDocuments().exec(),
        Category.countDocuments().exec(),
    ]);

    res.render("index", {
        title: "Shopworld",
        product_total: numProducts,
        category_total: numCategories,
    });
});

exports.product_list = asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find().sort({ name: 1 }).exec();

    res.render("product_list", {
        title: "Product List",
        product_list: allProducts,
    });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
        .populate("category")
        .exec();

    if (product === null) {
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
    }

    res.render("product_detail", { title: "Product detail", product: product });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
    // fetch the categories from the database and return only the names
    const categories = await Category.find({}, { name: 1 }).sort({ name: 1 });

    res.render("product_form", {
        title: "Create product",
        category_list: categories,
    });
});

exports.product_create_post = [
    body("name", "* You must enter a name")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "* You must enter a description")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category", "* You must choose a category")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "* You must enter a price")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("stock", "* You must enter the stock amount")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "* Password must contain at least 8 characters")
        .trim()
        .isLength({ min: 8 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        // fetch the categories from the database and return only the names
        const categories = await Category.find({}, { name: 1 }).sort({
            name: 1,
        });

        const errors = validationResult(req);

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            password: req.body.password,
        });

        if (!errors.isEmpty()) {
            res.render("product_form", {
                title: "Create product",
                product: product,
                category_list: categories,
                selected_category: req.body.category,
                errors: errors.array(),
            });
            return;
        } else {
            // if no error, then first check if the category already exists
            const productExist = await Product.findOne({
                name: req.body.name,
            }).exec();

            if (productExist) {
                res.redirect(productExist.url);
            } else {
                await product.save();
                res.redirect(product.url);
            }
        }
    }),
];

exports.product_delete_get = asyncHandler(async (req, res, next) => {
    // get the category details, and check for any products that contain the same category id
    const product = await Product.findById(req.params.id).exec();

    if (product === null) {
        res.redirect("/store/products");
    }

    res.render("product_delete", {
        title: "Delete product",
        product: product,
    });
});

exports.product_delete_post = [
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("* Password must contain at least 8 characters")
        .escape()
        // custom validator to check if the password matches with the one on the database
        .custom(async (value, { req, res }) => {
            const product = await Product.findById(req.params.id, {
                password: 1,
            }).exec();
            if (product.password != value) {
                throw new Error("* The password does not match");
            }
        }),

    asyncHandler(async (req, res, next) => {
        // get the category data using the id. also check if there are any products that have the category id
        const product = await Product.findById(req.params.id).exec();

        const errors = validationResult(req);

        // error check
        if (!errors.isEmpty()) {
            res.render("product_delete", {
                title: "Delete product",
                product: product,
                errors: errors.array(),
            });
            return;
        } else {
            await Product.findByIdAndRemove(req.body.productId);
            res.redirect("/store/products");
        }
    }),
];

exports.product_update_get = asyncHandler(async (req, res, next) => {
    // get the product from the database, and the list of categories
    const [product, categories] = await Promise.all([
        Product.findById(req.params.id).populate("category").exec(),
        Category.find({}, { name: 1 }).sort({
            name: 1,
        }),
    ]);

    if (product === null) {
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
    }

    res.render("product_form", {
        title: "Update product",
        product: product,
        category_list: categories,
        selected_category: product.category.name,
    });
});

exports.product_update_post = [
    body("name", "* You must enter a name")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "* You must enter a description")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category", "* You must choose a category")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "* You must enter a price")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("stock", "* You must enter the stock amount")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("* Password must contain at least 8 characters")
        .escape()
        // custom validator to check if the password matches with the one on the database
        .custom(async (value, { req, res }) => {
            const product = await Product.findById(req.params.id).exec();
            if (product.password != value) {
                throw new Error("* The password does not match");
            }
        }),

    asyncHandler(async (req, res, next) => {
        // fetch the categories from the database and return only the names
        const categories = await Category.find({}, { name: 1 }).sort({
            name: 1,
        });
        const product = await Product.findById(req.params.id).exec();

        const errors = validationResult(req);

        const updatedProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            password: product.password,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("product_form", {
                title: "Update product",
                product: updatedProduct,
                category_list: categories,
                selected_category: req.body.category,
                errors: errors.array(),
            });
            return;
        } else {
            await Product.findByIdAndUpdate(req.params.id, updatedProduct, {});
            res.redirect(product.url);
        }
    }),
];
