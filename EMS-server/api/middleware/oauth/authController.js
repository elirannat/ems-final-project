const User = require('../../model/Users');
const apiResponse = require('../../helpers/apiResponse');
const CONSTANTS = require('../../config/constants');

exports.login = (req, res, next) => {
    User.aggregate([
        {
            $match: {
                _id: req.body.loggedUserId
            },
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
            $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'company'
            },
        },
        {
            $unwind: {
                path: '$role',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: '$company',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: '$profilePic',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $project: {
                _id: 1,
                email: 1,
                empCode: 1,
                firstName: 1,
                lastName: 1,
                mobile: 1,
                address: 1,
                roleId: "$role._id",
                roleName: "$role.roleName",
                companyId: "$company._id",
                companyName: "$company.companyName",
                joiningDate: 1,
                qualification: 1,
                panNumber: 1,
                designation: 1,
                basicSalary: 1,
                gender: 1,
                profilePic: { $concat: [CONSTANTS.AWS.URL, "$profilePic"] },
                status: 1,
            }
        }
    ])
        .exec()
        .then(users => {
            if (users.length > 0) {
                var data = {
                    userData: users[0],
                    tokenData: req.body.token
                };
                var companyId = User.companyId
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Login Success', data,companyId);
            } else {
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does Not Exist', []);
            }
        })
        .catch(err => {
            console.log(err);
            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
        });
}

exports.getRefreshToken = (req, res, next) => {
    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Refresh Token', { tokenData: req.body.token });
}