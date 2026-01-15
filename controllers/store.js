const store = require('../models/store');
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');

const storeController = {
    
    getAll: async (req, res, next) => {
        try {
            const listStore = await store.find().select(' -created_at -__v ').sort({ updated_at: 1 });
            if (!listStore.length) {
                return apiResponses.dataNotFound(res, "no store found.");
            } else {
                return apiResponses.successWithData(res, "data retrieved.", listStore);
            }
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific: async (req, res, next) => {
        try {
            const storeData = await store.findById(req.params.store_id).select(' -created_at -__v ');

            if (!storeData) return apiResponses.dataNotFound(res, "store id not found.");
            return apiResponses.successWithData(res, "data retrieved.", storeData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert: async (req, res, next) => {
        try {
            const newStore = new store({ ...req.body });
            await newStore.save().then((data) => {
                return apiResponses.successWithData(res, "store successfully inserted.", data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    update: async (req, res, next) => {
        try {
            await store.findOneAndUpdate({ _id: req.params.store_id }, { ...req.body, updated_at: moment() },
            { new: true }).then((data) => {
                return apiResponses.successWithData(res, "store data successfully updated.", data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            await store.findOneAndDelete({ _id: req.params.store_id }).then(() => {
                return apiResponses.success(res, "store data successfully deleted.");
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }
}

module.exports = storeController;