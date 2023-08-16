import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer/Footer";
import Login from './components/Login/Login';
import Dashboard from "./components/Dashboard/Dashboard";
import Admin from "./components/AdminUser/Admin";
import AddAdmin from "./components/AdminUser/AddAdmin";
import UpdateAdmin from "./components/AdminUser/UpdateAdmin";
import Compnay from './components/Company/Company'
import AddCompnay from './components/Company/AddCompany'
import AddCompnay01 from './components/Company/Addcompany01'
import AddCompnay02 from './components/Company/AddCompany02'
import UpdateCompany from './components/Company/UpdateCompany'
import Leave from './components/Leave/Leave'
import AddLeave from './components/Leave/AddLeave'
import Log from './components/LogManegement/Log'
import Salary from './components/Salary/Salary'
import AddSalary from './components/Salary/AddSalary'
import UpdateSalary from './components/Salary/UpdateSalary'
import User from './components/User/User'
import AddUser from './components/User/AddUser'
import UpdateUser from './components/User/UpdateUser'
import UpdateLeave from './components/Leave/UpdateLeave';
import PageNotFound from './components/Pagenotfound/PageNotFound';
import CompanyConfigure from './components/CompanyConfigure/CompanyConfigure';
import Employee from './components/Employee/Employee'
import AddEmployee from './components/Employee/AddEmployee';
import UpdateEmployee from './components/Employee/UpdateEmployee';
import LeaveRequest from './components/LeaveRequest/LeaveRequest';
import LeaveRequestApprove from './components/LeaveRequest/LeaveRequestApprove';
import Holiday from './components/Holiday/Holiday';
import AddHoliday from './components/Holiday/AddHoliday';
import UpdateHoliday from './components/Holiday/UpdateHoliday';
import Payroll from './components/Payroll/Payroll';
import AddPayroll from './components/Payroll/AddPayroll';
import UpdatePayroll from './components/Payroll/UpdatePayroll';
import Appraisal from './components/Appraisal/Appraisal';
import AddAppraisal from './components/Appraisal/AddAppraisal';
import UpdateAppraisal from './components/Appraisal/UpdateAppraisal';
import MonthlyReport from './components/MonthlyReport/MonthlyReport';
import AddMonthlyReport from './components/MonthlyReport/AddMonthlyReport';
import UpdateMonthlyReport from './components/MonthlyReport/UpdateMonthlyReport';
import Roles from './components/Roles/Roles';
import AddRoles from './components/Roles/AddRoles';
import UpdateRoles from './components/Roles/UpdateRoles';
import Permission from './components/Permission/Permission';
import AddPermission from './components/Permission/AddPermission';
import UpdatePermission from './components/Permission/UpdatePermission';
import AccessControl from './components/AccessControl/AccessControl';
import BankAccount from './components/BankAccount/BankAccount';
import AddBankAccount from './components/BankAccount/AddBankAccount';
import UpdateBankAccount from './components/BankAccount/UpdateBankAccount';
import TestCodes from './components/TestCodes/TestCodes'
import MySalary from './components/MySalary/MySalary';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/addadmin" element={<AddAdmin />} />
          <Route path="/updateadmin" element={<UpdateAdmin />} />
          <Route path="/company" element={<Compnay />} />
          <Route path="/addcompany" element={<AddCompnay />} />
          <Route path="/addcompany01" element={<AddCompnay01 />} />
          <Route path="/addcompany02" element={<AddCompnay02 />} />
          <Route path="/updatecompany/:id" element={<UpdateCompany />} />
          <Route path="/leave" element={<Leave />} />
          <Route path='/addleave' element={<AddLeave />} />
          <Route path='/updateleave/:id' element={<UpdateLeave />} />
          <Route path='/log' element={<Log />} />
          <Route path='/mysalary' element={<MySalary />} />
          {/* <Route path='/salary' element={<Salary />} />
          <Route path='/addsalary' element={<AddSalary />} />
          <Route path='/updatesalary/:id' element={<UpdateSalary />} /> */}
          <Route path='/user' element={<User />} />
          <Route path='/adduser' element={<AddUser />} />
          <Route path='/updateuser/:id' element={<UpdateUser />} />
          
          
          <Route path='/companyconfigure' element={<CompanyConfigure />} />
          <Route path='/employee' element={<Employee />} />
          <Route path='/addemployee' element={<AddEmployee />} />
          <Route path='/updateemployee/:id' element={<UpdateEmployee/>} />
          <Route path='/leaverequest' element={<LeaveRequest/>} />
          <Route path='/leaverequestapprove' element={<LeaveRequestApprove/>} />
          <Route path='/holiday' element={<Holiday/>} />
          <Route path='/addholiday' element={<AddHoliday/>} />
          <Route path='/updateholiday/:id' element={<UpdateHoliday/>} />
          <Route path='/payroll' element={<Payroll/>} />
          <Route path='/addpayroll' element={<AddPayroll/>} />
          <Route path='/updatepayroll' element={<UpdatePayroll/>} />
          <Route path='/appraisal' element={<Appraisal/>} />
          <Route path='/addappraisal' element={<AddAppraisal/>} />
          <Route path='/updateappraisal/:id' element={<UpdateAppraisal/>} />
          <Route path='/monthlyreport' element={<MonthlyReport/>} />
          <Route path='/addmonthlyreport' element={<AddMonthlyReport/>} />
          <Route path='/updatemonthlyreport' element={<UpdateMonthlyReport/>} />
          <Route path='/roles' element={<Roles/>} />
          <Route path='/addroles' element={<AddRoles/>} />
          <Route path='/updateroles/:id' element={<UpdateRoles/>} />
          <Route path='/permission' element={<Permission/>} />
          <Route path='/addpermission' element={<AddPermission/>} />
          <Route path='/updatepermission/:id' element={<UpdatePermission/>} />
          <Route path='/accesscontrol' element={<AccessControl/>} />


          <Route path='/bankaccount' element={<BankAccount/>} />
          <Route path='/addbankaccount' element={<AddBankAccount/>} />
          <Route path='/updatebankaccount/:id' element={<UpdateBankAccount/>} />
          <Route path='/testcodes' element={<TestCodes/>} />

        </Routes> 
      </BrowserRouter>

    

    </>
  );
}

export default App;

