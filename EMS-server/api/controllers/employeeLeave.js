const mongoose = require('mongoose');
const User = require('../model/Users');
const EmployeeLeave = require('../model/EmployeeLeave');
const CompanyLeave = require('../model/CompanyLeave');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.employeeLeaveHistory = (req, res) => {

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
    if (req.body.leaveId) {
        optionalQuery.leaveId = mongoose.Types.ObjectId(req.body.leaveId);
    }
    if (req.body.userId) {
        optionalQuery.userId = mongoose.Types.ObjectId(req.body.userId);
    }
    if (req.body.companyId) {
        optionalQuery["CompanyLeave.companyId"] = mongoose.Types.ObjectId(req.body.companyId);
    }

    console.log(optionalQuery);
    EmployeeLeave.find().exec().then(result => {
        var totalResult = result.length;
        EmployeeLeave
            .aggregate([{
                    $addFields: {
                        noOfLeaveString: {
                            $toString: {
                                $toLong: "$noOfLeave"
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "companyleaves",
                        let: {
                            empLeaveId: "$leaveId"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                            $eq: ["$_id", "$$empLeaveId"]
                                        }
                                    ]
                                }
                            }
                        }, ],
                        as: "CompanyLeave",
                    }
                },
                {
                    $unwind: {
                        path: '$CompanyLeave',
                        preserveNullAndEmptyArrays: false,
                    },
                },
                {
                    $match: {
                        $and: [{
                                $or: [{
                                        reason: {
                                            $regex: '.*' + search_text + '.*'
                                        }
                                    },
                                    {
                                        noOfLeaveString: {
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
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'User'
                    },
                },
                {
                    $unwind: {
                        path: '$User',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        leaveId: 1,
                        leaveType: "$CompanyLeave.leaveType",
                        userId: 1,
                        userFirstName: "$User.firstName",
                        userlastName: "$User.lastName",
                        dateFrom: 1,
                        dateTo: 1,
                        noOfLeave: 1,
                        reason: 1,
                        status: 1,
                        approvedRejectedBy: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ])
            .exec()
            .then(employeeLeave => {

                var data = {
                    recordsTotal: totalResult,
                    data: employeeLeave,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Employee Leave List', data);
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

exports.requestLeave = (req, res) => {

    const employeeLeave = new EmployeeLeave({
        _id: new mongoose.Types.ObjectId(),
        leaveId: req.body.leaveId,
        userId: req.body.userId,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        approvedRejectedBy: req.body.approvedRejectedBy, // add approvedRejectedBy field
        status: CONSTANTS.STATUS.ACTIVE,
        reason: req.body.reason,
        createdAt: utils.currentDatetime()
    });

    //check post params not empty
    if (employeeLeave.leaveId && employeeLeave.userId && employeeLeave.dateFrom && employeeLeave.dateTo) {
        employeeLeave.noOfLeave = utils.dayDifference(employeeLeave.dateFrom, employeeLeave.dateTo);
        //is user exist
        User.find({
                _id: employeeLeave.userId
            })
            .exec()
            .then(user => {
                if (user.length > 0 && user[0].companyId) {
                    //is leave type exists for company
                    CompanyLeave.find({
                            _id: employeeLeave.leaveId,
                            companyId: user[0].companyId
                        })
                        .exec()
                        .then(leave => {
                            if (leave.length > 0) {
                                employeeLeave.save()
                                    .then(result => {
                                        var message = 'Leave Request `' + employeeLeave.leaveId + '` Created Successfully!';

                                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.REQUEST_LEAVE, CONSTANTS.OPERATION_TYPE.CREATE, message, employeeLeave._id, null, result);
                                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                                    });
                            } else {
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Leave type does not exists', []);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User does not exists', []);
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

exports.editRequestLeave = (req, res) => {

    const employeeLeave = new EmployeeLeave({
        _id: req.body._id,
        leaveId: req.body.leaveId,
        userId: req.body.userId,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        reason: req.body.reason,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (employeeLeave._id && employeeLeave.leaveId && employeeLeave.userId && employeeLeave.dateFrom && employeeLeave.dateTo) {
        employeeLeave.noOfLeave = utils.dayDifference(employeeLeave.dateFrom, employeeLeave.dateTo);
        //requested leave exists or not
        EmployeeLeave.find({
                _id: employeeLeave._id
            })
            .exec()
            .then(el => {
                if (el.length > 0) {

                    //check if leave approved or not
                    if (el[0].status !== CONSTANTS.STATUS.APPROVED && el[0].status !== CONSTANTS.STATUS.REJECTED) {

                        //Edit Leave Request
                        EmployeeLeave.findOneAndUpdate({
                                _id: req.body._id
                            }, {
                                $set: employeeLeave
                            }, {
                                new: true
                            })
                            .exec()
                            .then(result => {
                                var message = 'Leave Request `' + employeeLeave._id + '` Updated Successfully!';
                                Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_REQUEST_LEAVE, CONSTANTS.OPERATION_TYPE.UPDATE, message, employeeLeave._id, el[0], result);
                                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                            })
                            .catch(err => {
                                console.log(err);
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                            });
                    } else {
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Leave Request already '+el[0].status+'. You can not edit this leave request.', []);
                    }
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Leave Request does not exists', []);
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

exports.deleteRequestLeave = (req, res) => {

    //check post params not empty
    if (req.body._id) {

        EmployeeLeave.find({
                _id: req.body._id
            })
            .exec()
            .then(leave => {
                if (leave.length > 0) {
                    if (leave[0].status !== CONSTANTS.STATUS.APPROVED && leave[0].status !== CONSTANTS.STATUS.REJECTED) {

                        EmployeeLeave.findOneAndUpdate({
                                _id: req.body._id
                            }, {
                                $set: {
                                    status: CONSTANTS.STATUS.DELETED,
                                    updatedAt: utils.currentDatetime()
                                }
                            }, {
                                new: true
                            })
                            .exec()
                            .then(result => {
                                var message = 'Request Leave `' + leave[0]._id + '` Deleted Successfully!';
                                Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_REQUEST_LEAVE, CONSTANTS.OPERATION_TYPE.DELETE, message, leave[0]._id, leave[0], result);
                                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                            })
                            .catch(err => {
                                console.log(err);
                                console.log(err);
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                            });
                    } else {
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Leave Request already '+leave[0].status+'. You can not delete it.', []);
                    }
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Leave Request not found with this _id', []);
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

exports.userLeave = (req, res) => {

    //check post params not empty
    if (req.body._id) {
        User.find({
                _id: req.body._id
            })
            .exec()
            .then(user => {
                if (user.length > 0 && user[0].companyId) {
                    //get all leave of employee
                    User
                        .aggregate([{
                                $match: {
                                    _id: mongoose.Types.ObjectId(req.body._id),
                                    status: CONSTANTS.STATUS.ACTIVE
                                }
                            },
                            {
                                $lookup: {
                                    from: "companyleaves",
                                    localField: "companyId",
                                    foreignField: "companyId",
                                    as: "CompanyLeave"
                                }
                            },
                            {
                                $unwind: {
                                    path: "$CompanyLeave",
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: "employeeleaves",
                                    let: {
                                        empLeaveId: "$CompanyLeave._id"
                                    },
                                    pipeline: [{
                                        $match: {
                                            $expr: {
                                                $and: [{
                                                        $eq: ["$leaveId", "$$empLeaveId"]
                                                    },
                                                    {
                                                        $eq: ["$userId", mongoose.Types.ObjectId(req.body._id)]
                                                    },
                                                     { $eq: [ "$status",  CONSTANTS.STATUS.APPROVED ] },
                                                ]
                                            }
                                        }
                                    }, ],
                                    as: "EmployeeLeave",
                                }
                            },
                            {
                                $unwind: {
                                    path: "$EmployeeLeave",
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $group: {
                                    _id: "$CompanyLeave._id",
                                    leaveType: {
                                        $first: "$CompanyLeave.leaveType"
                                    },
                                    noOfLeave: {
                                        $first: "$CompanyLeave.noOfLeave"
                                    },
                                    usedLeave: {
                                        $sum: "$EmployeeLeave.noOfLeave"
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    leaveId: "$_id",
                                    leaveType: 1,
                                    noOfLeave: 1,
                                    usedLeave: 1
                                }
                            }
                        ])
                        .exec()
                        .then(leaveData => {
                            if (leaveData.length > 0) {
                                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Company Leave', leaveData);
                            } else {
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does not have leave.', []);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User does not exists', []);
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

exports.approveRejectLeaveRequest = (req, res) => {

    //check post params not empty
    if (req.body._id && req.body.status) {

        EmployeeLeave.find({
                _id: req.body._id
            })
            .exec()
            .then(leave => {
                if (leave.length > 0) {
                    EmployeeLeave.findOneAndUpdate({
                            _id: req.body._id
                        }, {
                            $set: {
                                status: req.body.status,
                                approvedRejectedBy: req.body.loggedUserId,
                                updatedAt: utils.currentDatetime()
                            }
                        }, {
                            new: true
                        })
                        .exec()
                        .then(result => {
                            var message = 'Leave Request Status Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.APPROVE_REJECT_LEAVE_REQUEST, CONSTANTS.OPERATION_TYPE.UPDATE, message, leave[0]._id, leave[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Leave Request not found with this _id', []);
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