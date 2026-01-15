const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Schema = mongoose.Schema;

const mechanicSchema = new Schema({
    
    mechanic_name: {
        type: String
    },
    
    phone: {
        type: String
    },

    bonus: {
        monday: {
            date: {
                type: String,
                default: null
            },
            total: {
                type: Number,
                default: 0
            }
        },
        tuesday: {
            date: {
                type: String,
                default: null
            },
            total: {
                type: Number,
                default: 0
            }
        },
        wednesday: {
            date: {
                type: String,
                default: null
            },
            total: {
                type: Number,
                default: 0
            }
        },
        thursday: {
            date: {
                type: String,
                default: null
            },
            total: {
                type: Number,
                default: 0
            }
        },
        friday: {
            date: {
                type: String,
                default: null
            },
            total: {
                type: Number,
                default: 0
            }
        },
        saturday: {
            date: {
                type: String,
                default: null
            },
            total: {
                type: Number,
                default: 0
            }
        }
    }

});

mechanicSchema.plugin(timestamp);

module.exports = mongoose.model('mechanic', mechanicSchema);