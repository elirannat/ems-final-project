const mongoose = require('mongoose');
const Company = require('../model/Company');
const Holiday = require('../model/Holiday');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.holidayList = (req, res) => {

    const direc = {
        asc: 1,
        desc: -1
    }
    const order_dir = direc[req.body.order_dir] || 1;
    const order_column = req.body.order_column || '_id';
    const start = req.body.start || 0;
    const length = req.body.length || 10;
    const search_text = req.body.search_text || '';
    let sort = {};
    sort[order_column] = order_dir;

    //optional parameter( get result by id)
    let optionalQuery = {
        "_id": {
            $ne: null
        }
    };
    if (req.body._id) {
        optionalQuery._id = mongoose.Types.ObjectId(req.body._id);
    }
    if (req.body.companyId) {
        optionalQuery.companyId = mongoose.Types.ObjectId(req.body.companyId);
    }

    Holiday.find().exec().then(result => {
        var totalResult = result.length;
        Holiday
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            holidayName: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            status: {
                                $regex: '.*' + search_text + '.*'
                            }
                        }
                        ]
                    },
                        optionalQuery,
                    {
                        status: {
                            $ne: CONSTANTS.STATUS.DELETED
                        }
                    }
                    ]
                },
            },
            {
                $sort: sort
            },
            {
                $skip: start
            },
            {
                $limit: length
            },
            {
                $project: {
                    _id: 1,
                    holidayName: 1,
                    dateFrom: 1,
                    dateTo: 1,
                    companyId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(holiday => {

                var data = {
                    recordsTotal: totalResult,
                    data: holiday,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Holiday List', data);
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', [err]);
            });
    }).catch(err => {
        console.log(err);
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
    });
};

exports.addHoliday = (req, res) => {

    const holiday = new Holiday({
        _id: new mongoose.Types.ObjectId(),
        holidayName: req.body.holidayName,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime(),
        companyId: req.body.companyId,
    });

    console.log("Step 1: Created Holiday object");

    if (holiday.holidayName && holiday.companyId && holiday.dateFrom && holiday.dateTo) {
        console.log("Step 2: Data validation passed");

        Company.find({
            _id: holiday.companyId
        })
        .exec()
        .then(company => {
            console.log("Step 3: Company query executed");

            if (company.length < 1) {
                console.log("Step 4: Company exists");

                Holiday.find({
                    holidayName: holiday.holidayName,
                    companyId: holiday.companyId
                })
                .exec()
                .then(result => {
                    console.log("Step 5: Holiday query executed");

                    if (result.length < 1) {
                        console.log("Step 6: Holiday doesn't exist");

                        holiday.save()
                        .then(result => {
                            console.log("Step 7: Holiday saved successfully");

                            var message = 'Holiday `' + holiday.holidayName + '` Created Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_HOLIDAY, CONSTANTS.OPERATION_TYPE.CREATE, message, holiday._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log("Step 7: Error while saving holiday:", err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                    } else {
                        console.log("Step 6: Holiday already exists");
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Holiday Already Exists.', []);
                    }
                })
                .catch(err => {
                    console.log("Step 5: Error while querying existing holiday:", err);
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                });
            } else {
                console.log("Step 4: Company does not exist");
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Does Not Exists.', []);
            }
        })
        .catch(err => {
            console.log("Step 3: Error while querying company:", err);
            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
        });
    } else {
        console.log("Step 2: Invalid post parameter");
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }
}


exports.editHoliday = (req, res) => {

    const holiday = new Holiday({
        _id: req.body._id,
        holidayName: req.body.holidayName,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        status: CONSTANTS.STATUS.ACTIVE,
        updatedAt: utils.currentDatetime(),
        companyId: req.body.companyId
    });

    //check post params not empty
    if (holiday.holidayName && holiday._id && holiday.companyId && holiday.dateFrom && holiday.dateTo) {

        //companyId exists or not
        Company.find({
            _id: holiday.companyId
        })
            .exec()
            .then(company => {
                if (company.length > 0) {
                    // //check holiday already exists or not
                    Holiday
                        .find({
                            _id: holiday._id
                        })
                        .exec()
                        .then(holidayOldData => {

                            if (holidayOldData.length > 0) {
                                Holiday.findOneAndUpdate({
                                    _id: req.body._id
                                }, {
                                    $set: holiday
                                }, {
                                    new: true
                                })
                                    .exec()
                                    .then(result => {
                                        var message = 'Holiday `' + holiday.holidayName + '` Updated Successfully!';
                                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_HOLIDAY, CONSTANTS.OPERATION_TYPE.UPDATE, message, holiday._id, holidayOldData[0], result);
                                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                                    });
                            } else {
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Holiday Does Not Exists.', []);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Does Not Exists.', []);
                }

            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
            });
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }
}

exports.deleteHoliday = (req, res) => {

    if (req.body._id) {
        Holiday.find({
            _id: req.body._id
        })
            .exec()
            .then(holidayOldData => {
                if (holidayOldData.length > 0) {

                    Holiday.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: {
                            status: CONSTANTS.STATUS.DELETED
                        }
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Holiday `' + holidayOldData[0].holidayName + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_HOLIDAY, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, holidayOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Holiday Does not exists', []);
                }
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
            });
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }
}