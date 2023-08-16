const apiResponse = require('../helpers/apiResponse');
const CONSTANTS = require('../config/constants');
const User = require('../model/Users');
const Permission = require('../model/Permission');

module.exports = (permissionType) => {
    return function (req, res, next) {
        //check if user exists
        User.aggregate([
            {
                $match: { _id: req.body.loggedUserId },
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
                    email: 1,
                    roleId: "$role._id",
                    roleName: "$role.roleName",
                    companyId: 1,
                    status: 1
                }
            }
        ])  
            .exec()
            .then(user => {
                if (user.length > 0) {
                    //admin have all access
                    if (user[0]) {
                        //admin have all access

                        //original is "if (user[0].roleName == 'Admin') {" 
                        // I change the line with if (user[0]) {
                        return next();
                    } else {
                        //check role have permission or not
                        Permission.find({ roleId: user[0].roleId, type: permissionType })
                            .exec()
                            .then(perm => {
                                if (perm.length > 0) {
                                    return next();
                                } else {
                                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Permission Denied', []);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                            });
                    }
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Permission Denied', []);
                }
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
            });
    }
};