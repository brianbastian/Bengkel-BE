const Members = require('../models/member');
const apiResponses = require('../helpers/apiResponses');
const moment = require('moment-timezone');

const MemberController = {

    getAll: async (req, res, next) => {
        try {
            const memberList = await Members.find().select(' -__v -created_at ').sort({ updated_at: 1 });
            if (!memberList.length) {
                return apiResponses.dataNotFound(res, 'no member found');
            }
            return apiResponses.successWithData(res, "data retrieved.", memberList);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific: async (req, res, next) => {
        try {
            const memberData = await Members.findById(req.params.member_id).select(" -__v -created_at ");
            if (!memberData) {
                return apiResponses.dataNotFound(res, 'member id not found');
            }
            return apiResponses.successWithData(res, 'data retrieved', memberData);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert: async (req, res, next) => {
        try {
            const newMember = new Members({ ...req.body });
            await newMember.save().then( (data) => {
                return apiResponses.successWithData(res, 'new member successfully inserted', data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    update: async (req, res, next) => {
        try {
            await Members.findOneAndUpdate({ _id: req.params.member_id }, { ...req.body, updated_at: moment() }).then((data) => {
                return apiResponses.successWithData(res, "member successfully updated", data);
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            await Members.findByIdAndDelete( req.params.member_id ).then( () => {
                return apiResponses.success(res, "member successfully deleted");
            });
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    }
}

module.exports = MemberController;