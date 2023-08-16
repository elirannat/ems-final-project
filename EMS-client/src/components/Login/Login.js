import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import { useTranslation } from "react-i18next";
import './Login.css'

const Login = () => {
  // useEffect(() => {
  //   localStorage.getItem('lang') 

  // }, [])

  const { t } = useTranslation(); 

  const navigate = useNavigate();
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState('')
  // useEffect(() => {

  //   if(localStorage.getItem('user')){
  //   navigate('/dashboard')  
  //   }

  // }, [])

  const loggedIn = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "ci_etmpayroll_web");
    urlencoded.append("client_secret", "cs_etmpayroll_web");
    urlencoded.append("username", userName);
    urlencoded.append("password", password);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/login", requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log("ComapnyId is ",result.res_data.tokenData.userData)
        setData(result)
        console.log(result)
        if (result.res_code === 1) {
          alert('Login Success')
          
          localStorage.setItem('user', JSON.stringify(result))
          localStorage.setItem('token', JSON.stringify(result.res_data.tokenData.accessToken))
          localStorage.setItem('tokenType', JSON.stringify(result.res_data.tokenData.tokenType))
          localStorage.setItem('email', JSON.stringify(result.res_data.userData.email))
          localStorage.setItem('companyName', JSON.stringify(result.res_data.userData.companyName))
          console.log(result.res_data.tokenData.accessToken)
          
          // localStorage.setItem('user',JSON.stringify(result))
          navigate('/dashboard')
        } else {
          alert('An error Occured')
        }

      }
      )
      .catch(error => console.log('error', error));

    // console.log(data)
    // let resp = JSON.stringify(data)
    // if(resp === 1){
    //   navigate('/dashboard')
    // }else{
    //   console.log('An error Occured')
    // }
  }

  function LanguageSelector() {
    const { i18n } = useTranslation();

    function handleChangeLanguage(lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang)


    }

    return (
      // <div className="dropdown">
      //   <button className="btn dropdown-toggle" type="button" id="dropdownMenu2" data-mdb-toggle="dropdown" aria-expanded="false">
      //   Language &nbsp;
      //   {/* <i className="fa-solid fa-globe"></i> */}
      //   </button>
      //   <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
      //     <li><button className="dropdown-item" onClick={() => handleChangeLanguage("en")} type="button">English</button></li>
      //     <li><button className="dropdown-item" onClick={() => handleChangeLanguage("hi")} >हिंदी</button></li>
      //     <li><button className="dropdown-item" onClick={() => handleChangeLanguage("gu")} type="button">ગુજરાતી</button></li>
      //   </ul>
      // </div>

      //  {/* Example single danger button */}
      <div className="btn-group dropleft languagebtn">
        <button type="button" className="btn  dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i className="fa-solid fa-globe"></i>
        </button>
        <div className="dropdown-menu  dropdown-menu-left">
            <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("en")} type="button"><span class="flag-icon flag-icon-us me-1"></span>English</button></center></li>
          <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("hi")} >हिंदी</button></center></li>
           <li><center><button className="dropdown-item" onClick={() => handleChangeLanguage("gu")} type="button">ગુજરાતી</button></center></li>
          {/* <a className="dropdown-item" href="#">English</a>
          <a className="dropdown-item" href="#">Hindi</a>
          <a className="dropdown-item" href="#">Gujarati</a>
          <div className="dropdown-divider" />
          <a className="dropdown-item" href="#">Separated link</a> */}
        </div>
      </div>


      // <div>
      //   <button onClick={() => handleChangeLanguage("en")}>English</button>
      //   <button onClick={() => handleChangeLanguage("hi")}>हिंदी</button>
      //   <button onClick={() => handleChangeLanguage("gu")}>ગુજરાતી</button>
      // </div>
    );
  }

  return (
    <>
      <div className="hold-transition login-page">
        <LanguageSelector />
        <div className="login-box">
          {/* /.login-logo */}
          <div className="card card-outline card-primary">
            <div className="card-header text-center">
              <a href="../../index2.html" className="h1"><b>Login</b></a>
            </div>
            <div className="card-body">
              {/* <p className="login-box-msg">Login to start your session</p> */}
              <form action="../../index3.html" method="post">
                <div className="input-group mb-3">
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="form-control" placeholder="Email" required />
                  <div className="input-group-append">
                    {/* <div className="input-group-text">
                <span className="fas fa-envelope" />
              </div> */}
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" required/>
                  <div className="input-group-append">
                    {/* <div className="input-group-text">
                <span className="fas fa-lock" />
              </div> */}
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-8">
                    <div className="icheck-primary">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">
                        {t("rememberme")}
                      </label>
                    </div>
                  </div> */}
                  {/* /.col */}
                  {/* <div className="col-4">
              <button type="submit" className="btn btn-primary btn-block">Sign In</button>
            </div> */}
                  {/* /.col */}
                </div>
              </form>
              <div className="social-auth-links text-center mt-2 mb-3">
                <button className="btn btn-primary login" onClick={loggedIn}>
                  {/* <i className="fab fa-facebook mr-2" />  */}
                  {t("login")}
                </button>
                {/* <a href="#" className="btn btn-block btn-danger">
            <i className="fab fa-google-plus mr-2" /> Sign in using Google+
          </a> */}
              </div>
              {/* /.social-auth-links */}
              {/* <p className="mb-1">
          <a href="forgot-password.html">I forgot my password</a>
        </p> */}
              {/* <p className="mb-0">
          <a href="register.html" className="text-center">Register a new membership</a>
        </p> */}
            </div>
            {/* /.card-body */}
          </div>
          {/* /.card */}
        </div>
        {/* /.login-box */}
      </div>



    </>
  )
}

export default Login