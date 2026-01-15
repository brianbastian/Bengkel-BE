const serviceType = require('../models/serviceType');
const moment = require('moment');
const apiResponses = require('../helpers/apiResponses');

const serviceTypeController = {
    
    getAll : async (req, res, next) => {
        try {
            var types = await serviceType.find().select(' -__v -created_at ').sort({ updated_at: 1 });
            if ( !types.length ) return apiResponses.dataNotFound(res, "no service types found");
            return apiResponses.successWithData(res, "data retrieved", types);
        } catch (error) {
            return apiResponses.errorWithData(res, "server error", error);
        }
    },

    getSpecific : async (req, res, next) => {
        try {
            var type = await serviceType.findById(req.params.type_id).select(' -__v -created_at ');
            if ( !type ) return apiResponses.dataNotFound(res, `no service type with id ${req.params.type_id} found`);
            return apiResponses.successWithData(res, "data retrieved", type);
        } catch (error) {
            return apiResponses.errorWithData(res, "server error", error);
        }
    },

    update : async (req, res, next) => {
        try {
            await serviceType.findByIdAndUpdate(req.params.type_id, { type_name : req.body.type_name }, { new: true }).then( (data) => {
                return apiResponses.successWithData(res, "service type successfully updated", data);
            })
        } catch (error) {
            return apiResponses.errorWithData(res, "server error", data);
        }
    },

    insert : async (req, res, next) => {
        try {
            var newType = new serviceType({
                type_name: req.body.type_name
            });
            await newType.save().then( (data) => {
                return apiResponses.successWithData(res, "new service type successfully inserted", data);
            });
        } catch (error) {
            return apiResponses.errorWithData(res, "server error", error);
        }
    },


    delete : async (req, res, next) => {
        try {
            await serviceType.findByIdAndDelete(req.params.type_id).then( () => {
                return apiResponses.success(res, "service type successfully deleted");
            })
        } catch (error) {
            return apiResponses.errorWithData(res, "server error", error);
        }
    }

}

module.exports = serviceTypeController