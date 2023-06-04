const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    password: { type: String, required: true },
});

ProductSchema.virtual("url").get(function () {
    return `/store/product/${this._id}`;
});

// virtual to convert the price into a string with either the pound symbol or a p symbol
ProductSchema.virtual("price_converted").get(function () {
    if (this.price < 1) {
        return `${this.price.toFixed(2)}p`;
    } else {
        return `£${this.price.toFixed(2)}`;
    }
});

module.exports = mongoose.model("Product", ProductSchema);
