const service = require('../models/service');
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');
const Product = require('../models/product');
const order = require('../models/order');
const member = require("../models/member");

const serviceController = {
    getAll: async (req, res, next) => {
        try {
            var serviceList = await service.find().select(' -__v -created_at ').sort({ updated_at: 1 });

            if (!serviceList.length) {
                return apiResponses.dataNotFound(res, "no service found.");
            } else {
                return apiResponses.successWithData(res, "data retrieved.", serviceList);
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific: async (req, res, next) => {
        try {
            var serviceData = await service.findOne({ _id: req.params.service_id }).select(" -__v -created_at ");
            var orderData = await order.findOne({ service_id : req.params.service_id });

            var data = {
                ...serviceData
            }

            if (!serviceData) return apiResponses.dataNotFound(res, "service id not found.");
            return apiResponses.successWithData(res, "data retrieved.", data);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    process: async (req, res, next) => {
        try {
            await service.findOneAndUpdate({ _id: req.params.service_id }, { inQueue: false, inProcess: true, updated_at: moment() },
            { new: true }).then((data) => {
                return apiResponses.successWithData(res, "status updated.", data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    done: async (req, res, next) => {
        try {
            await service.findOneAndUpdate({ _id: req.params.service_id}, { inProcess: false, isDone: true, updated_at: moment() }, { new: true })
            .then((data) => {
                return apiResponses.successWithData(res, "status updated.", data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert: async (req, res, next) => {
        try {
            
            var total = 0;

            for (let i = 0; i < req.body.service_type.length; i++) {
                total += req.body.service_type[i].service_fee;
            }

            var newService = new service({ ...req.body, total : total });

            await newService.save().then(async (serviceData) => {
                
                var newOrder = new order({
                    order_code : req.body.service_code,
                    products : req.body.products,
                    staff_list : req.body.staff_list,
                    withService : true,
                    customer_name: req.body.customer_name,
                    service_id : serviceData._id,
                    down_payment: req.body.down_payment,
                    note: req.body.note,
                    grand_total : 0
                });

                if ( req.body.isMember == true ) {
                    var memberData = await member.findOne({ phone: req.body.customer_phone });
                    if ( !memberData ) return apiResponses.dataNotFound(res, "member not found");
                    console.log({memberData});

                    newOrder.isMember = true;
                    newOrder.member_id = memberData._id;

                    for (let i = 0; i < newOrder.products.length; i++) {
                        let productData = await Product.findById(newOrder.products[i].product_id);
                        let totalPrice = productData.price.normal * newOrder.products[i].amount;
                        totalPrice = totalPrice - newOrder.products[i].discount;
                        newOrder.products[i].total_price = totalPrice;
                        newOrder.grand_total += newOrder.products[i].total_price;
                    }

                    for (let i = 0; i < serviceData.service_type.length; i++) {
                        newOrder.grand_total += serviceData.service_type[i].service_fee;
                    }

                    await newOrder.save().then( (orderData) => {
                        return apiResponses.successWithData(res, "service successfully inserted.", { serviceData, orderData });
                    })
                } else {
                    
                    for (let i = 0; i < newOrder.products.length; i++) {
                        let productData = await Product.findById(newOrder.products[i].product_id);
                        let totalPrice = productData.price.normal * newOrder.products[i].amount;
                        totalPrice = totalPrice - newOrder.products[i].discount;
                        newOrder.products[i].total_price = totalPrice;
                        newOrder.grand_total += newOrder.products[i].total_price;
                    }

                    for (let i = 0; i < serviceData.service_type.length; i++) {
                        newOrder.grand_total += serviceData.service_type[i].service_fee;
                    }

                    await newOrder.save().then( (orderData) => {
                        return apiResponses.successWithData(res, "service successfully inserted.", { serviceData, orderData });
                    })
                }
            });
        } catch (error) {
            console.log(error);
            return apiResponses.error(res, "Server error");
        }
    },

    update: async (req, res, next) => {
        try {
            await service.findOneAndUpdate({ _id: req.params.service_id }, { ...req.body, updated_at: moment() }, { new: true })
            .then((data) => {
                return apiResponses.successWithData(res, "service successfully updated", data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getDone: async (req, res, next) => {
        try {
            const doneList = await service.find({ isDone: true }).select(" -__v").sort({ updated_at: 1 });

            if (!doneList.length) {
                return apiResponses.dataNotFound(res, "no finished service found.");
            } else {
                return apiResponses.successWithData(res, "data retrieved", doneList);
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getNotDone: async (req, res, next) => {
        try {
            const notDoneList = await service.find({ $or: [ { inQueue: true }, { inProcess: true } ] }).select(" -__v").sort({ updated_at: 1 });

            if (!notDoneList.length) {
                return apiResponses.dataNotFound(res, "no unfinished service found.");
            } else {
                return apiResponses.successWithData(res, "data retrieved", notDoneList);
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }
}

module.exports = serviceController;