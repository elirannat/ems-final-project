const mongoose = require('mongoose');
const Company = require('../model/Company');
const MasterLeave = require('../model/MasterLeave');
const MasterSalary = require('../model/MasterSalary');
const User = require('../model/Users');
const Role = require('../model/Role');
const Permission = require('../model/Permission');
const OauthClient = require('../model/OauthClient');
const CONSTANTS = require('../config/constants');
const apiResponse = require('../helpers/apiResponse');
const utils = require('../helpers/utils');
const Logger = require('./logger');
var crypto = require("crypto");

exports.storeData = async (req, res, next) => {
    try {
        //create admin role
        const roleId = await addAdminRole();
        //create company_user role
        const roleId2 = await addCompanyUserRole();
        //create admin user
        const adminUserId = await addAdmin(roleId);
        //create oauth client
        await addClient(adminUserId);

        //give all permission to admin role
        const permissionTypeList = [
            'add_admin',
            'add_company',
            'edit_company',
            'delete_company',
            'add_permission',
            'add_role',
            'add_user',
            'company_list',
            'user_list',
            'add_master_leave',
            'add_master_salary',
        ];
        await addPermission(roleId, permissionTypeList);
        return apiResponse.send(res, CONSTANTS.API.SUCCESS_CODE, 'Data Stored Successfully!', []);
    } catch (err) {
        console.log(err);
        return apiResponse.send(res, CONSTANTS.API.FAIL_CODE, 'Data Stored Failed!', []);
    }
}


async function addAdmin(roleId) {
    var shaPass = crypto.createHash("sha256").update('admin123').digest("hex");
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: "eliran.natan@outlook.com",
        password: shaPass,
        roleId: roleId,
        firstName: "Eliran",
        lastName: "Natan",
        status: "active"
    });

    var userData = await user.save();
    return userData._id;
}

async function addAdminRole() {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        roleName: "Admin",
        status: "active",
        description: "Admin Have All Access",
    });

    var roleData = await role.save();
    return roleData._id;
}


async function addCompanyUserRole() {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        roleName: "company_user",
        status: "active",
        description: "Can Manage Company",
    });

    var roleData = await role.save();
    return roleData._id;
}

async function addPermission(roleId, permissionTypeList) {

    for (const permissionType of permissionTypeList) {

        const permission = new Permission({
            _id: new mongoose.Types.ObjectId(),
            type: permissionType,
            roleId: roleId,
            status: 'active',
            createdAt: utils.currentDatetime()
        });
        Permission
            .find({ type: permission.type, roleId: permission.roleId })
            .exec()
            .then(perm => {

                if (perm.length < 1) {

                    permission.save()
                        .then(result => {
                            var message = 'Permission `' + permission.type + '` Created Successfully!';
                        })
                        .catch(err => {
                            console.log(err);
                            // console.log(err);
                            console.log('Something went wrong');
                        });
                } else {
                    console.log('Permission Already Exists.');
                }
            })
            .catch(err => {
                console.log(err);
                console.log('Something went wrong');
            });
    }
}

async function addClient(userId) {
    const oauthClient = new OauthClient({
        _id: new mongoose.Types.ObjectId(),
        id: "ci_etmpayroll_web",
        clientId: "ci_etmpayroll_web",
        clientSecret: "cs_etmpayroll_web",
        grants: ['password', 'refresh_token'],
        userId: userId
    });

    var oauthClientData = await oauthClient.save();
    return oauthClientData._id;

}