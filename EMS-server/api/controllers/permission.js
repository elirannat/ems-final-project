const mongoose = require('mongoose');
const Promise = require('bluebird');
const Permission = require('../model/Permission');
const Role = require('../model/Role');
const Company = require('../model/Company');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.permissionList = (req, res) => {

    const direc = {
        asc: 1,
        desc: -1
    }
    const order_dir = direc[req.body.order_dir] || 1;
    const order_column = req.body.order_column || '_id';
    const start = req.body.start || 0;
    const length = req.body.length || 100;
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
    if (req.body.roleId) {
        optionalQuery.roleId = mongoose.Types.ObjectId(req.body.roleId);
    }
    if (req.body.companyId) {
        optionalQuery.companyId = mongoose.Types.ObjectId(req.body.companyId);
    }

    Permission.find().exec().then(result => {
        var totalResult = result.length;
        Permission
            .aggregate([{
                $match: {
                    $and: [{
                        $or: [{
                            type: {
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
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'role'
                },
            },
            {
                $unwind: {
                    path: '$role',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    roleId: "$role._id",
                    roleName: "$role.roleName",
                    companyId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(permission => {

                var data = {
                    recordsTotal: totalResult,
                    data: permission,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Permission List', data);
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

exports.addPermission = (req, res) => {
    const permission = new Permission({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        roleId: req.body.roleId,
        status: CONSTANTS.STATUS.ACTIVE,
        companyId: req.body.companyId,
        createdAt: utils.currentDatetime()
    });

    //check post params not empty
    if (permission.type && permission.roleId && permission.companyId) {
        //check permission already exists or not
        Permission
            .find({ type: permission.type, roleId: permission.roleId, companyId: permission.companyId })
            .exec()
            .then(perm => {

                if (perm.length < 1) {

                    permission.save()
                        .then(result => {
                            var message = 'Permission `' + permission.type + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_PERMISSION, CONSTANTS.OPERATION_TYPE.CREATE, message, permission._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, result);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Permission Add Failed', [err]);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Permission Already Exists.', []);
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

//Pending
exports.addMultiplePermission = (req, res) => {
    const permissionTypeList = req.body.typeList;
    const roleId = req.body.roleId;
    const companyId = req.body.companyId;

    //check post params not empty
    if (permissionTypeList && roleId && companyId) {

        let promices = []
        permissionTypeList.forEach(type => {
            let permission = new Permission({
                _id: new mongoose.Types.ObjectId(),
                type: type,
                roleId: roleId,
                status: CONSTANTS.STATUS.ACTIVE,
                companyId: companyId,
                createdAt: utils.currentDatetime()
            });
            promices.push(
                Permission.updateOne(
                    {type: permission.type},
                    {
                        $set:{},
                        $setOnInsert:{}
                    },
                    {
                        upsert: true
                    }
                )
            );
            // promices.push(permission.save());
        })

        Promise.all(promices).then(result=> {
            result.forEach(perm => {
                var message = 'Permission `' + perm.type + '` Created Successfully!';
                Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_PERMISSION, CONSTANTS.OPERATION_TYPE.CREATE, message, perm._id, null, perm);
            })
            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Permission Added Successfully!', []);
        });
    
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }
}

exports.editPermission = (req, res) => {

    const permission = new Permission({
        _id: req.body._id,
        type: req.body.type,
        roleId: req.body.roleId,
        status: req.body.status,
        companyId: req.body.companyId,
        updatedAt: utils.currentDatetime()
    });

    //check post params not empty
    if (permission.type && permission._id) {

        // //check master salary already exists or not
        Permission
            .find({ _id: permission._id })
            .exec()
            .then(permissionOldData => {

                if (permissionOldData.length > 0) {
                    Permission.findOneAndUpdate({ _id: req.body._id }, { $set: permission }, { new: true })
                        .exec()
                        .then(result => {
                            var message = 'Permission `' + permission.type + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_PERMISSION, CONSTANTS.OPERATION_TYPE.UPDATE, message, permission._id, permissionOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Permission Does Not Exists.', []);
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

exports.deletePermission = (req, res) => {

    if (req.body._id) {
        Permission.find({ _id: req.body._id })
            .exec()
            .then(permissionOldData => {
                if (permissionOldData.length > 0) {

                    Permission.findOneAndUpdate({ _id: req.body._id }, { $set: { status: CONSTANTS.STATUS.DELETED } }, { new: true })
                        .exec()
                        .then(result => {
                            var message = 'Permission `' + permissionOldData[0].type + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_PERMISSION, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, permissionOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Permission Does not exists', []);
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