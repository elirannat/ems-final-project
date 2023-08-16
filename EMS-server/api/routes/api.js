const express = require('express');
const router = express.Router();
const CONSTANTS = require('../config/constants')
const checkPermission = require('../middleware/checkPermission');
const UsersController = require('../controllers/users');
const PermissionController = require('../controllers/permission');
const CompanyController = require('../controllers/company');
const RoleController = require('../controllers/role');
const MasterLeaveController = require('../controllers/masterLeave');
const MasterSalaryController = require('../controllers/masterSalary');
const LogController = require('../controllers/logger');
const CompanyLeaveController = require('../controllers/companyLeave');
const CompanySalaryController = require('../controllers/companySalary');
const EmployeeLeaveController = require('../controllers/employeeLeave');
const HolidayController = require('../controllers/holiday');
const BankAccountController = require('../controllers/bankAccount');
const PayrollController = require('../controllers/payroll');
const AppraisalController = require('../controllers/appraisal');
const employeeController = require('../controllers/employee')
// const uploadController = require('../controllers/upload')
// const img = require('../middleware/img')
const uploadController = require('../controllers/uploadController');
const multerMiddleware = require('../middleware/multerMiddleware');

//User
router.post(CONSTANTS.ROUTES.USER_LIST, checkPermission(CONSTANTS.MODULE.USER_LIST), UsersController.userList);
router.post(CONSTANTS.ROUTES.ADD_USER, checkPermission(CONSTANTS.MODULE.ADD_USER), UsersController.addUser);
router.post(CONSTANTS.ROUTES.EDIT_USER, checkPermission(CONSTANTS.MODULE.EDIT_USER), UsersController.editUser);
router.post(CONSTANTS.ROUTES.DELETE_USER, checkPermission(CONSTANTS.MODULE.DELETE_USER), UsersController.deleteUser);
router.post(CONSTANTS.ROUTES.FORGOT_PASSWORD, UsersController.forgotPassword);
router.post(CONSTANTS.ROUTES.VERIFY_OTP, UsersController.verifyOtp);
router.post(CONSTANTS.ROUTES.UPDATE_PROFILE_PIC, UsersController.updateProfilePic);
router.post(CONSTANTS.ROUTES.DELETE_PROFILE_PIC, UsersController.deleteProfilePic);

//Permission
router.post(CONSTANTS.ROUTES.PERMISSION_LIST, checkPermission(CONSTANTS.MODULE.PERMISSION_LIST), PermissionController.permissionList);
router.post(CONSTANTS.ROUTES.ADD_PERMISSION, checkPermission(CONSTANTS.MODULE.ADD_PERMISSION), PermissionController.addPermission);
router.post(CONSTANTS.ROUTES.ADD_MULTIPLE_PERMISSION, checkPermission(CONSTANTS.MODULE.ADD_MULTIPLE_PERMISSION), PermissionController.addMultiplePermission);
router.post(CONSTANTS.ROUTES.EDIT_PERMISSION, checkPermission(CONSTANTS.MODULE.EDIT_PERMISSION), PermissionController.editPermission);
router.post(CONSTANTS.ROUTES.DELETE_PERMISSION, checkPermission(CONSTANTS.MODULE.DELETE_PERMISSION), PermissionController.deletePermission);

//Company
router.post(CONSTANTS.ROUTES.COMPANY_LIST, checkPermission(CONSTANTS.MODULE.COMPANY_LIST), CompanyController.companyList);
router.post(CONSTANTS.ROUTES.ADD_COMPANY, checkPermission(CONSTANTS.MODULE.ADD_COMPANY), CompanyController.addCompany);
router.post(CONSTANTS.ROUTES.EDIT_COMPANY, checkPermission(CONSTANTS.MODULE.EDIT_COMPANY), CompanyController.editCompany);
router.post(CONSTANTS.ROUTES.DELETE_COMPANY, checkPermission(CONSTANTS.MODULE.DELETE_COMPANY), CompanyController.deleteCompany);

//Role
router.post(CONSTANTS.ROUTES.ROLE_LIST, checkPermission(CONSTANTS.MODULE.ROLE_LIST), RoleController.roleList);
router.post(CONSTANTS.ROUTES.ADD_ROLE, checkPermission(CONSTANTS.MODULE.ADD_ROLE), checkPermission(CONSTANTS.MODULE.ADD_ROLE), RoleController.addRole);
router.post(CONSTANTS.ROUTES.EDIT_ROLE, checkPermission(CONSTANTS.MODULE.EDIT_ROLE), RoleController.editRole);
router.post(CONSTANTS.ROUTES.DELETE_ROLE, checkPermission(CONSTANTS.MODULE.DELETE_ROLE), RoleController.deleteRole);

