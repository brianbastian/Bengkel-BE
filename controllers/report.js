const apiResponses = require('../helpers/apiResponses');
const moment = require('moment');
const order = require('../models/order');
const service = require('../models/service');
const { groupByDate } = require('../helpers/dataHandler');

const reportController = {
    getChart: async (req, res, next) => {
        try {
            var end_date_valid = moment(req.query.end_date).isAfter(moment(req.query.start_date)) || moment(req.query.end_date).isSame(moment(req.query.start_date));
            var start_date_valid = moment(req.query.start_date).isBefore(moment()) || moment(req.query.start_date).isSame(moment());
            if (!end_date_valid && !start_date_valid) return apiResponses.validationError(res, "date not valid");

            var start_date = moment(req.query.start_date).startOf("day");
            var end_date = moment(req.query.end_date).endOf("day");

            await order.find({
                created_at: {
                    $gte: start_date.toDate(),
                    $lte: end_date.toDate()
                }
            }).sort({ updated_at: 1 }).then( (data) => {
                if ( data.length == 0 ) return apiResponses.dataNotFound(res, "no order data found");
                
                var chartData = groupByDate(data, start_date, end_date);
                return apiResponses.successWithData(res, "success", {chartData});
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getRevenue: async (req, res, next) => {
        try {
            var start_date = moment(req.query.start_date).startOf("day");
            var end_date = moment(req.query.end_date).endOf("day");

            var orders = await order.find({
                updated_at: {
                    $gte: start_date.toDate(),
                    $lte: end_date.toDate()
                }
            }).sort({ updated_at: 1 }).select(' -__v ');

            if ( orders.length == 0 ) return apiResponses.successWithData(res, "data retrieved", { paid : 0, unpaid : 0, total : 0 });

            var revenueData = {
                paid : 0,
                unpaid : 0,
                total : 0
            }

            for (let i = 0; i < orders.length; i++) {
                if (orders[i].isPaid == true) revenueData.paid = revenueData.paid + orders[i].grand_total;
                if (orders[i].isPaid == false) revenueData.unpaid = revenueData.unpaid + orders[i].grand_total;
                revenueData.total = revenueData.total + orders[i].grand_total;
            }
            
            return apiResponses.successWithData(res, "data retrieved", revenueData)
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },
    
    profit: async (req, res, next) => {
        try {
            const orders = await order.find({
                updated_at: {
                    $gte: moment(req.query.start_date).startOf("day").toDate(),
                    $lte: moment(req.query.end_date).endOf("day").toDate()
                }, isPaid : true
            })
            .sort({ updated_at: 1 })
            .select('-__v');

            if (orders.length == 0) return apiResponses.successWithData(res, "data retrieved", { profit : 0 });

            var profit = 0;

            for (let i=0; i < orders.length; i++) {
                profit = profit + orders[i].profit;
            }

            return apiResponses.successWithData(res, "data retrieved", { profit : profit });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }
};

module.exports = reportController;