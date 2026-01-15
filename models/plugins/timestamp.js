const moment = require('moment-timezone');

module.exports = function timestamp (schema) {
    schema.set('timestamps', {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};