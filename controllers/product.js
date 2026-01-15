const products = require('../models/product');
const moment = require('moment-timezone');
const apiResponses = require('../helpers/apiResponses');
const exceljs = require('exceljs');
const { saveProduct } = require('../helpers/dataHandler')

const productController = {

    getAll: async (req, res, next) => {
        try {
            const listProducts = await products.find().select(' -created_at -__v ');

            if (!listProducts.length) return apiResponses.dataNotFound(res, "no products found.");
            return apiResponses.successWithData(res, "data retrieved.", listProducts);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getActive: async (req, res, next) => {
        try {
            const listProducts = await products.find({ isActive: true }).select(' -created_at -__v ');

            if (!listProducts.length) return apiResponses.dataNotFound(res, "no active products found.");
            return apiResponses.successWithData(res, "data retrieved.", listProducts);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getNonActive: async (req, res, next) => {
        try {
            const listProducts = await products.find({ isActive: false }).select(' -created_at -__v ');

            if (!listProducts.length) return apiResponses.dataNotFound(res, "no active products found.");
            return apiResponses.successWithData(res, "data retrieved.", listProducts);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific: async (req, res, next) => {
        try {
            const productData = await products.findById(req.params.product_id).select(' -__v -created_at ');

            if (!productData) return apiResponses.dataNotFound(res, "product not found.");
            return apiResponses.successWithData(res, "data retrieved.", productData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert: async (req, res, next) => {
        try {
            var newProduct = new products({ ...req.body, isActive: true });
            await newProduct.save().then( (data) => {
                return apiResponses.successWithData(res, "product successfully inserted", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    update: async (req, res, next) => {
        try {
            await products.findOneAndUpdate({ _id: req.params.product_id }, { ...req.body, updated_at : moment() },
            { new: true }).then((data) => {
                return apiResponses.successWithData(res, "product successfully updated", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            await products.findByIdAndDelete(req.params.product_id).then(() => {
                return apiResponses.success(res, "product successfully deleted.");
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    upload: async (req, res, next) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
              return apiResponses.validationError(res, "File not found");
            }

            const excelFile = req.files.excelFile;
            const buffer = excelFile.data;

            const workbook = new exceljs.Workbook();
            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);

            const row = worksheet.actualColumnCount;

            worksheet.eachRow(async function (row, index) {
                var rowValues = row.values
                rowValues = rowValues.slice(1);
                if ( index != 1 ) {
                    var [ product_code, barcode_code, product_name, stock, minimum_stock, normal_price, reseller_price, buy_price, rack, distributor ] = rowValues;
                    const productExists = await products.findOne({ product_code: product_code });
                    if (!productExists) {
                        var newProduct = new products({ 
                            product_code : product_code, 
                            product_name : product_name, 
                            stock : stock,
                            unit: "pcs",
                            minimum_stock : minimum_stock,
                            barcode_code: barcode_code,
                            price: {
                                normal : normal_price,
                                reseller : reseller_price
                            },
                            buy_price : buy_price,
                            rack: rack,
                            distributor : distributor
                        });
                        await newProduct.save().then(() => {
                            console.log("product: " + index + " = " + JSON.stringify(newProduct));
                        })
                    } else if (productExists && productExists.isActive == true ) {
                        let updatedProduct = {
                            product_code : product_code, 
                            product_name : product_name, 
                            stock : stock,
                            unit: "pcs",
                            minimum_stock : minimum_stock,
                            barcode_code: barcode_code,
                            price: {
                                normal : normal_price,
                                reseller : reseller_price
                            },
                            buy_price : buy_price,
                            rack: rack,
                            distributor : distributor
                        }
                        await products.findOneAndUpdate({ _id: productExists._id }, updatedProduct);
                    } else if (productExists && productExists.isActive == false ) {
                        let updatedProduct = {
                            product_code : product_code, 
                            product_name : product_name, 
                            stock : stock,
                            unit: "pcs",
                            minimum_stock : minimum_stock,
                            barcode_code: barcode_code,
                            price: {
                                normal : normal_price,
                                reseller : reseller_price
                            },
                            buy_price : buy_price,
                            rack: rack,
                            distributor : distributor,
                            isActive: true
                        }
                        await products.findOneAndUpdate({ _id: productExists._id }, updatedProduct);
                    }
                }
            })

            return apiResponses.success(res, `${row} row data successfully imported`);
        } catch (error) {
            console.error('Error:', error.message);
            return apiResponses.errorWithData(res, "Server error", error);
        }
    }

}

module.exports = productController;
