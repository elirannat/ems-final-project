const mongoose = require('mongoose');
const User = require('../model/Users');
const OTP = require('../model/Otp');
var crypto = require("crypto");
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Email = require('../helpers/email');
const Logger = require('./logger');
const s3Helper = require('../helpers/s3Helper');

//get UserList
exports.userList = (req, res) => {

    const direc = {
        asc: 1,
        desc: -1
    }

    const order_dir = direc[req.body.order_dir] || 1;
    const order_column = req.body.order_column || '_id';
    const start = req.body.start || 0;
    const length = req.body.length || '';
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

    User.find().exec().then(result => {
        var totalResult = result.length;
        User
            .aggregate([{
                $addFields: {
                    mobileString: {
                        $toString: {
                            $toLong: "$mobile"
                        }
                    }
                }
            },
            {
                $match: {
                    $and: [{
                        $or: [{
                            email: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            type: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            firstName: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            lastName: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            mobileString: {
                                $regex: '.*' + search_text + '.*'
                            }
                        },
                        {
                            empCode: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            address: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            joiningDate: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            qualification: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            panNumber: {
                                $regex: '.*' + search_text + '.*'
                            },
                        }, 
                        {
                            designation: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            basicSalary: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            gender: {
                                $regex: '.*' + search_text + '.*'
                            },
                        },
                        {
                            status: {
                                $regex: '.*' + search_text + '.*'
                            }
                        }
                        ],
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
                    type: 1,
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
                    profilePic: {
                        $concat: [CONSTANTS.AWS.URL, "$profilePic"]
                    },
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
            ])
            .exec()
            .then(user => {

                var data = {
                    recordsTotal: totalResult,
                    data: user,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'User List', data);
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', [err]);
            }); 
    }).catch(err => {
        console.log(err);
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', [err]);
    });
};

exports.addUser = (req, res) => {
    var shaPass = crypto.createHash("sha256").update(req.body.password).digest("hex");
    let user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: shaPass,
        type: req.body.type,
        // roleId: new mongoose.Types.ObjectId(),
        empCode: req.body.empCode,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        address: req.body.address,
        joiningDate: req.body.joiningDate,
        resignDate: req.body.resignDate,
        qualification: req.body.qualification,
        panNumber: req.body.panNumber,
        designation: req.body.designation,
        basicSalary: req.body.basicSalary,
        gender: req.body.gender,
        profilePic: CONSTANTS.UTILS.DEFAULT_USER_IMG,
        status: CONSTANTS.STATUS.ACTIVE,
        companyId: req.body.companyId,
        createdAt: utils.currentDatetime()
    });

    //check user email & password not empty
    if (user.email && user.password) {
        //check user already exists or not
        User.find({
            email: user.email
        })
            .exec()
            .then(comp => {
                if (comp.length < 1) {
                    //add User
                    user.save()
                        .then(result => {
                            var message = 'User `' + user.email + '` Created Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_USER, CONSTANTS.OPERATION_TYPE.CREATE, message, user._id, null, result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Already Exists.', []);
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

exports.editUser = (req, res) => {

    const user = new User({
        _id: req.body._id,
        roleId: req.body.roleId,
        empCode: req.body.empCode,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        address: req.body.address,
        joiningDate: req.body.joiningDate,
        resignDate: req.body.resignDate,
        qualification: req.body.qualification,
        panNumber: req.body.panNumber,
        designation: req.body.designation,
        basicSalary: req.body.basicSalary,
        gender: req.body.gender,
        status: req.body.status,
        companyId: req.body.companyId,
        updatedAt: utils.currentDatetime()
    });

    if (req.body._id) {
        if (req.body.password) {
            user.password = crypto.createHash("sha256").update(req.body.password).digest("hex");
        }


        //check user already exists or not
        User.find({
            _id: user._id
        })
            .exec()
            .then(userOldData => {
                if (userOldData.length > 0) {
                    //update user data   
                    User.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        $set: user
                    }, {
                        new: true
                    })
                        .exec()
                        .then(result => {
                            var message = 'User `' + userOldData[0].firstName + '` Updated Successfully!';

                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_USER, CONSTANTS.OPERATION_TYPE.UPDATE, message, req.body._id, userOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does Not Exists.', []);
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
exports.deleteUser = (req, res) => {
    if (req.body._id) {
      User.findByIdAndDelete(req.body._id)
        .exec()
        .then(deletedUser => {
          if (deletedUser) {
            var message = 'User `' + deletedUser.email + '` Deleted Successfully!';
            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_USER, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, deletedUser, null);
            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
          } else {
            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does not exist', []);
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
  
// exports.deleteUser = (req, res) => {

//     if (req.body._id) {
//         User.find({
//             _id: req.body._id
//         })
//             .exec()
//             .then(userOldData => {
//                 if (userOldData.length > 0) {
//                     User.findByIdAndDelete({
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
//                             var message = 'User `' + userOldData[0].email + '` Deleted Successfully!';
//                             Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_USER, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, userOldData[0], result);
//                             return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
//                         })
//                         .catch(err => {
//                             console.log(err);
//                             return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
//                         });
//                 } else {
//                     return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does not exists', []);
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

exports.forgotPassword = (req, res) => {
    var email = req.body.email;

    if (email) {
        User.find({
            email: req.body.email
        })
            .exec()
            .then(user => {
                if (user.length > 0) {
                    //generate otp
                    var otp = Math.floor(100000 + Math.random() * 900000);

                    const otpModel = new OTP({
                        _id: new mongoose.Types.ObjectId(),
                        otp: otp,
                        userId: user[0]._id,
                        status: CONSTANTS.STATUS.ACTIVE,
                        expiredAt: utils.futureDatetime(30000),
                        createdAt: utils.currentDatetime()
                    });

                    //expire old otp
                    OTP.updateMany({
                        userId: user[0]._id
                    }, {
                        $set: {
                            status: CONSTANTS.STATUS.EXPIRED
                        }
                    })
                        .exec()
                        .then(result => {
                            otpModel.save()
                                .then(result => {
                                    var resData = {
                                        resend_otp_time: CONSTANTS.UTILS.RESEND_OTP_TIME
                                    }
                                    var message = 'OTP sent to ' + email + ' Successfully!';
                                    Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.FORGOT_PASSWORD, CONSTANTS.OPERATION_TYPE.CREATE, message, user._id, null, result);

                                    if (CONSTANTS.MAIL.ENABLE) {
                                        var mailMessage = `
                                    <div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
                                    <div style="margin:50px auto;width:70%;padding:20px 0">
                                        <div style="border-bottom:1px solid #eee">
                                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">ETM-Payroll</a>
                                        </div>
                                        <p style="font-size:1.1em">Hi,</p>
                                        <p>Thank you for choosing ETM-Payroll. Use the following OTP to Reset Password. OTP is valid for 5 minutes</p>
                                        <h2
                                            style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                                            ` + otp + `</h2>
                                        <p style="font-size:0.9em;">Regards,<br />ETM-Payroll</p>
                                        <hr style="border:none;border-top:1px solid #eee" />
                                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                                            <p>eTechMavens</p>
                                            <p>Ahmedabad</p>
                                        </div>
                                    </div>
                                </div>
                                `;
                                        // Send Mail
                                        Email.send(email, 'OTP for Reset Password', mailMessage, true, function (err, data) {
                                            if (!err) {
                                                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, resData);
                                            }
                                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Sending otp failed', []);
                                        });
                                    } else {
                                        resData.otp = otp;
                                        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, resData);
                                    }

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
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does not exists with This email', []);
                }
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
            });
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Email Required', []);
    }
}

exports.verifyOtp = (req, res) => {
    var userId = req.body._id;
    var otp = req.body.otp;
    var password = req.body.password;

    if (userId && otp && password) {
        OTP.find({
            userId: userId,
            otp: otp
        })
            .exec()
            .then(otp => {
                if (otp.length > 0) {
                    if (otp[0].status !== CONSTANTS.STATUS.EXPIRED) {
                        //expire otp
                        OTP.updateMany({
                            userId: userId
                        }, {
                            $set: {
                                status: CONSTANTS.STATUS.EXPIRED
                            }
                        })
                            .exec()
                            .then(result => {

                                const user = new User({
                                    _id: userId,
                                    password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
                                    updatedAt: utils.currentDatetime()
                                });
                                User.findOneAndUpdate({
                                    _id: req.body._id
                                }, {
                                    $set: user
                                }, {
                                    new: true
                                })
                                    .exec()
                                    .then(result => {
                                        var message = 'Password Changed Successfully!';
                                        Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.VERIFY_OTP, CONSTANTS.OPERATION_TYPE.CREATE, message, user._id, null, result);
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
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'OTP Expired', []);
                    }
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid OTP', []);
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

exports.updateProfilePic = (req, res) => {

    const user = new User({
        _id: req.body._id,
        updatedAt: utils.currentDatetime()
    });

    if (req.body._id && req.files && req.files[0]) {
        //check user already exists or not
        User.find({
            _id: user._id
        })
            .exec()
            .then(userOldData => {
                if (userOldData.length > 0) {
                    const filename = crypto.randomBytes(16).toString('hex');
                    //upload new picture
                    s3Helper.upload(req.files[0], filename)
                        .then(data => {
                            user.profilePic = data.key;

                            //delete old picture
                            if (userOldData[0].profilePic != CONSTANTS.UTILS.DEFAULT_USER_IMG) {
                                s3Helper.delete(userOldData[0].profilePic);
                            }

                            //update user data in database 
                            User.findOneAndUpdate({
                                _id: req.body._id
                            }, {
                                $set: user
                            }, {
                                new: true
                            })
                                .exec()
                                .then(result => {
                                    var message = 'User `' + userOldData[0].email + '` Updated Profile Picture Successfully!';

                                    Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.UPDATE_PROFILE_PIC, CONSTANTS.OPERATION_TYPE.UPDATE, message, req.body._id, userOldData[0], result);
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
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does Not Exists.', []);
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

exports.deleteProfilePic = (req, res) => {

    if (req.body._id) {
        User.find({
            _id: req.body._id
        })
            .exec()
            .then(userOldData => {
                if (userOldData.length > 0) {


                    //delete old image
                    if (userOldData[0].profilePic != CONSTANTS.UTILS.DEFAULT_USER_IMG) {
                        s3Helper.delete(userOldData[0].profilePic);

                        User.findOneAndUpdate({
                            _id: req.body._id
                        }, {
                            $set: {
                                profilePic: CONSTANTS.UTILS.DEFAULT_USER_IMG,
                                updatedAt: utils.currentDatetime()
                            }
                        }, {
                            new: true
                        })
                            .exec()
                            .then(result => {

                                var message = 'Profile Picture Deleted Successfully!';
                                Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_PROFILE_PIC, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, userOldData[0], result);
                                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                            })
                            .catch(err => {
                                console.log(err);
                                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                            });
                    } else {
                        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Profile Pic Does not exists', []);
                    }

                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'User Does not exists', []);
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