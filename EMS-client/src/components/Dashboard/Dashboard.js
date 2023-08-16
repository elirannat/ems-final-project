import { loadLanguages } from 'i18next'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const Dashboard = () => {
//Pass the token from Local storage
var token = localStorage.getItem('token');
 var token = token.replace(/^"(.*)"$/, '$1');
//Pass the token from Local storage


  // useEffect(() => {

    
  //   console.log(emailName)
  // }, [])
  const isFirstRender = useRef(true);

  const [languageData, setLanguageData] = useState(en);
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

  })
  useEffect(() => {
    // Check if the page has been refreshed.
    if (!window.location.href.includes('?refreshed')) {
      // Reload the page.
      window.location.href = `${window.location.href}?refreshed`;
    }
  }, []);

  var email = localStorage.getItem('email')
  var emailName = email.replace(/^"(.*)"$/, '$1');


  function getCompanyByEmail() {
    
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/companybyemail/${emailName}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log("ComapnyId is ",result.res_data.tokenData.userData)
        // setData(result)
        console.log(result)
        if (result) {
          const companyId = result.companyId;
          const companyName = result.companyName
          console.log("compantId is ", companyId);
          console.log("companyName is ",companyName);
          // Continue with your desired logic here
        // if (result.res_code === 1) {
          // alert('Login Success')
          
          // localStorage.setItem('user', JSON.stringify(result))
          localStorage.setItem('companyId', JSON.stringify(companyId))
          localStorage.setItem('result001', JSON.stringify(result))
          localStorage.setItem('companyName', JSON.stringify(companyName))  
          // localStorage.setItem('tokenType', JSON.stringify(result.res_data.tokenData.tokenType))
          // localStorage.setItem('email', JSON.stringify(result.res_data.userData.email))
          // console.log(result.res_data.tokenData.accessToken)
          
          // localStorage.setItem('user',JSON.stringify(result))
          // navigate('/dashboard')
        } else {
          alert('An error Occured')
        }

      }
      )
      .catch(error => console.log('error', error));

  }
  getCompanyByEmail()
  


  return (
    <>
      <Navbar />
      <Sidebar />
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">{languageData.dashboard}</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  {/* <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
            <li className="breadcrumb-item active">Dashboard v1</li> */}
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Small boxes (Stat box) */}
            <div className="row">
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>100</h3>
                    <p>{languageData.employee}</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-bag" />
                  </div>
                  {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>18</h3>
                    <p> {languageData.newmployee}</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-stats-bars" />
                  </div>
                  {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
                </div>
              </div>
              {/* ./col */}
              {/* small box */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>10</h3>
                    <p>{languageData.leaverequest}</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-person-add" />
                  </div>
                  {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-3 col-6">
                {/* small box */}
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>4</h3>
                    <p>{languageData.employeeresign}</p>
                  </div>
                  <div className="icon">
                    <i className="ion ion-pie-graph" />
                  </div>
                  {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
                </div>
              </div>
              {/* ./col */}
            </div>

          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}

      <Footer />
    </>
  )
}

export default Dashboard