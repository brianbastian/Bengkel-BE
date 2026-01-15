const bcrypt = require('bcrypt');
const users = require('../models/user');
const { validationResult } = require('express-validator');
const apiResponses = require('../helpers/apiResponses');
const { signJwt } = require('../middlewares/auth');
require('dotenv').config();

const authController = {
    register: async (req, res, next) => {
        try {
            const {password} = req.body
            let passwordHash = await bcrypt.hash(password + process.env.SALT, 10)
            let user = new users({ ...req.body, password: passwordHash })
            await user.save().then(() => {
                return apiResponses.successWithData(res, "registration success", user)
            })

        } catch (error) {
            console.log(error.message)
            return apiResponses.ErrorResponseWithData(res, "Server error", error);
        }
    },

    login: async (req, res, next) => {
        try {
            var validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return apiResponses.validationErrorWithData(res, "validation error.", validationErrors.array());
            }

            var user = await users.findOne({ username: req.body.username });
            if (!user) return apiResponses.notFound(res, "user not found.");

            const passMatch = await bcrypt.compare(req.body.password + process.env.SALT, user.password);
            if (!passMatch) return apiResponses.validationError(res, "incorrect password.");

            var data = {
                _id: user._id,
                nama_lengkap: user.fullName,
                no_hp: user.phone,
                username: user.username,
                role: user.role
            }

            var token = await signJwt(data);
            data.token = token;
            return apiResponses.successWithData(res, "login success.", data);
        } catch (error) {
            return apiResponses.errorWithData(res, "login failed.", error);
        }
    },

    profile: async (req, res, next) => {
        try {
            const userData = await users.findById(req.user._id).select(' -password -__v -created_at ');
            return apiResponses.successWithData(res, "data retrieved.", userData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }
}

module.exports = authController;