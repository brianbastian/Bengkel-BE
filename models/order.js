const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    order_code: {
        type: String
    },
    products: [
        {
            product_id: {
                type: Schema.Types.ObjectId,
                autopopulate: { select: 'product_code product_name price buy_price unit' },
                ref: "product"
            },
            amount: {
                type: Number,
                default: 0
            },
            discount: {
                type: Number,
                default: 0
            },
            total_price: {
                type: Number,
                default: 0
            }
        }
    ],
    staff_list: [
        {
            staff_id: {
                type: Schema.Types.ObjectId,
                autopopulate: { select: "fullName role" },
                ref: 'user'
            }
        }
    ],
    customer_name: {
        type: String,
        default: null
    },
    isMember: {
        type: Boolean,
        default: false
    },
    member_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: "fullName points" },
        ref: "member",
        required: function() {
            return this.isMember ? true : false
        }
    },
    isReseller: {
        type: Boolean,
        default: false
    },
    reseller_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: "fullName" },
        ref: "reseller",
        required: function() {
            return this.isReseller ? true : false
        }
    },
    withService: {
        type: Boolean,
        default: false
    },
    service_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: "customer_id vehicle service_type total inQueue inProcess isDone" },
        ref: "service",
        required: function() {
            return this.withService ? true : false
        }
    },
    down_payment: {
        type: Number,
        default: 0
    },
    grand_total: {
        type: Number,
        default: 0
    },
    payment_money: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    payment_type: {
        type: String,
        default: "CASH"
    },
    profit: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: null
    }
})

orderSchema.plugin(timestamp);
orderSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('order', orderSchema);