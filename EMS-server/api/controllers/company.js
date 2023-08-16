const mongoose = require('mongoose');
const Company = require('../model/Company');
const User = require('../model/Users');
var crypto = require("crypto");
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');

exports.companyList = (req, res) => {

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


    Company.find().exec().then(result => {
        var totalResult = result.length;
        Company
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
                        $or: [
                            {
                                //remove old fields from here and add new fields 
                                companyName: {
                                    $regex: '.*' + search_text + '.*'
                                },
                            },
                            {
                                website: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                other: {
                                    $regex: '.*' + search_text + '.*'
                                },
                            },
                            {
                                mobileString: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                email: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                gstno: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                status: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                othertax01: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                othertax02: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            },
                            {
                                landmark: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            }, {
                                country: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            }, {
                                state: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            }, {
                                city: {
                                    $regex: '.*' + search_text + '.*'
                                }
                            }, {
                                pin: {
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
                    companyId: 1,
                    _id: 1,
                    companyName: 1,
                    password: 1,
                    // ownerFirstname: 1,
                    // ownerLastname: 1,
                    email: 1,
                    mobile: 1,
                    // address: 1,
                    // salaryEnabled: 1,
                    // leaveEnabled: 1,
                    // workingDays: 1,
                    // workingHours: 1,
                    // breakHours: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    website: 1,
                    other: 1,
                    address01: 1,
                    address02: 1,
                    landmark: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    pin: 1,
                    gstno: 1,
                    othertax01: 1,
                    othertax02: 1



                }
            }
            ])
            .exec()
            .then(company => {

                var data = {
                    recordsTotal: totalResult,
                    data: company,
                };
                return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Company List', data);
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

exports.addCompany = (req, res) => {
    var shaPass = crypto.createHash("sha256").update(req.body.password).digest("hex");
  
    const company = new Company({
      companyId: new mongoose.Types.ObjectId(),
      _id: new mongoose.Types.ObjectId(),
      companyName: req.body.companyName,
      // ownerFirstname: req.body.ownerFirstname,
      // ownerLastname: req.body.ownerLastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: shaPass,
      // address: req.body.address,
      // salaryEnabled: req.body.salaryEnabled,
      // leaveEnabled: req.body.leaveEnabled,
    //   type: req.body.type,
      status: CONSTANTS.STATUS.ACTIVE,
      // workingDays: req.body.workingDays,
      // workingHours: req.body.workingHours,
      // breakHours: req.body.breakHours,
      createdAt: utils.currentDatetime(),
      website: req.body.website,
      other: req.body.other,
      address01: req.body.address01,
      address02: req.body.address02,
      landmark: req.body.landmark,
      selectedCountry: req.body.country,
      selectedState: req.body.state,
      selectedCity: req.body.city,
      pin: req.body.pin,
      gstno: req.body.gstno,
      othertax01: req.body.othertax01,
      othertax02: req.body.othertax02
    });
  
    // Save user data as well
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      
      email: company.email,
      password: company.password,
      companyId: company.companyId
      // Add user data fields here
      
      // Add user data fields here
    });
  
    // Check company name not empty
    if (company.companyName && company.email && company.website) {
      // Check company already exists or not
      Company.find({ companyName: company.companyName })
        .exec()
        .then(comp => {
          if (comp.length < 1) {
            // Save company data
            company.save()
              .then(result => {
                var message = 'Company `' + company.companyName + '` Created Successfully!' 
  
                // Save user data
                user.save()
                  .then(userResult => {
                    // Add log after user data is saved
                    Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.ADD_COMPANY, CONSTANTS.OPERATION_TYPE.CREATE, message, company._id, null, company.companyId, userResult);
  
                    // Add companyId to the result object
                    var companyId = company.companyId;
  
                    // Send response with the modified result object
                    return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, result,companyId);
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
            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Name Already Exists.', []);
          }
        })
        .catch(err => {
          console.log(err);
          return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', []);
        });
    } else {
      return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Name Required', []);
    }
  };
  
  

exports.editCompany = (req, res) => {
    var shaPass = crypto.createHash("sha256").update(req.body.password).digest("hex");

    const company = new Company({
        _id: req.body._id,
        companyName: req.body.companyName,
        // ownerFirstname: req.body.ownerFirstname,
        // ownerLastname: req.body.ownerLastname,
        email: req.body.email,
        password: shaPass,
        mobile: req.body.mobile,
        // address: req.body.address,
        // salaryEnabled: req.body.salaryEnabled,
        // leaveEnabled: req.body.leaveEnabled,
        type: req.body.type,

        status: req.body.status,
        // workingDays: req.body.workingDays,
        // workingHours: req.body.workingHours,
        // breakHours: req.body.breakHours,
        website: req.body.website,
        other: req.body.other,
        address01: req.body.address01,
        address02: req.body.address02,
        landmark: req.body.landmark,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        gstno: req.body.gstno,
        othertax01: req.body.othertax01,
        othertax02: req.body.othertax02,
        updatedAt: utils.currentDatetime()
    });

    //check _id not empty
    if (company._id && company.companyName && company.email) {
        //check comapny already exists or not
        Company.find({ _id: company._id })
            .exec()
            .then(companyOldData => {
                if (companyOldData.length > 0) {
                    Company.findOneAndUpdate({ _id: req.body._id }, { $set: company }, { new: true })
                        .exec()
                        .then(result => {
                            var message = 'Company `' + company.companyName + '` Updated Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.EDIT_COMPANY, CONSTANTS.OPERATION_TYPE.UPDATE, message, company._id, companyOldData[0], result);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', [err]);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'companyId not found.', []);
                }
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something went wrong', [err]);
            });
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Invalid Post Parameter', []);
    }
}

exports.deleteCompany = (req, res) => {

    if (req.body._id) {
        Company.find({ _id: req.body._id })
            .exec()
            .then(companyOldData => {
                if (companyOldData.length > 0) {
                    Company.findByIdAndDelete({ _id: req.body._id }, { $set: { status: CONSTANTS.STATUS.DELETED } }, { new: true })
                        .exec()
                        .then(com => {
                            var message = 'Company `' + companyOldData[0].companyName + '` Deleted Successfully!';
                            Logger.addLog(req.body.loggedUserId, CONSTANTS.LEVEL.INFO, CONSTANTS.MODULE.DELETE_COMPANY, CONSTANTS.OPERATION_TYPE.DELETE, message, req.body._id, companyOldData[0], com);
                            return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, message, []);
                        })
                        .catch(err => {
                            console.log(err);
                            return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
                        });
                } else {
                    return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Company Does not exists', []);
                }
            })
            .catch(err => {
                console.log(err);
                return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Something Went Wrong', []);
            });
    } else {
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Inavlid Post Parameter', []);
    }
}