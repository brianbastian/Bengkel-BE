const users = require("../models/user");
const apiResponses = require('../helpers/apiResponses');

const isAdmin = async (req, res, next) => {
    let data = await users.findById( req.user._id );
    if (data && data.role == 'admin' || data && data.role == 'superAdmin') {
        next();
    } else {
        return apiResponses.unauthorized(res, "Unauthorized. admins are allowed!");
    }
}

const isOwner = async (req, res, next) => {
    let data = await users.findById( req.user._id );
    if (!data || data.role != "superAdmin") {
        return apiResponses.unauthorized(res, "Unauthorized. Only super admins are allowed!");
    }
    next();
}

module.exports = {
    isAdmin,
    isOwner
}