//Master Leave Type
router.post(CONSTANTS.ROUTES.MASTER_LEAVE_LIST, checkPermission(CONSTANTS.MODULE.MASTER_LEAVE_LIST), MasterLeaveController.masterLeaveList);
router.post(CONSTANTS.ROUTES.ADD_MASTER_LEAVE, checkPermission(CONSTANTS.MODULE.ADD_MASTER_LEAVE), MasterLeaveController.addMasterLeave);
router.post(CONSTANTS.ROUTES.EDIT_MASTER_LEAVE, checkPermission(CONSTANTS.MODULE.EDIT_MASTER_LEAVE), MasterLeaveController.editMasterLeave);
router.post(CONSTANTS.ROUTES.DELETE_MASTER_LEAVE, checkPermission(CONSTANTS.MODULE.DELETE_MASTER_LEAVE), MasterLeaveController.deleteMasterLeave);

//Master Salary
router.post(CONSTANTS.ROUTES.MASTER_SALARY_LIST, checkPermission(CONSTANTS.MODULE.MASTER_SALARY_LIST), MasterSalaryController.masterSalaryList);
router.post(CONSTANTS.ROUTES.ADD_MASTER_SALARY, checkPermission(CONSTANTS.MODULE.ADD_MASTER_SALARY), MasterSalaryController.addMasterSalary);
router.post(CONSTANTS.ROUTES.EDIT_MASTER_SALARY, checkPermission(CONSTANTS.MODULE.EDIT_MASTER_SALARY), MasterSalaryController.editMasterSalary);
router.post(CONSTANTS.ROUTES.DELETE_MASTER_SALARY, checkPermission(CONSTANTS.MODULE.DELETE_MASTER_SALARY), MasterSalaryController.deleteMasterSalary);

//Log
router.post(CONSTANTS.ROUTES.LOG_LIST, checkPermission(CONSTANTS.MODULE.LOG_LIST), LogController.logList);

//Company Leave
router.post(CONSTANTS.ROUTES.COMPANY_LEAVE_LIST, checkPermission(CONSTANTS.MODULE.COMPANY_LEAVE_LIST), CompanyLeaveController.companyLeaveList);
router.post(CONSTANTS.ROUTES.ADD_COMPANY_LEAVE, checkPermission(CONSTANTS.MODULE.ADD_COMPANY_LEAVE), CompanyLeaveController.addCompanyLeave);
router.post(CONSTANTS.ROUTES.EDIT_COMPANY_LEAVE, checkPermission(CONSTANTS.MODULE.EDIT_COMPANY_LEAVE), CompanyLeaveController.editCompanyLeave);
router.post(CONSTANTS.ROUTES.DELETE_COMPANY_LEAVE, checkPermission(CONSTANTS.MODULE.DELETE_COMPANY_LEAVE), CompanyLeaveController.deleteCompanyLeave);


//Company Salary
router.post(CONSTANTS.ROUTES.COMPANY_SALARY_LIST, checkPermission(CONSTANTS.MODULE.COMPANY_SALARY_LIST), CompanySalaryController.companySalaryList);
router.post(CONSTANTS.ROUTES.ADD_COMPANY_SALARY, checkPermission(CONSTANTS.MODULE.ADD_COMPANY_SALARY), CompanySalaryController.addCompanySalary);
router.post(CONSTANTS.ROUTES.EDIT_COMPANY_SALARY, checkPermission(CONSTANTS.MODULE.EDIT_COMPANY_SALARY), CompanySalaryController.editCompanySalary);
router.post(CONSTANTS.ROUTES.DELETE_COMPANY_SALARY, checkPermission(CONSTANTS.MODULE.DELETE_COMPANY_SALARY), CompanySalaryController.deleteCompanySalary);

//Employee Leave
router.post(CONSTANTS.ROUTES.EMPLOYEE_LEAVE_HISTORY, checkPermission(CONSTANTS.MODULE.EMPLOYEE_LEAVE_HISTORY), EmployeeLeaveController.employeeLeaveHistory);
router.post(CONSTANTS.ROUTES.REQUEST_LEAVE, checkPermission(CONSTANTS.MODULE.REQUEST_LEAVE), EmployeeLeaveController.requestLeave);
router.post(CONSTANTS.ROUTES.EDIT_REQUEST_LEAVE, checkPermission(CONSTANTS.MODULE.EDIT_REQUEST_LEAVE), EmployeeLeaveController.editRequestLeave);
router.post(CONSTANTS.ROUTES.DELETE_REQUEST_LEAVE, checkPermission(CONSTANTS.MODULE.DELETE_REQUEST_LEAVE), EmployeeLeaveController.deleteRequestLeave);
router.post(CONSTANTS.ROUTES.USER_LEAVE, EmployeeLeaveController.userLeave);
router.post(CONSTANTS.ROUTES.APPROVE_REJECT_LEAVE_REQUEST, EmployeeLeaveController.approveRejectLeaveRequest);

