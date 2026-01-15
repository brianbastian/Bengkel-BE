const reseller = require('../models/reseller');
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');

const resellerController = {
    
    getAll : async (req, res, next) => {
        try {
            var resellerList = await reseller.find().select(" -__v -created_at ");
            if (resellerList.length == 0) return apiResponses.dataNotFound(res, "No reseller found");
            return apiResponses.successWithData(res, "Data retrieved", resellerList);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific : async (req, res, next) => {
        try {
            var resellerData = await reseller.findById( req.params.reseller_id ).select(' -__v -created_at ');
            if (!resellerData) return apiResponses.dataNotFound(res, `No reseller with id : ${req.params.reseller_id} found`);
            return apiResponses.successWithData(res, "Data retrieved", resellerData);
        } catch (error) {
            apiResponses.error(res, "server error");
        }
    },

    insert : async (req, res, next) => {
        try {
            var newReseller = new reseller({
                reseller_name: req.body.reseller_name,
                phone: req.body.phone,
                points: req.body.points
            });
            await newReseller.save().then( (data) => {
                return apiResponses.successWithData(res, "New reseller data successfully inserted", data);
            })
        } catch (error) {
            apiResponses.error(res, "server error");
        }
    },

    update : async (req, res, next) => {
        try {
            await reseller.findByIdAndUpdate( req.params.reseller_id, { reseller_name : req.body.reseller_name, phone : req.body.phone, updated_at : moment() }, {new:true}).then( (data) => {
                return apiResponses.successWithData(res, "Reseller data successfully updated", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete : async (req, res, next) => {
        try {
            await reseller.findByIdAndDelete( req.params.reseller_id ).then( () => {
                return apiResponses.success(res, "Reseller data successfully deleted");
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }

}

module.exports = resellerController;