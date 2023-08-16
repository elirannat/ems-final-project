const mongoose = require('mongoose');
const Appraisal = require('../model/Appraisal');
const User = require('../model/Users');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');
const AppraisalService = require('../service/appraisal');

exports.appraisalList = async (req, res) => {

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

    AppraisalService.getAll().then(result => {
        var totalResult = result.length;
        Appraisal
            .aggregate([{
                    $match: {
                        $and: [{
                                $or: [{
                                        newSalary: {
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
                        userId: 1,
                        companyId: 1,
                        firstName: 1,
                        lastName: 1,
                        companyId: 1,
                        dayFrom: 1,
                        dayTo: 1,
                        percentage: 1,
                        previousSalary: 1,
                        newSalary: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ])
            .exec()
            .then(appraisal => {

                var data = {
                    recordsTotal: totalResult,
                    data: appraisal,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Appraisal List', data);
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

exports.addAppraisal = (req, res) => {

    let appraisal = new Appraisal({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        companyId: req.body.companyId,
        dayFrom: req.body.dayFrom,
        dayTo: req.body.dayTo,
        percentage: req.body.percentage,
        previousSalary: req.body.previousSalary,
        newSalary: req.body.newSalary,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime()
    });

    //data validation
    if (appraisal.lastName && appraisal.firstName && appraisal.userId && appraisal.dayFrom && appraisal.dayTo && appraisal.percentage) {
        //user exists or not
        User.find({
                _id: appraisal.userId,
                status: {
                    $ne: CONSTANTS.STATUS.DELETED
                }
            })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    //calculate new salary
                    appraisal.previousSalary = user[0].basicSalary;
                    var salaryIncrement = appraisal.percentage * appraisal.previousSalary / 100;
                    appraisal.newSalary = appraisal.previousSalary + salaryIncrement;
                    //check appraisal exists or not
                    Appraisal.find({
                            userId: appraisal.userId,
                            dayFrom: appraisal.dayFrom,
                            dayTo: appraisal.dayTo
                        })
                        .exec()
                        .then(result => {
                            if (result.length < 1) {
                                appraisal.save()
                                    .then(result => {

                                        var message = 'Appraisal Created Successfully!';
                                        var message = 'Appraisal For`' + appraisal.firstName + '` Created Successfully!';

                                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_APPRAISAL, CONSTANTS.OPERATION_TYPE.CREATE, message, appraisal._id, null, result);
                                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                                    });
                            } else {
                                console.log(result);
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Appraisal Already Exists.', []);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does Not Exists.', []);
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

exports.editAppraisal = (req, res) => {

    const appraisal = new Appraisal({
        _id: req.body._id,
        userId: req.body.userId,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        companyId: req.body.companyId,
        dayFrom: req.body.dayFrom,
        dayTo: req.body.dayTo,
        percentage: req.body.percentage,
        previousSalary: req.body.previousSalary,
        newSalary: req.body.newSalary,
        percentage: req.body.percentage,
        status: CONSTANTS.STATUS.ACTIVE,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (appraisal.userId && appraisal.dayFrom && appraisal.dayTo && appraisal.percentage) {

        //user exists or not
        User.find({
                _id: appraisal.userId
            })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    //calculate new salary
                    appraisal.previousSalary = user[0].basicSalary;
                    var salaryIncrement = appraisal.percentage * appraisal.previousSalary / 100;
                    appraisal.newSalary = appraisal.previousSalary + salaryIncrement;
                    Appraisal
                        .find({
                            _id: appraisal._id
                        })
                        .exec()
                        .then(appraisalOldData => {

                            if (appraisalOldData.length > 0) {
                                Appraisal.findOneAndUpdate({
                                        _id: req.body._id
                                    }, {
                                        $set: appraisal
                                    }, {
                                        new: true
                                    })
                                    .exec()
                                    .then(result => {
                                        var message = 'Appraisal Updated Successfully!';
                                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_APPRAISAL, CONSTANTS.OPERATION_TYPE.UPDATE, message, appraisal._id, appraisalOldData[0], result);
                                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                                    });
                            } else {
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Appraisal Does Not Exists.', []);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does Not Exists.', []);
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

exports.deleteAppraisal = (req, res) => {

    if (req.body._id) {
        Appraisal.find({
                _id: req.body._id
            })
            .exec()
            .then(appraisalOldData => {
                if (appraisalOldData.length > 0) {

                    Appraisal.findOneAndUpdate({
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
                            var message = 'Appraisal `' + appraisalOldData[0]._id + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_APPRAISAL, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, appraisalOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Appraisal Does not exists', []);
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