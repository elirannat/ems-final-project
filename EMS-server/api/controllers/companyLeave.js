const mongoose = require('mongoose');
const CompanyLeave = require('../model/CompanyLeave');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.companyLeaveList = (req, res) => {

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
    if (req.body.masterLeaveId) {
        optionalQuery.masterLeaveId = mongoose.Types.ObjectId(req.body.masterLeaveId);
    }

    CompanyLeave.find().exec().then(result => {
        var totalResult = result.length;
        CompanyLeave
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
                $match: {
                    $and: [{
                        $or: [{
                            leaveType: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            leaveAlias: {
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
                $project: {
                    _id: 1,
                    leaveType: 1,
                    leaveAlias: 1,
                    noOfLeave: 1,
                    companyId: 1,
                    masterLeaveId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(companyLeave => {

                var data = {
                    recordsTotal: totalResult,
                    data: companyLeave,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Company Leave List', data);
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

exports.companyLeaveById = (req, res) => {

    var companyLeaveId = req.body._id;

    if (companyLeaveId) {
        CompanyLeave.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(companyLeaveId)
            },
        },
        {
            $project: {
                _id: 1,
                leaveType: 1,
                leaveAlias: 1,
                noOfLeave: 1,
                companyId: 1,
                masterLeaveId: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
        ])
            .exec()
            .then(result => {
                if (result.length > 0) {
                    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Company Leave Details', result[0]);
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Leave not found.', []);
                }
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong.', []);
            });
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }

};

exports.addCompanyLeave = (req, res) => {

    const companyLeave = new CompanyLeave({
        _id: new mongoose.Types.ObjectId(),
        leaveType: req.body.leaveType,
        leaveAlias: req.body.leaveAlias,
        noOfLeave: req.body.noOfLeave,
        companyId: req.body.companyId,
        status: CONSTANTS.STATUS.ACTIVE,
        masterLeaveId: req.body.masterLeaveId,
        createdAt: utils.currentDatetime()
    });

    //check post params not empty
    if (companyLeave.leaveType) {

        // //check master leave already exists or not
        CompanyLeave
            .find({
                leaveType: companyLeave.leaveType
            })
            .exec()
            .then(cl => {

                if (cl.length < 1) {

                    companyLeave.save()
                        .then(result => {
                            var message = 'Company Leave `' + companyLeave.leaveType + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_COMPANY_LEAVE, CONSTANTS.OPERATION_TYPE.CREATE, message, companyLeave._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Leave Add Failed', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Leave Already Exists.', []);
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

exports.editCompanyLeave = (req, res) => {

    const companyLeave = new CompanyLeave({
        _id: req.body._id,
        leaveType: req.body.leaveType,
        leaveAlias: req.body.leaveAlias,
        noOfLeave: req.body.noOfLeave,
        companyId: req.body.companyId,
        status: req.body.status,
        masterLeaveId: req.body.masterLeaveId,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (companyLeave.leaveType && companyLeave._id) {

        // //check company leave already exists or not
        CompanyLeave
            .find({
                _id: companyLeave._id
            })
            .exec()
            .then(cl => {

                if (cl.length > 0) {
                    CompanyLeave.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: companyLeave
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Company Leave `' + companyLeave.leaveType + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_COMPANY_LEAVE, CONSTANTS.OPERATION_TYPE.UPDATE, message, companyLeave._id, cl[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Leave Does Not Exists.', []);
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
exports.deleteCompanyLeave = (req, res) => {
    if (req.body._id) {
      CompanyLeave.findByIdAndDelete(req.body._id)
        .exec()
        .then(deletedCompanyLeave => {
          if (deletedCompanyLeave) {
            var message = 'Company Leave `' + deletedCompanyLeave.leaveType + '` Deleted Successfully!';
            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_COMPANY_LEAVE, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, deletedCompanyLeave, null);
            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
          } else {
            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Leave Does not exist', []);
          }
        })
        .catch(err => {
          console.log(err);
          return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
        });
    } else {
      return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }
  };
  
// exports.deleteCompanyLeave = (req, res) => {

//     if (req.body._id) {
//         CompanyLeave.find({
//             _id: req.body._id
//         })
//             .exec()
//             .then(companyLeaveOldData => {

//                 if (companyLeaveOldData.length > 0) {

//                     CompanyLeave.findByIdAndDelete({
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
//                             var message = 'Company Leave `' + companyLeaveOldData[0].leaveType + '` Deleted Successfully!';
//                             Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_COMPANY_LEAVE, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, companyLeaveOldData[0], result);
//                             return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
//                         })
//                         .catch(err => {
//                             console.log(err);
//                             return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
//                         });
//                 } else {
//                     return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Leave Does not exists', []);
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