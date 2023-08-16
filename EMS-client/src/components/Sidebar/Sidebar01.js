import React from 'react'
import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const Sidebar01 = () => {
  const [languageData, setLanguageData] = useState(en);
  useEffect(()=>{
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
    

  })
 
 const navigate =  useNavigate()
 
 function logout(){
  localStorage.clear()
  navigate('/')

}
  return (
    <>
   {/* Main Sidebar Container */}
<aside className="main-sidebar sidebar-dark-primary elevation-4">
  {/* Brand Logo */}
  <div className="brand-link">
    <img src="dist/img/Logo1.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
    <span className="brand-text font-weight-light">eTechmavens</span>
  </div >
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Img" />
      </div>
      <div className="info">
        <Link to="#" className="d-block">Jignesh Pabari</Link>
      </div>
    </div>
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
        <li className="nav-item menu-open">
          <Link to="/dashboard" className="nav-link ">
            <i className="nav-icon fas fa-tachometer-alt" />
            &nbsp;<p className='dashboard'>
            {languageData.dashboard}
              {/* <i className="right fas fa-angle-left" /> */}
            </p>
          </Link>
          {/* <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="/company" className="nav-link ">
                <i className="far fa-building nav-icon" />
                <p>Company</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/user" className="nav-link">
                <i className="far fa-user nav-icon" />
                <p>Users</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="leave" className="nav-link">
                <i className="fas fa-user nav-icon" />
                <p>Leave</p>
              </Link>
            </li>
          </ul> */}
        </li>
        <li className="nav-item">
          <Link to="/company" className="nav-link">
            <i className="nav-icon fas fa-building" />
            <p>
            {languageData.company}
              {/* <span className="right badge badge-danger">New</span> */}
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/user" className="nav-link">
            <i className="nav-icon fas fa-user" />
            <p>
            {languageData.user}
              {/* <span className="right badge badge-danger">New</span> */}
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/leave" className="nav-link">
            <i className="nav-icon fas fa-home" />
            <p>
            {languageData.leave}
              {/* <span className="right badge badge-danger">New</span> */}
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/salary" className="nav-link">
            <i className="nav-icon fas fa-plane" />
            <p>
            {languageData.salary}
              {/* <span className="right badge badge-danger">New</span> */}
            </p>
          </Link>
        </li>
      
        <li className="nav-item">
          <Link to="/admin" className="nav-link">
            <i className="nav-icon fas fa-user" />
            <p>
            {languageData.adminuser}
              {/* <i className="fas fa-angle-left right" /> */}
              {/* <span className="badge badge-info right">6</span> */}
            </p>
          </Link>
          {/* <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/layout/top-nav.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Top Navigation</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/top-nav-sidebar.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Top Navigation + Sidebar</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/boxed.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Boxed</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/fixed-sidebar.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Fixed Sidebar</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/fixed-sidebar-custom.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Fixed Sidebar <small>+ Custom Area</small></p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/fixed-topnav.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Fixed Navbar</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/fixed-footer.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Fixed Footer</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/layout/collapsed-sidebar.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Collapsed Sidebar</p>
              </Link>
            </li>
          </ul> */}
        </li>
        <li className="nav-item">
          <Link to="/log" className="nav-link">
            <i className="nav-icon fas fa-chart-pie" />
            <p>
            {languageData.logmanagement}
              {/* <i className="right fas fa-angle-left" /> */}
            </p>
          </Link>
          {/* <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/charts/chartjs.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>ChartJS</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/charts/flot.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Flot</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/charts/inline.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Inline</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/charts/uplot.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>uPlot</p>
              </Link>
            </li>
          </ul> */}
        </li>
        <li className="nav-item">
          <Link className="nav-link">
            <i className="nav-icon fas fa-angle-left" />
            <p onClick={logout}>
            {languageData.logout}
              {/* <i className="fas fa-angle-left right" /> */}
            </p>
          </Link>
          {/* <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/UI/general.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>General</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/icons.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Icons</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/buttons.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Buttons</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/sliders.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Sliders</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/modals.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Modals &amp; Alerts</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/navbar.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Navbar &amp; Tabs</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/timeline.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Timeline</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/UI/ribbons.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Ribbons</p>
              </Link>
            </li>
          </ul> */}
        </li>
        {/* <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Forms
              <i className="fas fa-angle-left right" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/forms/general.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>General Elements</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/forms/advanced.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Advanced Elements</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/forms/editors.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Editors</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/forms/validation.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Validation</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon fas fa-table" />
            <p>
              Tables
              <i className="fas fa-angle-left right" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/tables/simple.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Simple Tables</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/tables/data.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>DataTables</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/tables/jsgrid.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>jsGrid</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-header">EXAMPLES</li>
        <li className="nav-item">
          <Link to="pages/calendar.html" className="nav-link">
            <i className="nav-icon far fa-calendar-alt" />
            <p>
              Calendar
              <span className="badge badge-info right">2</span>
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="pages/gallery.html" className="nav-link">
            <i className="nav-icon far fa-image" />
            <p>
              Gallery
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="pages/kanban.html" className="nav-link">
            <i className="nav-icon fas fa-columns" />
            <p>
              Kanban Board
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon far fa-envelope" />
            <p>
              Mailbox
              <i className="fas fa-angle-left right" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/mailbox/mailbox.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Inbox</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/mailbox/compose.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Compose</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/mailbox/read-mail.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Read</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon fas fa-book" />
            <p>
              Pages
              <i className="fas fa-angle-left right" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/examples/invoice.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Invoice</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/profile.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Profile</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/e-commerce.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>E-commerce</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/projects.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Projects</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/project-add.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Project Add</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/project-edit.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Project Edit</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/project-detail.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Project Detail</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/contacts.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Contacts</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/faq.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>FAQ</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/contact-us.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Contact us</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon far fa-plus-square" />
            <p>
              Extras
              <i className="fas fa-angle-left right" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>
                  Login &amp; Register v1
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="pages/examples/login.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Login v1</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="pages/examples/register.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Register v1</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="pages/examples/forgot-password.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Forgot Password v1</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="pages/examples/recover-password.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Recover Password v1</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>
                  Login &amp; Register v2
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="pages/examples/login-v2.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Login v2</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="pages/examples/register-v2.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Register v2</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="pages/examples/forgot-password-v2.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Forgot Password v2</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="pages/examples/recover-password-v2.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Recover Password v2</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/lockscreen.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Lockscreen</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/legacy-user-menu.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Legacy User Menu</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/language-menu.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Language Menu</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/404.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Error 404</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/500.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Error 500</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/pace.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Pace</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/examples/blank.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Blank Page</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="starter.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Starter Page</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon fas fa-search" />
            <p>
              Search
              <i className="fas fa-angle-left right" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="pages/search/simple.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Simple Search</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="pages/search/enhanced.html" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Enhanced</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-header">MISCELLANEOUS</li>
        <li className="nav-item">
          <Link to="iframe.html" className="nav-link">
            <i className="nav-icon fas fa-ellipsis-h" />
            <p>Tabbed IFrame Plugin</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="https://adminlte.io/docs/3.1/" className="nav-link">
            <i className="nav-icon fas fa-file" />
            <p>Documentation</p>
          </Link>
        </li>
        <li className="nav-header">MULTI LEVEL EXAMPLE</li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="fas fa-circle nav-icon" />
            <p>Level 1</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon fas fa-circle" />
            <p>
              Level 1
              <i className="right fas fa-angle-left" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Level 2</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>
                  Level 2
                  <i className="right fas fa-angle-left" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="#" className="nav-link">
                    <i className="far fa-dot-circle nav-icon" />
                    <p>Level 3</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link">
                    <i className="far fa-dot-circle nav-icon" />
                    <p>Level 3</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link">
                    <i className="far fa-dot-circle nav-icon" />
                    <p>Level 3</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <i className="far fa-circle nav-icon" />
                <p>Level 2</p>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="fas fa-circle nav-icon" />
            <p>Level 1</p>
          </Link>
        </li>
        <li className="nav-header">LABELS</li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon far fa-circle text-danger" />
            <p className="text">Important</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon far fa-circle text-warning" />
            <p>Warning</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link">
            <i className="nav-icon far fa-circle text-info" />
            <p>Informational</p>
          </Link>
        </li> */}
      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

    </>
  )
}

export default Sidebar01