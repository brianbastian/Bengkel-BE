const Order = require('../models/order');
const Reseller= require('../models/reseller');
const Member = require('../models/member');
const Product = require('../models/product');
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');
const orderHandlerSchema = require('../models/orderHandler');   
const { getProductTotal, getGrandTotal } = require('../helpers/dataHandler');
const member = require('../models/member');
const reseller = require('../models/reseller');
const service = require('../models/service');

const orderController = {

    getAll: async (req, res, next) => {
        try {
            const listOrders = await Order.find().select(' -__v ').sort({ updated_at : -1 });

            if (!listOrders.length) return apiResponses.dataNotFound(res, "no orders found.");
            return apiResponses.successWithData(res, "data retrieved.", listOrders);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific: async (req, res, next) => {
        try {
            const orderData = await Order.findById(req.params.order_id).select(' -__v ');

            if (!orderData) return apiResponses.dataNotFound(res, "order not found.");
            return apiResponses.successWithData(res, "data retrieved.", orderData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert: async (req, res, next) => {
        try {
            if ( req.body.isReseller ) {
                var resellerData = await reseller.findOne({ phone: req.body.reseller_phone });
                if ( !resellerData ) return apiResponses.dataNotFound(res, "reseller not found");

                var newOrder = new Order({ ...req.body, reseller_id: resellerData._id, grand_total: 0 });

                for (let i = 0; i < newOrder.products.length; i++) {
                    let productData = await Product.findById(newOrder.products[i].product_id);
                    let totalPrice = productData.price.reseller * newOrder.products[i].amount;
                    totalPrice = totalPrice - newOrder.products[i].discount;
                    newOrder.products[i].total_price = totalPrice;
                    newOrder.grand_total += newOrder.products[i].total_price;
                }
                await newOrder.save().then((data) => {
                    return apiResponses.successWithData(res, "order successfully inserted", data);
                })

            } else if (req.body.isMember) {
                var memberData = await member.findOne({ phone: req.body.member_phone });
                if ( !memberData ) return apiResponses.dataNotFound(res, "member not found")

                var newOrder = new Order({ 
                    order_code: req.body.order_code,
                    products: req.body.products,
                    staff_list: req.body.staff_list,
                    isMember: true,
                    member_id: memberData._id,
                    grand_total: 0
                });

                for (let i = 0; i < newOrder.products.length; i++) {
                    let productData = await Product.findById(newOrder.products[i].product_id);
                    let totalPrice = productData.price.normal * newOrder.products[i].amount;
                    totalPrice = totalPrice - newOrder.products[i].discount;
                    newOrder.products[i].total_price = totalPrice;
                    newOrder.grand_total += newOrder.products[i].total_price;
                }

                await newOrder.save().then((data) => {
                    return apiResponses.successWithData(res, "order successfully inserted", data);
                })
            } else {
                var newOrder = new Order({ ...req.body, grand_total: 0 });

                for (let i = 0; i < newOrder.products.length; i++) {
                    let productData = await Product.findById(newOrder.products[i].product_id);
                    let totalPrice = productData.price.normal * newOrder.products[i].amount;
                    totalPrice = totalPrice - newOrder.products[i].discount;
                    newOrder.products[i].total_price = totalPrice;
                    newOrder.grand_total += newOrder.products[i].total_price;
                }

                await newOrder.save().then((data) => {
                    return apiResponses.successWithData(res, "order successfully inserted", data);
                })
            }
        } catch (error) {
            console.log(error);
            return apiResponses.error(res, "server error");
        }
    },

    update: async (req, res, next) => {
        try {
            var order = await Order.findById(req.params.order_id);
            console.log({...req.body});
            var profit = req.body.profit;

            if (req.body.withService) {
                await service.findByIdAndUpdate(req.body.service_id._id, { service_type: req.body.service_id.service_type, total: req.body.service_id.total }, {new: true}).then((serviceData) => {
		            for (let i=0; i < serviceData.service_type.length; i++) {
                        profit = profit - serviceData.service_type[i].mechanic_bonus;
                    }
                })
            }

            order.profit = profit

            await Order.findByIdAndUpdate(req.params.order_id, { ...req.body, profit: profit }, {new: true}).then((orderData) => {
                return apiResponses.successWithData(res, "order successfully updated", orderData);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            await Order.findByIdAndDelete(req.params.order_id).then(() => {
                return apiResponses.success(res, "order successfully deleted.");
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    payment: async (req, res, next) => {
        try {
            await Order.findByIdAndUpdate( req.params.order_id , { isPaid : true, payment_money : req.body.money, payment_type: req.body.payment_type, updated_at: moment() }, { new : true }).then( async (data) => {

                var notice = []

                for (let i = 0; i < data.products.length; i++) {
                    let productData = await Product.findById(data.products[i].product_id);
                    productData.stock = productData.stock - data.products[i].amount;
                    var bought = productData.buy_price * data.products[i].amount;
                    data.profit += data.products[i].total_price - bought

                    await productData.save();
                    if (productData.stock < productData.minimum_stock) notice.push(productData);
                }

                if (data.withService == true) {
                    let serviceData = await service.findById(data.service_id);
                    data.profit += serviceData.total;
                    for (let i = 0; i < serviceData.service_type.length; i++) {
                        data.profit -= serviceData.service_type[i].mechanic_bonus;
                    }
                }

                var points = 0
                if (data.grand_total >= 100000) {
                    points = Math.floor(data.grand_total / 100000)
                }

                if ( data.isMember == true ) {
                    await member.findById( data.member_id ).then( async (memberData) => {
                        await member.findByIdAndUpdate( data.member_id, { points : memberData.points + points, updated_at : moment() });
                    })
                } else if ( data.isReseller == true ) {
                    await reseller.findById( data.reseller_id ).then( async (resellerData) => {
                        await reseller.findByIdAndUpdate( data.reseller_id, { points : resellerData.points + points, updated_at : moment() });
                    })
                }

                await data.save();

                return apiResponses.successWithData(res, "Payment success", { data, notice });
            })
        } catch (error) {
            console.log(error);
            return apiResponses.error(res, "server error");
        }
    }
}

module.exports = orderController;
