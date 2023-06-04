const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    res.render("category_list", {
        title: "Category List",
        category_list: allCategories,
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    // find the category by the id, and also do a check for any products that also have that same id in it's category section
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }).sort({ name: 1 }).exec(),
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
    // clean and sanitize form fields. also check correct number of characters entered
    body("name", "* You must enter a name")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "* Password must contain at least 8 characters")
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
                category: category,
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
    // get the category details, and check for any products that contain the same category id
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }).exec(),
    ]);

    if (category === null) {
        res.redirect("/store/categories");
    }

    res.render("category_delete", {
        title: "Delete category",
        category: category,
        category_products: productsInCategory,
    });
});

exports.category_delete_post = [
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("* Password must contain at least 8 characters")
        .escape()
        // custom validator to check if the password matches with the one on the database
        .custom(async (value, { req, res }) => {
            const category = await Category.findById(req.params.id, {
                password: 1,
            }).exec();
            if (category.password != value) {
                throw new Error("* The password does not match");
            }
        }),

    asyncHandler(async (req, res, next) => {
        // get the category data using the id. also check if there are any products that have the category id
        const [category, productsInCategory] = await Promise.all([
            Category.findById(req.params.id).exec(),
            Product.find({ category: req.params.id }).exec(),
        ]);

        const errors = validationResult(req);

        if (productsInCategory.length > 0) {
            res.render("category_delete", {
                title: "Delete category",
                category: category,
                category_products: productsInCategory,
            });
            return;
        } else {
            // error check
            if (!errors.isEmpty()) {
                res.render("category_delete", {
                    title: "Delete category",
                    category: category,
                    category_products: productsInCategory,
                    errors: errors.array(),
                });
                return;
            } else {
                await Category.findByIdAndRemove(req.body.categoryId);
                res.redirect("/store/categories");
            }
        }
    }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", {
        title: "Update category",
        category: category,
    });
});

exports.category_update_post = [
    // clean and sanitize form fields. also check correct number of characters entered
    body("name", "* You must enter a name")
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
            const category = await Category.findById(req.params.id).exec();
            if (category.password != value) {
                throw new Error("* The password does not match");
            }
        }),

    asyncHandler(async (req, res, next) => {
        const category = await Category.findById(req.params.id).exec();

        const errors = validationResult(req);

        const updatedCategory = new Category({
            name: req.body.name,
            password: category.password,
            _id: req.params.id,
        });

        // if there is an error, then re-render the form with any already filled in details and pass an array containing the error messages
        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Update category",
                category: updatedCategory,
                errors: errors.array(),
            });
            return;
        } else {
            await Category.findByIdAndUpdate(
                req.params.id,
                updatedCategory,
                {}
            );
            res.redirect(category.url);
        }
    }),
];
