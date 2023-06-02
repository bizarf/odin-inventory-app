const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    res.render("index", { title: "Shopworld" });
});

exports.product_list = asyncHandler(async (req, res, next) => {
    res.render("product_list", { title: "Product List" });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
    res.render("product_detail", { title: "test" });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
    res.render("product_form"), { title: "test" };
});

exports.product_create_post = asyncHandler(async (req, res, next) => {
    res.render("product_form"), { title: "test" };
});

exports.product_delete_get = asyncHandler(async (req, res, next) => {
    res.render("product_delete"), { title: "test" };
});

exports.product_delete_post = asyncHandler(async (req, res, next) => {
    res.render("product_delete"), { title: "test" };
});

exports.product_update_get = asyncHandler(async (req, res, next) => {
    res.render("product_form"), { title: "test" };
});

exports.product_update_post = asyncHandler(async (req, res, next) => {
    res.render("product_form"), { title: "test" };
});
