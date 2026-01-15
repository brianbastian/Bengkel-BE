const mechanic = require('../models/mechanic');
const moment = require('moment-timezone');
const apiResponses = require('../helpers/apiResponses');

const mechanicController = {
    getAll : async (req, res, next) => {
        try {
            var mechanicList = await mechanic.find().select(' -__v -created_at ').sort({ updated_at: 1 });
            if (mechanicList.length == 0) return apiResponses.dataNotFound(res, "no mechanic found");
            return apiResponses.successWithData(res, "Data retrieved", mechanicList);
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    getSpecific : async (req, res, next) => {
        try {
            var mechanicData = await mechanic.findById( req.params.mechanic_id ).select(' -__v -created_at ');
            if (!mechanicData) return apiResponses.dataNotFound(res, `no mechanic with id : ${req.params.id} found`);
            return apiResponses.successWithData(res, "Data retrieved", mechanicData); 
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    insert: async (req, res, next) => {
        try {
            var newMechanic = new mechanic({
                mechanic_name : req.body.mechanic_name,
                phone : req.body.phone,
                bonus : req.body.bonus
            });
            await newMechanic.save().then((data) => {
                return apiResponses.successWithData(res, "New mechanic data successfully inserted", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    update: async (req, res, next) => {
        try {
            await mechanic.findOneAndUpdate({ _id : req.params.mechanic_id }, { mechanic_name : req.body.mechanic_name, phone: req.body.phone, updated_at : moment() }, {new : true}).then( (data) => {
                if (data) return apiResponses.successWithData(res, "Mechanic data successfully updated", data);
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    delete: async (req, res, next) => {
        try {
            await mechanic.findByIdAndDelete( req.params.mechanic_id ).then( () => {
                return apiResponses.success(res, "Mechanic data successfully deleted");
            })
        } catch (error) {
            return apiResponses.error(res, "server error");
        }
    },

    bonus: async (req, res, next) => {
        try {
            // get day
            var day = moment(req.body.date).format("dddd");
            day = day.toLowerCase();
            // save bonus
            for (let i = 0; i < req.body.mechanics.length; i++) {
                var mechanicData = await mechanic.findById(req.body.mechanics[i].mechanic_id);
                // console.log(mechanicData);
                if (day == "monday") {
                    await mechanic.findOneAndUpdate({ _id : req.body.mechanics[i].mechanic_id }, { 
                        bonus: {
                            monday: {
                                date: req.body.date, total: mechanicData.bonus.monday.total + req.body.mechanics[i].bonus
                            },
                            tuesday: {
                                date: mechanicData.bonus.tuesday.date, total: mechanicData.bonus.tuesday.total
                            },
                            wednesday: {
                                date: mechanicData.bonus.wednesday.date, total: mechanicData.bonus.wednesday.total
                            },
                            thursday: {
                                date: mechanicData.bonus.thursday.date, total: mechanicData.bonus.thursday.total
                            },
                            friday: {
                                date: mechanicData.bonus.friday.date, total: mechanicData.bonus.friday.total
                            },
                            saturday: {
                                date: mechanicData.bonus.saturday.date, total: mechanicData.bonus.saturday.total 
                            }
                        }
                    });
                } else if (day == "tuesday") {
                    await mechanic.findOneAndUpdate({ _id : req.body.mechanics[i].mechanic_id }, { 
                        bonus: {
                            monday: {
                                date: mechanicData.bonus.monday.date, total: mechanicData.bonus.monday.total
                            },
                            tuesday: {
                                date: req.body.date, total: mechanicData.bonus.tuesday.total + req.body.mechanics[i].bonus
                            },
                            wednesday: {
                                date: mechanicData.bonus.wednesday.date, total: mechanicData.bonus.wednesday.total
                            },
                            thursday: {
                                date: mechanicData.bonus.thursday.date, total: mechanicData.bonus.thursday.total
                            },
                            friday: {
                                date: mechanicData.bonus.friday.date, total: mechanicData.bonus.friday.total
                            },
                            saturday: {
                                date: mechanicData.bonus.saturday.date, total: mechanicData.bonus.saturday.total 
                            }
                        }
                    });
                } else if (day == "wednesday") {
                    await mechanic.findOneAndUpdate({ _id : req.body.mechanics[i].mechanic_id }, { 
                        bonus: {
                            monday: {
                                date: mechanicData.bonus.monday.date, total: mechanicData.bonus.monday.total
                            },
                            tuesday: {
                                date: mechanicData.bonus.tuesday.date, total: mechanicData.bonus.tuesday.total
                            },
                            wednesday: {
                                date: req.body.date, total: mechanicData.bonus.wednesday.total + req.body.mechanics[i].bonus
                            },
                            thursday: {
                                date: mechanicData.bonus.thursday.date, total: mechanicData.bonus.thursday.total
                            },
                            friday: {
                                date: mechanicData.bonus.friday.date, total: mechanicData.bonus.friday.total
                            },
                            saturday: {
                                date: mechanicData.bonus.saturday.date, total: mechanicData.bonus.saturday.total 
                            }
                        }
                    });
                } else if (day == "thursday") {
                    await mechanic.findOneAndUpdate({ _id : req.body.mechanics[i].mechanic_id }, { 
                        bonus: {
                            monday: {
                                date: mechanicData.bonus.monday.date, total: mechanicData.bonus.monday.total
                            },
                            tuesday: {
                                date: mechanicData.bonus.tuesday.date, total: mechanicData.bonus.tuesday.total
                            },
                            wednesday: {
                                date: mechanicData.bonus.wednesday.date, total: mechanicData.bonus.wednesday.total
                            },
                            thursday: {
                                date: req.body.date, total: mechanicData.bonus.thursday.total + req.body.mechanics[i].bonus
                            },
                            friday: {
                                date: mechanicData.bonus.friday.date, total: mechanicData.bonus.friday.total
                            },
                            saturday: {
                                date: mechanicData.bonus.saturday.date, total: mechanicData.bonus.saturday.total 
                            }
                        }
                    });
                } else if (day == "friday") {
                    await mechanic.findOneAndUpdate({ _id : req.body.mechanics[i].mechanic_id }, { 
                        bonus: {
                            monday: {
                                date: mechanicData.bonus.monday.date, total: mechanicData.bonus.monday.total
                            },
                            tuesday: {
                                date: mechanicData.bonus.tuesday.date, total: mechanicData.bonus.tuesday.total
                            },
                            wednesday: {
                                date: mechanicData.bonus.wednesday.date, total: mechanicData.bonus.wednesday.total
                            },
                            thursday: {
                                date: mechanicData.bonus.thursday.date, total: mechanicData.bonus.thursday.total
                            },
                            friday: {
                                date: req.body.date, total: mechanicData.bonus.friday.total + req.body.mechanics[i].bonus
                            },
                            saturday: {
                                date: mechanicData.bonus.saturday.date, total: mechanicData.bonus.saturday.total 
                            }
                        }
                    });
                } else if (day == "saturday") {
                    await mechanic.findOneAndUpdate({ _id : req.body.mechanics[i].mechanic_id }, { 
                        bonus: {
                            monday: {
                                date: mechanicData.bonus.monday.date, total: mechanicData.bonus.monday.total
                            },
                            tuesday: {
                                date: mechanicData.bonus.tuesday.date, total: mechanicData.bonus.tuesday.total
                            },
                            wednesday: {
                                date: mechanicData.bonus.wednesday.date, total: mechanicData.bonus.wednesday.total
                            },
                            thursday: {
                                date: mechanicData.bonus.thursday.date, total: mechanicData.bonus.thursday.total
                            },
                            friday: {
                                date: mechanicData.bonus.friday.date, total: mechanicData.bonus.friday.total
                            },
                            saturday: {
                                date: req.body.date, total: mechanicData.bonus.saturday.total + req.body.mechanics[i].bonus
                            }
                        }
                    });
                }
            }
            return apiResponses.success(res, "bonus successfully accumulated");
        } catch (error) {
            console.log(error);
            return apiResponses.error(res, "server error");
        }
    }

}

module.exports = mechanicController;