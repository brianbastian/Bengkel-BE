const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    purchasing_code: {
        type: String
    },
    purchase_date: {
        type: String
    },
    amount: {
        type: Number
    },
    price: {
        type: Number
    }
});

purchaseSchema.plugin(timestamp);

module.exports = mongoose.model('purchase', purchaseSchema);