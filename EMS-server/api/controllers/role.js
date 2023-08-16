const mongoose = require('mongoose');
const Role = require('../model/Role');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.roleList = (req, res) => {

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

    Role.find().exec().then(result => {
        var totalResult = result.length;
        Role
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            roleName: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            description: {
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
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                },
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    roleName: 1,
                    description: 1,
                    companyId: 1,
                    companyName: "$company.companyName",
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(role => {

                var data = {
                    recordsTotal: totalResult,
                    data: role,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Role List', data);
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

exports.addRole = (req, res) => {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        roleName: req.body.roleName,
        status: CONSTANTS.STATUS.ACTIVE,
        createdAt: utils.currentDatetime(),
        description: req.body.description,
        companyId: req.body.companyId,
    });

    //check roleName not empty
    if (role.roleName && role.companyId) {
        //check role exists or not
        Role.find({
            roleName: role.roleName,
            companyId: role.companyId
        })
            .exec()
            .then(result => {
                if (result.length < 1) {
                    role.save()
                        .then(result => {

                            var message = 'Role `' + role.roleName + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_ROLE, CONSTANTS.OPERATION_TYPE.CREATE, message, role._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Role Already Exists.', []);
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

exports.editRole = (req, res) => {

    const role = new Role({
        _id: req.body._id,
        roleName: req.body.roleName,
        status: req.body.status,
        updatedAt: utils.currentDatetime(),
        description: req.body.description,
        companyId: req.body.companyId,
    });

    //check post params not empty
    if (role.roleName && role._id) {

        // //check master salary already exists or not
        Role
            .find({
                _id: role._id
            })
            .exec()
            .then(roleOldData => {

                if (roleOldData.length > 0) {
                    Role.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: role
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'Role `' + role.roleName + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_ROLE, CONSTANTS.OPERATION_TYPE.UPDATE, message, role._id, roleOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Role Does Not Exists.', []);
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

exports.deleteRole = (req, res) => {

    if (req.body._id) {
        Role.find({
            _id: req.body._id
        })
            .exec()
            .then(roleOldData => {
                if (roleOldData.length > 0) {

                    Role.findOneAndUpdate({
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
                            var message = 'Role `' + roleOldData[0].roleName + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_ROLE, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, roleOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Role Does not exists', []);
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