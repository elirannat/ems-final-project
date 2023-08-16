import React, { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import './Navbar.css'

const Navbar = () => {

 
    
  const { i18n } = useTranslation();
    function handleChangeLanguage(lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang)
      window.location.reload()


    }
  return (
    <>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="https://www.google.com/" role="button"><i className="fas fa-bars" /></a>
          </li>
          {/* <li className="nav-item d-none d-sm-inline-block">
      <a href="index3.html" className="nav-link">Home</a>
    </li> */}
          {/* <li className="nav-item d-none d-sm-inline-block">
      <a href="https://www.google.com/" className="nav-link">Contact</a>
    </li> */}
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* <li className="nav-item dropdown dropleft">
            <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle"><i className="fa-solid fa-globe"></i></a>
            <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">
            <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("en")} type="button"><span class="flag-icon flag-icon-us me-1"></span>English</button></center></li>
          <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("hi")} >हिंदी</button></center></li>
           <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("gu")} type="button">ગુજરાતી</button></center></li>
              <li className="dropdown-divider" />
             
              End Level two
            </ul>
          </li> */}

          {/* Navbar Search */}
          {/* <li className="nav-item">
      <a className="nav-link" data-widget="navbar-search" href="https://www.google.com/" role="button">
        <i className="fas fa-search" />
      </a>
      <div className="navbar-search-block">
        <form className="form-inline">
          <div className="input-group input-group-sm">
            <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
            <div className="input-group-append">
              <button className="btn btn-navbar" type="submit">
                <i className="fas fa-search" />
              </button>
              <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </li> */}
          {/* Messages Dropdown Menu */}
          {/* <li className="nav-item dropdown">
      <a className="nav-link" data-toggle="dropdown" href="https://www.google.com/">
        <i className="fa-solid fa-globe" />
      </a>
      <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <a href="https://www.google.com/" className="dropdown-item">
          Message Start
          <div className="media">
            <img src="dist/img/user1-128x128.jpg" alt="User Avatar" className="img-size-50 mr-3 img-circle" />
            <div className="media-body">
              <h3 className="dropdown-item-title">
                Brad Diesel
                <span className="float-right text-sm text-danger"><i className="fas fa-star" /></span>
              </h3>
              <p className="text-sm">Call me whenever you can...</p>
              <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
            </div>
          </div>
          Message End
        </a>
        <div className="dropdown-divider" />
        <a href="https://www.google.com/" className="dropdown-item">
          Message Start
          <div className="media">
            <img src="dist/img/user8-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3" />
            <div className="media-body">
              <h3 className="dropdown-item-title">
                John Pierce
                <span className="float-right text-sm text-muted"><i className="fas fa-star" /></span>
              </h3>
              <p className="text-sm">I got your message bro</p>
              <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
            </div>
          </div>
          Message End
        </a>
        <div className="dropdown-divider" />
        <a href="https://www.google.com/" className="dropdown-item">
          Message Start
          <div className="media">
            <img src="dist/img/user3-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3" />
            <div className="media-body">
              <h3 className="dropdown-item-title">
                Nora Silvester
                <span className="float-right text-sm text-warning"><i className="fas fa-star" /></span>
              </h3>
              <p className="text-sm">The subject goes here</p>
              <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
            </div>
          </div>
          Message End
        </a>
        <div className="dropdown-divider" />
        <a href="https://www.google.com/" className="dropdown-item dropdown-footer">See All Messages</a>
      </div>
    </li> */}

          {/* <div className="btn-group dropleft languagebtn">
        <button type="button" className="btn  dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i className="fa-solid fa-globe"></i>
        </button>
        <div className="dropdown-menu  dropdown-menu-left">
            <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("en")} type="button"><span class="flag-icon flag-icon-us me-1"></span>English</button></center></li>
          <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("hi")} >हिंदी</button></center></li>
           <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("gu")} type="button">ગુજરાતી</button></center></li> */}
          {/* <a className="dropdown-item" href="#">English</a>
          <a className="dropdown-item" href="#">Hindi</a>
          <a className="dropdown-item" href="#">Gujarati</a>
          <div className="dropdown-divider" />
          <a className="dropdown-item" href="#">Separated link</a> */}
          {/* </div>
      </div> */}
          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            {/* <a className="nav-link" data-toggle="dropdown" href="https://www.google.com/">
        <i className="far fa-bell" />
        <span className="badge badge-warning navbar-badge">15</span>
      </a> */}
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">15 Notifications</span>
              <div className="dropdown-divider" />
              {/* <a href="https://www.google.com/" className="dropdown-item">
          <i className="fas fa-envelope mr-2" /> 4 new messages
          <span className="float-right text-muted text-sm">3 mins</span>
        </a> */}
              <div className="dropdown-divider" />
              {/* <a href="https://www.google.com/" className="dropdown-item">
          <i className="fas fa-users mr-2" /> 8 friend requests
          <span className="float-right text-muted text-sm">12 hours</span>
        </a> */}
              <div className="dropdown-divider" />
              {/* <a href="https://www.google.com/" className="dropdown-item">
          <i className="fas fa-file mr-2" /> 3 new reports
          <span className="float-right text-muted text-sm">2 days</span>
        </a> */}
              <div className="dropdown-divider" />
              {/* <a href="https://www.google.com/" className="dropdown-item dropdown-footer">See All Notifications</a> */}
            </div>
          </li>
          <li className="nav-item">
            {/* <a className="nav-link" data-widget="fullscreen" href="https://www.google.com/" role="button">
        <i className="fas fa-expand-arrows-alt" />
      </a> */}
          </li>
          <li className="nav-item">
            {/* <a className="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="https://www.google.com/" role="button">
        <i className="fas fa-th-large" />
      </a> */}
          </li>
        </ul>
      </nav>
      {/* /.navbar */}

    </>
  )
}

export default Navbar