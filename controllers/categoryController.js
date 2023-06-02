const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    console.log(allCategories);
    res.render("category_list", {
        title: "Category List",
        category_list: allCategories,
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }).exec(),
    ]);
    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: "Category detail",
        category: category,
        category_products: productsInCategory,
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", { title: "Create category" });
});

exports.category_create_post = [
    body("name", "You must enter a name").trim().isLength({ min: 1 }).escape(),
    body("password", "Password must contain at least 8 characters")
        .trim()
        .isLength({ min: 8 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            password: req.body.password,
        });

        // if there is an error, then re-render the form with any already filled in details and pass an array containing the error messages
        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create category",
                name: req.body.name,
                password: req.body.password,
                errors: errors.array(),
            });
            return;
        } else {
            // if no error, then first check if the category already exists
            const categoryExist = await Category.findOne({
                name: req.body.name,
            }).exec();
            if (categoryExist) {
                res.redirect(categoryExist.url);
            } else {
                await category.save();
                res.redirect(category.url);
            }
        }
    }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.render("category_delete"), { title: "test" };
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.render("category_delete"), { title: "test" };
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.render("category_form"), { title: "test" };
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.render("category_form"), { title: "test" };
});
