const mongoose = require('mongoose');
const CompanySalary = require('../model/CompanySalary');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.companySalaryList = (req, res) => {

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

    CompanySalary.find().exec().then(result => {
        var totalResult = result.length;
        CompanySalary
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            salaryType: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            amount: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            payAs: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            payType: {
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
                    amount: 1,
                    payAs: 1,
                    payType: 1,
                    companyId: 1,
                    masterSalaryId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(companySalary => {

                var data = {
                    recordsTotal: totalResult,
                    data: companySalary,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Company Salary List', data);
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

exports.companySalaryById = (req, res) => {

    var companySalaryId = req.body._id;

    if (companySalaryId) {
        CompanySalary.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(companySalaryId)
            },
        },
        {
            $project: {
                _id: 1,
                salaryType: 1,
                amount: 1,
                payAs: 1,
                payType: 1,
                companyId: 1,
                masterSalaryId: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
        ])
            .exec()
            .then(result => {
                if (result.length > 0) {
                    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Company Salary Details', result[0]);
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Salary not found.', []);
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

exports.addCompanySalary = (req, res) => {

    const companySalary = new CompanySalary({
        _id: new mongoose.Types.ObjectId(),
        companyId: req.body.companyId,
        salaryType: req.body.salaryType,
        amount: req.body.amount,
        payAs: req.body.payAs,
        payType: req.body.payType,
        status: CONSTANTS.STATUS.ACTIVE,
        masterSalaryId: req.body.masterSalaryId,
        createdAt: utils.currentDatetime()
    });

    //check post params not empty
    if (companySalary.salaryType && companySalary.companyId) {

        // //check company salary already exists or not
        CompanySalary
            .find({
                salaryType: companySalary.salaryType,
                companyId: companySalary.companyId
            })
            .exec()
            .then(cs => {

                if (cs.length < 1) {

                    companySalary.save()
                        .then(result => {
                            var message = 'Company Salary `' + companySalary.salaryType + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_COMPANY_SALARY, CONSTANTS.OPERATION_TYPE.CREATE, message, companySalary._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Salary Add Failed', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Salary Already Exists.', []);
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

exports.editCompanySalary = (req, res) => {

    const companySalary = new CompanySalary({
        _id: req.body._id,
        companyId: req.body.companyId,
        salaryType: req.body.salaryType,
        amount: req.body.amount,
        payAs: req.body.payAs,
        payType: req.body.payType,
        status: req.body.status,
        masterSalaryId: req.body.masterSalaryId,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (companySalary.salaryType && companySalary._id) {

        // //check company salary already exists or not
        CompanySalary
            .find({
                _id: companySalary._id
            })
            .exec()
            .then(cs => {

                if (cs.length > 0) {
                    CompanySalary.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: companySalary
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Company Salary `' + companySalary.salaryType + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_COMPANY_SALARY, CONSTANTS.OPERATION_TYPE.UPDATE, message, companySalary._id, cs[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Salary Does Not Exists.', []);
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

// exports.deleteCompanySalary = (req, res) => {

//     if (req.body._id) {
//         CompanySalary.find({
//             _id: req.body._id
//         })
//             .exec()
//             .then(companySalaryOldData => {
//                 if (companySalaryOldData.length > 0) {

//                     CompanySalary.findOneAndUpdate({
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
//                             var message = 'Company Salary `' + companySalaryOldData[0].salaryType + '` Deleted Successfully!';
//                             Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_COMPANY_SALARY, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, companySalaryOldData[0], result);
//                             return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
//                         })
//                         .catch(err => {
//                             console.log(err);
//                             return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
//                         });
//                 } else {
//                     return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Salary Does not exists', []);
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

exports.deleteCompanySalary = (req, res) => {
    if (req.body._id) {
      CompanySalary.findByIdAndDelete(req.body._id)
        .exec()
        .then(deletedCompanySalary => {
          if (deletedCompanySalary) {
            var message = 'Company Salary `' + deletedCompanySalary.salaryType + '` Deleted Successfully!';
            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_COMPANY_SALARY, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, deletedCompanySalary, null);
            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
          } else {
            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Salary Does not exist', []);
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
  
  