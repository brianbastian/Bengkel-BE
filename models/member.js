const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    fullName: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    }
});

memberSchema.plugin(timestamp);

module.exports = mongoose.model('member', memberSchema);