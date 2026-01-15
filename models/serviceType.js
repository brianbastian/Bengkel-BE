const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    type_name : {
        type: String
    }
});

serviceTypeSchema.plugin(timestamp);

module.exports = mongoose.model('servicetype', serviceTypeSchema);