const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    store_code: {
        type: String
    },
    address: {
        type: String
    }
});

storeSchema.plugin(timestamp);

module.exports = mongoose.model('store', storeSchema);