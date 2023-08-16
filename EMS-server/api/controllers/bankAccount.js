const mongoose = require('mongoose');
const Company = require('../model/Company');
const BankAccount = require('../model/BankAccount');
var crypto = require("crypto");
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');
const s3Helper = require('../helpers/s3Helper');


exports.bankAccountList = (req, res) => {
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
    if (req.body.companyId) {
        optionalQuery.companyId = mongoose.Types.ObjectId(req.body.companyId);
    }

    BankAccount.find().exec().then(result => {
        var totalResult = result.length;
        BankAccount
            .aggregate([{
                $addFields: {
                    bankAccountNumberString: {
                        $toString: {
                            $toLong: "$bankAccountNumber"
                        }
                    }
                }
            },
            {
                $match: {
                    $and: [{
                        $or: [{
                            accHolderName: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            bankAccountNumberString: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            bankName: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            bankBranch: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            ifscCode: {
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
                $unwind: {
                    path: '$checkImg',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    accHolderName: 1,
                    bankAccountNumber: 1,
                    bankName: 1,
                    bankBranch: 1,
                    ifscCode: 1,
                    companyId: 1,
                    checkImg: {
                        $concat: [CONSTANTS.AWS.URL, "$checkImg"]
                    },
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(bankAccount => {

                var data = {
                    recordsTotal: totalResult,
                    data: bankAccount,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Bank Account List', data);
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

exports.addBankAccount = (req, res) => {

    const bankAccount = new BankAccount({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        accHolderName: req.body.accHolderName,
        bankAccountNumber: req.body.bankAccountNumber,
        bankName: req.body.bankName,
        bankBranch: req.body.bankBranch,
        ifscCode: req.body.ifscCode,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime(),
        companyId: req.body.companyId,
    });

    //data validation
    if (bankAccount.userId && bankAccount.accHolderName && bankAccount.bankAccountNumber && bankAccount.bankName && bankAccount.bankBranch && bankAccount.ifscCode && bankAccount.companyId) {
        //companyId exists or not
        Company.find({
            companyId: bankAccount.companyId
        })
            .exec()
            .then(company => {
                if (company.length > 0) {
                    //check bank account exists or not
                    BankAccount.find({
                        bankAccountNumber: bankAccount.bankAccountNumber,
                        companyId: bankAccount.companyId
                    })
                        .exec()
                        .then(result => {
                            if (result.length < 1) {
                                bankAccount.save()
                                    .then(result => {

                                        var message = 'Bank Account `' + bankAccount.accHolderName + '` Created Successfully!';

                                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_BANK_ACCOUNT, CONSTANTS.OPERATION_TYPE.CREATE, message, bankAccount._id, null, result);
                                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                                    });

                            } else {
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Bank Account Already Exists.', []);
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

exports.editBankAccount = async (req, res) => {

    let bankAccount = new BankAccount({
        _id: req.body._id,
        userId: req.body.userId,
        accHolderName: req.body.accHolderName,
        bankAccountNumber: req.body.bankAccountNumber,
        bankName: req.body.bankName,
        bankBranch: req.body.bankBranch,
        ifscCode: req.body.ifscCode,
        status: req.body.status,
        updatedAt: utils.currentDatetime(),
        companyId: req.body.companyId,
    });

    //check post params not empty
    if (bankAccount._id && bankAccount.userId && bankAccount.accHolderName && bankAccount.bankAccountNumber && bankAccount.bankName && bankAccount.bankBranch && bankAccount.ifscCode && bankAccount.companyId) {

        // //check bank account exists or not
        BankAccount
            .find({
                _id: bankAccount._id
            })
            .exec()
            .then(bankAccountOldData => {

                if (bankAccountOldData.length > 0) {
                    //update bank account data   
                    BankAccount.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: bankAccount
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Bank Account `' + bankAccount.accHolderName + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_BANK_ACCOUNT, CONSTANTS.OPERATION_TYPE.UPDATE, message, bankAccount._id, bankAccountOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Bank Account Does Not Exists.', []);
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

exports.deleteBankAccount = (req, res) => {

    if (req.body._id) {
        BankAccount.find({
            _id: req.body._id
        })
            .exec()
            .then(bankAccountOldData => {
                if (bankAccountOldData.length > 0) {

                    BankAccount.findOneAndUpdate({
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
                            var message = 'Bank Account `' + bankAccountOldData[0].accHolderName + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_BANK_ACCOUNT, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, bankAccountOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Bank Account Does not exists', []);
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

exports.updateCheckImg = (req, res) => {

    const bankAccount = new BankAccount({
        _id: req.body._id,
        updatedAt: utils.currentDatetime()
    });

    if (req.body._id && req.files && req.files[0]) {
        //check bank account exists or not
        BankAccount.find({
            _id: bankAccount._id
        })
            .exec()
            .then(bankAccountOldData => {
                if (bankAccountOldData.length > 0) {
                    const filename = crypto.randomBytes(16).toString('hex');
                    //upload new picture
                    s3Helper.upload(req.files[0], filename)
                        .then(data => {
                            bankAccount.checkImg = data.key;

                            //delete old image
                            if (bankAccountOldData[0].checkImg) {
                                s3Helper.delete(bankAccountOldData[0].checkImg);
                            }

                            //update bankAccount data in database 
                            BankAccount.findOneAndUpdate({
                                _id: req.body._id
                            }, {
                                $set: bankAccount
                            }, {
                                new: true
                            })
                                .exec()
                                .then(result => {
                                    var message = 'Bank account check image updated successfully!';

                                    Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.UPDATE_PROFILE_PIC, CONSTANTS.OPERATION_TYPE.UPDATE, message, req.body._id, bankAccountOldData[0], result);
                                    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                                })
                                .catch(err => {
                                    console.log(err);
                                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Bank Account Does Not Exists.', []);
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

exports.deleteCheckImg = (req, res) => {

    if (req.body._id) {
        BankAccount.find({
            _id: req.body._id
        })
            .exec()
            .then(bankAccountOldData => {
                if (bankAccountOldData.length > 0) {
                    s3Helper.delete(bankAccountOldData[0].checkImg);

                    BankAccount.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: {
                            checkImg: null,
                            updatedAt: utils.currentDatetime()
                        }
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {

                            var message = 'Check Image Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_PROFILE_PIC, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, bankAccountOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Bank Account Does not exists', []);
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