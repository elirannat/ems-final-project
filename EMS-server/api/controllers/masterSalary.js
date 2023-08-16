const mongoose = require('mongoose');
const MasterSalary = require('../model/MasterSalary');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.masterSalaryList = (req, res) => {
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

    MasterSalary.find().exec().then(result => {
        var totalResult = result.length;
        MasterSalary
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            salaryType: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            addAsDefault: {
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
                    salaryType: 1,
                    addAsDefault: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(masterSalary => {

                var data = {
                    recordsTotal: totalResult,
                    data: masterSalary,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Master Salary List', data);
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

exports.addMasterSalary = (req, res) => {

    const masterSalary = new MasterSalary({
        _id: new mongoose.Types.ObjectId(),
        salaryType: req.body.salaryType,
        addAsDefault: req.body.addAsDefault,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime()
    });

    //check post params not empty
    if (masterSalary.salaryType && masterSalary.addAsDefault) {

        // //check master salary already exists or not
        MasterSalary
            .find({
                salaryType: masterSalary.salaryType
            })
            .exec()
            .then(ms => {

                if (ms.length < 1) {

                    masterSalary.save()
                        .then(result => {
                            var message = 'Master Salary `' + masterSalary.salaryType + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_MASTER_SALARY, CONSTANTS.OPERATION_TYPE.CREATE, message, masterSalary._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, result);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Salary Add Failed', [err]);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Salary Already Exists.', []);
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

exports.editMasterSalary = (req, res) => {

    const masterSalary = new MasterSalary({
        _id: req.body._id,
        salaryType: req.body.salaryType,
        addAsDefault: req.body.addAsDefault,
        status: req.body.status,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (masterSalary.salaryType && masterSalary._id) {

        // //check master salary already exists or not
        MasterSalary
            .find({
                _id: masterSalary._id
            })
            .exec()
            .then(ms => {

                if (ms.length > 0) {
                    MasterSalary.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: masterSalary
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Master Salary `' + masterSalary.salaryType + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_MASTER_SALARY, CONSTANTS.OPERATION_TYPE.UPDATE, message, masterSalary._id, ms[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Salary Does Not Exists.', []);
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

exports.deleteMasterSalary = (req, res) => {

    if (req.body._id) {
        MasterSalary.find({
            _id: req.body._id
        })
            .exec()
            .then(masterSalaryOldData => {
                if (masterSalaryOldData.length > 0) {

                    MasterSalary.findOneAndUpdate({
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
                            var message = 'Master Salary `' + masterSalaryOldData[0].salaryType + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_MASTER_SALARY, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, masterSalaryOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Salary Does not exists', []);
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