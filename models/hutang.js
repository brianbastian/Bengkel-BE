const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const hutangSchema = new Schema({
    supplierName: {
        type: String
    },
    total: {
        type: Number
    },
    due_date: {
        type: String
    }
})

hutangSchema.plugin(timestamp);

module.exports = mongoose.model('hutang', hutangSchema);