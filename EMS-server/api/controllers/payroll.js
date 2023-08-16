const mongoose = require('mongoose');
const Payroll = require('../model/Payroll');
const PayrollDetail = require('../model/PayrollDetails');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.payrollList = (req, res) => {
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

    Payroll
        .find({
            status: {
                $ne: CONSTANTS.STATUS.DELETED
            }
        }).exec().then(result => {
            var totalResult = result.length;
            Payroll
                .aggregate([{
                        $match: {
                            $and: [{
                                    $or: [{
                                        status: {
                                            $regex: '.*' + search_text + '.*'
                                        }
                                    }]
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
                            from: 'payrolldetails',
                            let: {
                                payrollId: "$_id"
                            },
                            pipeline: [{
                                    $match: {
                                        $expr: {
                                            $and: [{
                                                $eq: ["$payrollId", "$$payrollId"]
                                            }]
                                        }
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'companysalaries',
                                        let: {
                                            salaryId: "$salaryId"
                                        },
                                        pipeline: [{
                                            $match: {
                                                $expr: {
                                                    $and: [{
                                                        $eq: ["$_id", "$$salaryId"]
                                                    }]
                                                }
                                            },
                                        }],
                                        as: "CompanySalary"
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$CompanySalary',
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        salaryId: 1,
                                        salaryType: "$CompanySalary.salaryType",
                                        amount: 1,
                                        payAs: 1,
                                        payType: 1,
                                        createdAt: 1,
                                        updatedAt: 1,
                                    }
                                }
                            ],
                            as: 'PayrollDetails'
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            empId: 1,
                            month: 1,
                            year: 1,
                            totalWorkingDays: 1,
                            leave: 1,
                            basicSalary: 1,
                            allowance: 1,
                            deductions: 1,
                            netSalary: 1,
                            salaryList: "$PayrollDetails",
                            description: 1,
                            status: 1,
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }
                ])
                .exec()
                .then(payrollDetail => {

                    var data = {
                        recordsTotal: totalResult,
                        data: payrollDetail,
                    };
                    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Payroll List', data);
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

exports.addPayroll = async (req, res) => {
    let payroll = new Payroll({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        month: req.body.month,
        year: req.body.year,
        totalWorkingDays: req.body.totalWorkingDays,
        leave: req.body.leave,
        basicSalary: req.body.basicSalary,
        allowance: 0,
        deductions: 0,
        description: req.body.description,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime()
    });
    const salaryList = req.body.salaryList;

    //check post params not empty
    if (payroll.userId && payroll.month && payroll.year && payroll.totalWorkingDays && payroll.leave && payroll.basicSalary && salaryList) {

        //check if payroll exists for this month and year
        Payroll
            .find({
                month: payroll.month,
                year: payroll.year,
                userId: payroll.userId,
                status: {
                    $ne: CONSTANTS.STATUS.DELETED
                }
            })
            .exec()
            .then( async (payrollOldData) => {
                if (payrollOldData.length < 10) {
                    var payrollData;
                    const session = await mongoose.startSession();
                    session.startTransaction();
                    //generate payroll
                    try {
                        //first store payroll detail
                        salaryList.map(async (salary) => {
                            if (salary.payType == 'payment') {
                                if (salary.payAs == 'fixed') {
                                    payroll.allowance += salary.amount;
                                } else {
                                    payroll.allowance += (payroll.basicSalary * salary.amount) / 100;
                                }
                            } else {
                                if (salary.payAs == 'fixed') {
                                    payroll.deductions += salary.amount;
                                } else {
                                    payroll.deductions += (payroll.basicSalary * salary.amount) / 100;
                                }
                            }

                            let payrollDetail = new PayrollDetail({
                                _id: new mongoose.Types.ObjectId(),
                                payrollId: payroll._id,
                                salaryId: salary.salaryId,
                                amount: salary.amount,
                                payAs: salary.payAs,
                                payType: salary.payType,
                                status: CONSTANTS.STATUS.ACTIVE,
                                createdAt: utils.currentDatetime()
                            });

                            await payrollDetail.save({session});
                        });

                        //store payroll
                        payroll.netSalary = payroll.basicSalary + payroll.allowance - payroll.deductions;
                        payrollData = await payroll.save({session});

                        await session.commitTransaction();
                    } catch (e) {
                        await session.abortTransaction();
                        session.endSession();
                        console.log(e);
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, "Something went wrong", []);
                    } finally {
                        session.endSession();
                        var message = 'Payroll Added Successfully!';
                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_PAYROLL, CONSTANTS.OPERATION_TYPE.CREATE, message, payroll._id, null, payrollData);
                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                    }
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Payroll already exists for this month-year.', []);
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

exports.editPayroll = (req, res) => {

    let payroll = new Payroll({
        _id: req.body._id,
        userId: req.body.userId,
        month: req.body.month,
        year: req.body.year,
        totalWorkingDays: req.body.totalWorkingDays,
        leave: req.body.leave,
        basicSalary: req.body.basicSalary,
        allowance: 0,
        deductions: 0,
        description: req.body.description,
        status: CONSTANTS.STATUS.ACTIVE,
        updatedAt: utils.currentDatetime()
    });
    const salaryList = req.body.salaryList;

    //check post params not empty
    if (payroll._id && payroll.userId && payroll.month && payroll.year && payroll.totalWorkingDays && payroll.leave && payroll.basicSalary && salaryList) {

        // check master payroll already exists or not
        Payroll
            .find({
                _id: req.body._id,
                status: {
                    $ne: CONSTANTS.STATUS.DELETED
                }
            })
            .exec()
            .then(async (payrollOldData) => {

                if (payrollOldData.length > 0) {

                    var payrollData;
                    const session = await mongoose.startSession();
                    session.startTransaction();
                    //generate payroll
                    try {
                        //first store payroll detail
                        salaryList.map(async (salary) => {
                            if (salary.payType == 'payment') {
                                if (salary.payAs == 'fixed') {
                                    payroll.allowance += salary.amount;
                                } else {
                                    payroll.allowance += (payroll.basicSalary * salary.amount) / 100;
                                }
                            } else {
                                if (salary.payAs == 'fixed') {
                                    payroll.deductions += salary.amount;
                                } else {
                                    payroll.deductions += (payroll.basicSalary * salary.amount) / 100;
                                }
                            }

                            let payrollDetail = new PayrollDetail({
                                payrollId: payroll._id,
                                salaryId: salary.salaryId,
                                amount: salary.amount,
                                payAs: salary.payAs,
                                payType: salary.payType,
                                status: CONSTANTS.STATUS.ACTIVE
                            });
                            if (salary._id) {
                                payrollDetail._id = salary._id;
                                payrollDetail.updatedAt = utils.currentDatetime();
                            } else {
                                payrollDetail._id = new mongoose.Types.ObjectId();
                                payrollDetail.createdAt = utils.currentDatetime();
                            }
                            await PayrollDetail.updateOne({
                                _id: payrollDetail._id
                            }, payrollDetail, {
                                session,
                                upsert: true
                            }).exec();
                        });

                        //store payroll
                        payroll.netSalary = payroll.basicSalary + payroll.allowance - payroll.deductions;
                        payrollData = await Payroll.findOneAndUpdate({
                            _id: payroll._id
                        }, payroll, {
                            session,
                            upsert: true,
                            new: true
                        }).exec();

                        await session.commitTransaction();
                    }catch (e) {
                        await session.abortTransaction();
                        session.endSession();
                        console.log(e);
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, "Something went wrong", []);
                    } finally {
                        session.endSession();
                        var message = 'Payroll Updated Successfully!';
                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_PAYROLL, CONSTANTS.OPERATION_TYPE.UPDATE, message, payroll._id, payrollOldData[0], payrollData);
                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                    }
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Payroll Does Not Exists.', []);
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

exports.deletePayroll = (req, res) => {

    if (req.body._id) {
        Payroll.find({
                _id: req.body._id,
                status: {
                    $ne: CONSTANTS.STATUS.DELETED
                }
            })
            .exec()
            .then(payrollOldData => {
                if (payrollOldData.length > 0) {

                    Payroll.findOneAndUpdate({
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
                            var message = 'Payroll Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_PAYROLL, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, payrollOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Payroll Does not exists', []);
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