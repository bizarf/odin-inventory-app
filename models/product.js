const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    price: { type: Schema.Types.Decimal128, required: true },
    stock: { type: Number, required: true },
    password: { type: String, required: true },
});

ProductSchema.virtual("url").get(function () {
    return `/store/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
