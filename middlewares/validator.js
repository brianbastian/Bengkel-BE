const { check } = require('express-validator');

exports.validate = (activity) => {
    switch (activity) {
        case 'login': {
            return [
                check("password").not().isEmpty().isLength({ min: 8 }).withMessage("Minimum password length is 8")
            ]
        }
    }
}