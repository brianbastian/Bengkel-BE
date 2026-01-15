const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const serviceSchema = new Schema ({
    service_code: {
        type: String
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: 'fullName points' },
        ref: 'member'
    },
    vehicle: {
        brand: { type: String },
        plate_number: { type: String },
    },
    service_type: [
        {
            type_id: {
                type: Schema.Types.ObjectId,
                autopopulate: { select: 'type_name' },
                ref: "servicetype"
            },
            amount: {
                type: Number,
                default: 1
            },
            service_fee: {
                type: Number
            },
            mechanic_id: {
                type: Schema.Types.ObjectId,
                autopopulate: { select: 'mechanic_name' },
                ref: "mechanic"
            },
            mechanic_bonus: {
                type: Number,
                default: 0
            }
        }
    ],
    total: {
        type : Number,
    },
    inQueue: {
        type: Boolean,
        default: true
    },
    inProcess: {
        type: Boolean,
        default: false
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

serviceSchema.plugin(timestamp);
serviceSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('service', serviceSchema);