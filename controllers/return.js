const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');
const retur = require('../models/return');
const product = require('../models/product');

const returnController = {

    getAll : async (req, res, next) => {
        try {
            var returnList = await retur.find().select(' -__v -created_at ').sort({ updated_at : 1 });
            if (!returnList.length) return apiResponses.dataNotFound(res, "no return data found");
            return apiResponses.successWithData(res, "data retrieved", returnList);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific : async (req, res, next) => {
        try {
            var returnData = await retur.findById(req.params.return_id).select(' -__v -created_at ');
            if (!returnData) return apiResponses.dataNotFound(res, "return id not found");
            return apiResponses.successWithData(res, "data retrieved", returnData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert : async (req, res, next) => {
        try {
            var newReturn = new retur({
                order_id: req.body.order_id,
                returned_products: req.body.returned_products,
                toDistributor: req.body.toDistributor
            });

            if (newReturn.toDistributor == false) {
                for (let i=0; i < newReturn.returned_products.length; i++) {
                    var productData = await product.findById( newReturn.returned_products[i].product_id._id );
                    var newStock = productData.stock + newReturn.returned_products[i].amount
                    await product.findByIdAndUpdate( newReturn.returned_products[i].product_id._id, { stock: newStock }, { new: true } );
                }
                await newReturn.save().then((returnData) => {
                    return apiResponses.successWithData(res, "new return data created", returnData);
                });
            } else if (newReturn.toDistributor == true) {
                for (let i=0; i < newReturn.returned_products.length; i++) {
                    var productData = await product.findById( newReturn.returned_products[i].product_id._id );
                    var newStock = productData.stock - newReturn.returned_products[i].amount
                    await product.findByIdAndUpdate( newReturn.returned_products[i].product_id._id, { stock: newStock }, { new: true } );
                }
                await newReturn.save().then((returnData) => {
                    return apiResponses.successWithData(res, "new return data created", returnData);
                });
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            if (req.params.return_id != null) {
                await retur.findOneAndDelete({ _id : req.params.return_id }).then(() => {
                    return apiResponses.success(res, "return data deleted");
                })
            } else {
                return apiResponses.validationError(res, "return id cannot be null");
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }

}

module.exports = returnController;