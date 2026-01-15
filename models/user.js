const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    fullName: {
        type: String
    },
    phone: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['staff', 'admin', 'superAdmin'],
        default: 'staff'
    }
});

userSchema.plugin(timestamp);
userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('user', userSchema);