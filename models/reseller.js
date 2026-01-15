const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const resellerSchema = new Schema({
    reseller_name: {
        type: String
    },
    phone: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    }
});

resellerSchema.plugin(timestamp);

module.exports = mongoose.model('reseller', resellerSchema);