import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const Sidebar = () => {
  const [languageData, setLanguageData] = useState(en);
  // var getCompanyName = localStorage.getItem('companyName');
  // var cleanedCompanyName = getCompanyName.replace(/^"(.*)"$/, '$1'); // Removes double quotes if present


  // var companyName = getCompanyName.companyName;
  // console.log("Company Name is ", cleanedCompanyName);


  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    switch (lang) {
      case "hi":
        setLanguageData(hi);
        break;
      case "gu":
        setLanguageData(gu);
        break;
      default:
        setLanguageData(en);
        break;
    }
  }, []);


  // const navigate1 = useNavigate();
  // function logout() {
  //   // console.log('clicked on logout')
  //   // localStorage.clear()
  //   // console.log('localstorage is cleared')
  //   navigate1('/');
  //   // console.log('navigation called')
  // }

  return (
    <>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <div className="brand-link">
          <img src="/dist/img/Logo1.png " alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">Eliran pvt ltd</span>
        </div >
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="dist/img/user2-160x160.jpg " className="img-circle elevation-2" alt="User Img" />
      </div>
      <div className="info">
        <Link to="#" className="d-block">Jignesh Pabari</Link>
      </div>
    </div> */}
          {/* SidebarSearch Form */}
          {/* <div className="form-inline">
      <div className="input-group" data-widget="sidebar-search">
        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
          <button className="btn btn-sidebar">
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div> */}
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item ">
                <Link to="/dashboard" className="nav-link ">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  &nbsp;<p className='dashboard'>
                    {languageData.dashboard}
                    {/* <i className="right fas fa-angle-left" /> */}
                  </p>
                </Link>
              </li>
              {/* <li className="nav-item menu-open">
          <Link to="/company" className="nav-link ">
            <i className="nav-icon fas fa-tachometer-alt" />
            &nbsp;<p className='dashboard'>
            {languageData.company}
              <i className="right fas fa-angle-left" />
            </p>
          </Link>
        </li> */}
              {/* <li className="nav-item ">
          <Link to="/companyconfigure" className="nav-link">
            <i className="nav-icon fas fa-building" />
            <p>
            {languageData.companyconfiguration}
              <span className="right badge badge-danger">New</span>
            </p>
          </Link>
        </li> */}
              <li className="nav-item">
                <Link to="/employee" className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p>
                    {languageData.employee}
                    {/* <span className="right badge badge-danger">New</span> */}
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/leave" className="nav-link">
                  <i className="nav-icon fas fa-house" />
                  <p>
                    {languageData.leave}
                    {/* <span className="right badge badge-danger">New</span> */}
                  </p>
                </Link>
              </li>
              {/* <li className="nav-item">
          <Link to="/leaverequest" className="nav-link">
            <i className="nav-icon fas fa-house" />
            <p>
            {languageData.leaverequest}
              <span className="right badge badge-danger">New</span>
            </p>
          </Link>
        </li> */}
              <li className="nav-item">
                <Link to="/holiday" className="nav-link">
                  <i className="nav-icon fas fa-house" />
                  <p>
                    {languageData.holiday}
                    {/* <span className="right badge badge-danger">New</span> */}
                  </p>
                </Link>
              </li>
              {/* <li className="nav-item">
          <Link to="/payroll" className="nav-link">
            <i className="nav-icon fas fa-credit-card" />
            <p>
            {languageData.payroll}
              <span className="right badge badge-danger">New</span>
            </p>
          </Link>
        </li>
      
        <li className="nav-item">
          <Link to="/mysalary" className="nav-link">
            <i className="nav-icon fas fa-user" />
            <p>
            {languageData.mysalary}
              <i className="fas fa-angle-left right" />
              <span className="badge badge-info right">6</span>
            </p>
          </Link>

        </li> */}
              {/* <li className="nav-item">
          <Link to="/salary" className="nav-link">
            <i className="nav-icon fas fa-user" />
            <p>
            {languageData.salary}
              <i className="fas fa-angle-left right" />
              <span className="badge badge-info right">6</span>
            </p>
          </Link>

        </li> */}
              {/* <li className="nav-item">
          <Link to="/appraisal" className="nav-link">
            <i className="nav-icon fas fa-chart-pie" />
            <p>
            {languageData.appraisal}
              <i className="right fas fa-angle-left" />
            </p>
          </Link>
        </li> */}
              <li className="nav-item">
                <Link to="/bankaccount" className="nav-link">
                  <i className="nav-icon fas fa-chart-pie" />
                  <p>
                    {languageData.bankaccount}
                    {/* <i className="right fas fa-angle-left" /> */}
                  </p>
                </Link>
              </li>


              <li className="nav-item">
                <Link to='/roles' className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p
                  // onClick={logout}
                  >
                    {languageData.roles}
                    {/* <i className="fas fa-angle-left right" /> */}
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/permission' className="nav-link">
                  <i className="nav-icon fas fa-lock" />
                  <p
                  // onClick={logout}
                  >
                    {languageData.permissions}
                    {/* <i className="fas fa-angle-left right" /> */}
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/accesscontrol' className="nav-link">
                  <i className="nav-icon fas fa-universal-access" />
                  <p
                  // onClick={logout}
                  >
                    {languageData.accesscontrol}
                    {/* <i className="fas fa-angle-left right" /> */}
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/' className="nav-link">
                  <i className="nav-icon fas fa-sign-out" />
                  <p
                  // onClick={logout}
                  >
                    {languageData.logout}
                    {/* <i className="fas fa-angle-left right" /> */}
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>

    </>
  )
}

export default Sidebar
