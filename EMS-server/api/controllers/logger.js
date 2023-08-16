const mongoose = require('mongoose');
const Log = require('../model/Log');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');

exports.logList = (req, res) => {

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
    if (req.body.userId) {
        optionalQuery.userId = mongoose.Types.ObjectId(req.body.userId);
    }

    Log.find().exec().then(result => {
        var totalResult = result.length;
        Log
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            logLevel: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            module: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            operationType: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            message: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            oldData: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            newData: {
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
                    as: 'user'
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    userName: {
                        $concat: ["$user.firstName", " ", "$user.lastName"]
                    },
                    logLevel: 1,
                    module: 1,
                    operationType: 1,
                    message: 1,
                    moduleId: 1,
                    oldData: 1,
                    newData: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(log => {

                var data = {
                    recordsTotal: totalResult,
                    data: log,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Log List', data);
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

exports.addLog = (userId, logLevel, module, operationType, message, moduleId, oldData, newData) => {

    const log = new Log({
        _id: new mongoose.Types.ObjectId(),
        userId: userId,
        logLevel: logLevel,
        module: module,
        operationType: operationType,
        message: message,
        moduleId: moduleId,
        oldData: oldData,
        newData: newData,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime()
    });
    log.save()
        .then(result => {
            return result;
        })
        .catch(err => {
            console.log(err);
            console.log('Saving log failed');
        });
}