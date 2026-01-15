const jwt = require('jsonwebtoken');
const apiResponses = require('../helpers/apiResponses');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const timeoutDuration = process.env.JWT_DURATION;

const jwtOptions = {
    expiresIn: timeoutDuration
};

const signOptions = {
    algorithms: ['HS256']
};

const signJwt = async (data) => {
    return token = jwt.sign(data, secret, jwtOptions);
};

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return apiResponses.unauthorized(res, 'no token provided.');

    jwt.verify(token, secret, signOptions, async (err, user) => {
        if (err) {
            return apiResponses.unauthorized(res, err.message);

        } else {
            req.user = user
            let payload = {
                _id: user._id,
                nama_lengkap: user.fullName,
                no_hp: user.phone,
                username: user.username,
                role: user.role
            };
            req.token = await signJwt(payload)
            next()
        }
    });   
}

module.exports = {
    signJwt,
    verifyToken
}