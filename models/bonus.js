const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const bonus = new Schema({
    mechanic_id: {
        type: Schema.Types.ObjectId,
        autopopulate: { select: "mechanic_name" },
    },
    today_bonus: {
        type: Number
    }
})

bonus.plugin(timestamp);

module.exports = mongoose.model('bonus', bonus);