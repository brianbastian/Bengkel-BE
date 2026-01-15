const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const orderHandlerSchema = new Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: "fullName role" },
        ref: 'user'
    },
    order_handled: {
        type: Number
    }
});

orderHandlerSchema.plugin(timestamp);
orderHandlerSchema.plugin(require('mongoose-autopopulate'));

module.exports = orderHandlerSchema;