//Holidays
router.post(CONSTANTS.ROUTES.HOLIDAY_LIST, checkPermission(CONSTANTS.MODULE.HOLIDAY_LIST), HolidayController.holidayList);
router.post(CONSTANTS.ROUTES.ADD_HOLIDAY, checkPermission(CONSTANTS.MODULE.ADD_HOLIDAY), HolidayController.addHoliday);
router.post(CONSTANTS.ROUTES.EDIT_HOLIDAY, checkPermission(CONSTANTS.MODULE.EDIT_HOLIDAY), HolidayController.editHoliday);
router.post(CONSTANTS.ROUTES.DELETE_HOLIDAY, checkPermission(CONSTANTS.MODULE.DELETE_HOLIDAY), HolidayController.deleteHoliday);

//Employee Bank Account
router.post(CONSTANTS.ROUTES.BANK_ACCOUNT_LIST, checkPermission(CONSTANTS.MODULE.BANK_ACCOUNT_LIST), BankAccountController.bankAccountList);
router.post(CONSTANTS.ROUTES.ADD_BANK_ACCOUNT, checkPermission(CONSTANTS.MODULE.ADD_BANK_ACCOUNT), BankAccountController.addBankAccount);
router.post(CONSTANTS.ROUTES.EDIT_BANK_ACCOUNT, checkPermission(CONSTANTS.MODULE.EDIT_BANK_ACCOUNT), BankAccountController.editBankAccount);
router.post(CONSTANTS.ROUTES.DELETE_BANK_ACCOUNT, checkPermission(CONSTANTS.MODULE.DELETE_BANK_ACCOUNT), BankAccountController.deleteBankAccount);
router.post(CONSTANTS.ROUTES.UPDATE_CHECK_IMG, BankAccountController.updateCheckImg);
router.post(CONSTANTS.ROUTES.DELETE_CHECK_IMG, BankAccountController.deleteCheckImg);

//Payroll
router.post(CONSTANTS.ROUTES.PAYROLL_LIST, checkPermission(CONSTANTS.MODULE.PAYROLL_LIST), PayrollController.payrollList);
router.post(CONSTANTS.ROUTES.ADD_PAYROLL, checkPermission(CONSTANTS.MODULE.ADD_PAYROLL), PayrollController.addPayroll);
router.post(CONSTANTS.ROUTES.EDIT_PAYROLL, checkPermission(CONSTANTS.MODULE.EDIT_PAYROLL), PayrollController.editPayroll);
router.post(CONSTANTS.ROUTES.DELETE_PAYROLL, checkPermission(CONSTANTS.MODULE.DELETE_PAYROLL), PayrollController.deletePayroll);

//Appraisal
router.post(CONSTANTS.ROUTES.APPRAISAL_LIST, checkPermission(CONSTANTS.MODULE.APPRAISAL_LIST), AppraisalController.appraisalList);
router.post(CONSTANTS.ROUTES.ADD_APPRAISAL, checkPermission(CONSTANTS.MODULE.ADD_APPRAISAL), AppraisalController.addAppraisal);
router.post(CONSTANTS.ROUTES.EDIT_APPRAISAL, checkPermission(CONSTANTS.MODULE.EDIT_APPRAISAL), AppraisalController.editAppraisal);
router.post(CONSTANTS.ROUTES.DELETE_APPRAISAL, checkPermission(CONSTANTS.MODULE.DELETE_APPRAISAL), AppraisalController.deleteAppraisal);

//Employee 
router.post(CONSTANTS.ROUTES.EMPLOYEE_LIST, employeeController.employeeList);
router.post(CONSTANTS.ROUTES.ADD_EMPLOYEE,  employeeController.addEmployee);
router.post(CONSTANTS.ROUTES.EDIT_EMPLOYEE, employeeController.editEmployee);
router.post(CONSTANTS.ROUTES.DELETE_EMPLOYEE, employeeController.deleteEmployee);


//upload

// router.post('/upload', multerMiddleware.single('image'),  uploadController.uploadImage);



module.exports = router;