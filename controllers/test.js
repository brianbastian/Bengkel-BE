const products = require('../models/product');
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment');

const testController = {
    grouping : async (req, res, next) => {
        console.log("grouping");
        var today = moment().startOf("day");
        console.log(today.toDate());
        console.log(today);
        var data = await products.find({
            createdAt: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        });
        return apiResponses.successWithData(res, "success", data);
    },
    getAll: async (req, res, next) => {
        try {
            var today = moment("2024-03-26").startOf("day");
            var end_day = moment("2024-03-28").endOf("day");
            console.log(today.toDate());
            console.log(today);
            var data = await products.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: end_day.toDate()
                }
            });
            return apiResponses.successWithData(res, "success", data);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },
}

module.exports = testController;