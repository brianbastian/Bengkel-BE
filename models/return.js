const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const returnSchema = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: 'order_code' },
        ref: "order"
    },
    returned_products: [
        {
            product_id: {
                type: Schema.Types.ObjectId,
                autopopulate: { select: 'product_code product_name distributor' },
                ref: "product"
            },
            amount: {
                type: Number
            }
        }
    ],
    toDistributor: {
        type: Boolean,
        default: false
    }
})

returnSchema.plugin(require('mongoose-autopopulate'));
returnSchema.plugin(timestamp);

module.exports = mongoose.model('return', returnSchema);