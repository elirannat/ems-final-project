const mongoose = require('mongoose');
const MasterLeave = require('../model/MasterLeave');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.masterLeaveList = (req, res) => {

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

    MasterLeave.find().exec().then(result => {
        var totalResult = result.length;
        MasterLeave
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            leaveType: {
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
                    leaveType: 1,
                    addAsDefault: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(masterLeave => {

                var data = {
                    recordsTotal: totalResult,
                    data: masterLeave,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Master Leave List', data);
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

exports.addMasterLeave = (req, res) => {

    const masterLeave = new MasterLeave({
        _id: new mongoose.Types.ObjectId(),
        leaveType: req.body.leaveType,
        addAsDefault: req.body.addAsDefault,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime()
    });

    //check post params not empty
    if (masterLeave.leaveType && masterLeave.addAsDefault) {

        // //check master leave already exists or not
        MasterLeave
            .find({
                leaveType: masterLeave.leaveType
            })
            .exec()
            .then(ml => {

                if (ml.length < 1) {

                    masterLeave.save()
                        .then(result => {
                            var message = 'Master Leave `' + masterLeave.leaveType + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_MASTER_LEAVE, CONSTANTS.OPERATION_TYPE.CREATE, message, masterLeave._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, result);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Leave Add Failed', [err]);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Leave Already Exists.', []);
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

exports.editMasterLeave = (req, res) => {

    const masterLeave = new MasterLeave({
        _id: req.body._id,
        leaveType: req.body.leaveType,
        addAsDefault: req.body.addAsDefault,
        status: req.body.status,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (masterLeave.leaveType && masterLeave._id) {

        // //check master leave already exists or not
        MasterLeave
            .find({
                _id: masterLeave._id
            })
            .exec()
            .then(ml => {

                if (ml.length > 0) {
                    MasterLeave.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: masterLeave
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Master Leave `' + masterLeave.leaveType + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_MASTER_LEAVE, CONSTANTS.OPERATION_TYPE.UPDATE, message, masterLeave._id, ml[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Leave Does Not Exists.', []);
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

// exports.deleteMasterLeave = (req, res) => {

//     if (req.body._id) {
//         MasterLeave.find({
//             _id: req.body._id
//         })
//             .exec()
//             .then(masterLeaveOldData => {
//                 if (masterLeaveOldData.length > 0) {

//                     MasterLeave.findOneAndUpdate({
//                         _id: req.body._id
//                     }, {
//                         $set: {
//                             status: CONSTANTS.STATUS.DELETED
//                         }
//                     }, {
//                         new: true
//                     })
//                         .exec()
//                         .then(result => {
//                             var message = 'Master Leave `' + masterLeaveOldData[0].leaveType + '` Deleted Successfully!';
//                             Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_MASTER_LEAVE, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, masterLeaveOldData[0], result);
//                             return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
//                         })
//                         .catch(err => {
//                             console.log(err);
//                             return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
//                         });
//                 } else {
//                     return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Leave Does not exists', []);
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//                 return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
//             });
//     } else {
//         return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
//     }
// }
exports.deleteMasterLeave = (req, res) => {

    if (req.body._id) {
        MasterLeave.findOneAndDelete({
            _id: req.body._id
        })
            .exec()
            .then(masterLeaveData => {
                if (masterLeaveData) {
                    var message = 'Master Leave `' + masterLeaveData.leaveType + '` Deleted Successfully!';
                    Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_MASTER_LEAVE, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, {}, masterLeaveData);
                    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Master Leave Does not exists', []);
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
