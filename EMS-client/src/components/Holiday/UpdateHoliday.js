import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './UpdateHoliday.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const UpdateHoliday = () => {


   //get token from localStorage and pass dynamically in API
   var token = localStorage.getItem('token');
   token = token.replace(/^"(.*)"$/, '$1');
   //get token from localStorage and pass dynamically in API

  //get companyId from localStorage and pass dynamically in API
  var SimpleComapnyId = localStorage.getItem('companyId')
  var companyId = SimpleComapnyId.replace(/^"(.*)"$/, '$1');
  //get companyId from localStorage and pass dynamically in API


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

  }, []);



  const [leave, setLeave] = useState('')

  const navigate = useNavigate();

  const [holidayName, setHolidayName] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [data, setData] = useState('')

  const params = useParams();



  useEffect(() => {
    getHolidayList()
    console.log(params)

  }, [])

  const getHolidayList = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = "";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/editcompanyholidayid/${params.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setHolidayName(result.holidayName)
        setDateFrom(result.dateFrom)
        setDateTo(result.dateTo)
      })
      .catch(error => console.log('error', error));
  }

  function UpdateMyHoliday() {
    console.log(holidayName, dateFrom, dateTo)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      "_id":params.id,
      "holidayName": holidayName,
      "dateFrom": dateFrom,
      "dateTo": dateTo,
      "companyId": companyId,
      "status": "active"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/edit_holiday", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setData(result)
        alert(` ${result.res_message} `)
        if (result.res_code === 1) {
          navigate('/holiday')
        } else {
          alert("An Error Occured")
        }
      })
      .catch(error => console.log('error', error));
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{languageData.updateholiday}</h1>
              </div>
              <div className="col-sm-6">
                {/* <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">General Form</li>
                </ol> */}
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}
              <div className="col-md-10">
                {/* /.card */}
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.holidaydetails}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.holidayname}</label>
                        <input type="text" className="form-control"
                          placeholder={languageData.enterholidayname}
                          value={holidayName}
                          onChange={(e) => setHolidayName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.datefrom}</label>
                        <input type="text" className="form-control"
                          placeholder={languageData.enterdatefrom}
                          value={new Date(dateFrom).toLocaleDateString("en-GB")}
                          onChange={(e) => setDateFrom(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.dateto}</label>
                        <input type="text" className="form-control"
                          placeholder={languageData.enterdateto}
                          value={new Date(dateTo).toLocaleDateString("en-GB")}
                          onChange={(e) => setDateTo(e.target.value)} />
                      </div>
                     
                    </div>
               
                  </form>
                </div>

               
              </div>
              
              
            </div>

          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
        {/* /.content-wrapper */}
        <div className="btnss">
          <button type="button" class="btn btn-primary submitbtn" onClick={UpdateMyHoliday} ><b>{languageData.submit}</b></button>
          <Link to='/holiday'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
        </div>
      </div>
  




      <Footer />



    </>
  )
}

export default UpdateHoliday