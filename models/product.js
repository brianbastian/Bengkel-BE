const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_code: {
        type: String
    },
    product_name: {
        type: String
    },
    category: {
        type: String
    },
    stock: {
        type: Number,
        default : 0
    },
    minimum_stock: {
        type: Number,
        default : 0
    },
    barcode_code: {
        type: String
    },
    unit: {
        type: String,
        default: "pcs"
    },
    price: {
        normal: {
            type: Number,
            default : 0
        },
        reseller: {
            type: Number,
            default : 0
        }
    },
    buy_price: {
        type: Number,
        default : 0
    },
    distributor: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rack: {
        type: String,
        default: null
    }
});

productSchema.plugin(timestamp);
productSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('product', productSchema);
