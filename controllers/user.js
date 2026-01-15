const users = require("../models/user");
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');

const usersController = {
    add: async (req, res, next) => {
        try {
            var newUser = new users({ ...req.body });
            newUser.save().then( (data) => {
                return apiResponses.successWithData(res, "user successfully inserted", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getAll: async (req, res, next) => {
        try {
            const listUsers = await users.find().select(' -password -__v -created_at').sort({ updated_at: 1 });
            if (!listUsers.length) {
                return apiResponses.dataNotFound(res, "no users found");
            } else {
                return apiResponses.successWithData(res, "data retrieved", listUsers);
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific: async (req, res, next) => {
        try {
            const userData = await users.findById(req.params.user_id).select('-password -__v -created_at');
            if (!userData) return apiResponses.dataNotFound(res, "user not found");

            return apiResponses.successWithData(res, "data retrieved.", userData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },
    
    update: async (req, res, next) => {
        try {
            await users.findOneAndUpdate({ _id: req.params.user_id }, { ...req.body, updated_at: moment() },
            { new: true }).then((data) => {
                return apiResponses.successWithData(res, "user data successfully updated.", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            await users.findOneAndDelete({ _id: req.params.user_id })
            return apiResponses.success(res, "user successfully deleted.");
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }
}

module.exports = usersController