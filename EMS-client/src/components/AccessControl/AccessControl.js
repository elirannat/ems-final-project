import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from "../Sidebar/Sidebar";
import './AccessControl.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";



const AccessControl = () => {

    //get token from localStorage and pass dynamically in API
    var token = localStorage.getItem('token');
    token = token.replace(/^"(.*)"$/, '$1');
    //get token from localStorage and pass dynamically in API
    
    //get companyId from localStorage and pass dynamically in API
    var SimpleComapnyId = localStorage.getItem('companyId')
    var companyId = SimpleComapnyId.replace(/^"(.*)"$/, '$1');
    //get companyId from localStorage and pass dynamically in API


  const navigate = useNavigate();


  //Language Section
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

  });

  function submit() {

    alert('Permission Successfully assigned the selected role !')

    navigate('/dashboard')

  }
  
  //Language Section

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1></h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  {/* <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Advanced Form</li> */}
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">



            <div className="row">
              {/* <div className="col-md-6">
                </div> */}
              {/* /.col (left) */}
              <div className="col-md-10">

                {/* /.card */}
                {/* iCheck */}
                <div className="card card-success">
                  <div className="card-header">
                    <h1>{languageData.rolepermission}</h1>
                  </div>

                  <div className="card-body">
                    <div className="main">
                    <label>{languageData.rolename}</label>
                        <select className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option value="hr">HR</option>
                          <option value="manager">Manager</option>
                          <option value="AdminUser">Admin User</option>

                        </select>
                        <br />
                      <div className="yagnesh">
                        <input className="bikes" type="checkbox" id="vehicle1" name="vehicle1" defaultValue="Bike" />
                        <label className="employee" htmlFor="vehicle1">{languageData.addemployee}</label><br />
                        <input type="checkbox" id="vehicle2" name="vehicle2" defaultValue="Car" />
                        <label className="updateuser" htmlFor="vehicle2">{languageData.updateuser}</label><br />
                        <input type="checkbox" id="vehicle3" name="vehicle3" defaultValue="Boat" />
                        <label className="updateuser" htmlFor="vehicle3"> {languageData.updateuser}  </label><br /><br />
                      </div>
                      <div className="yagnesh">
                        <input type="checkbox" id="vehicle4" name="vehicle4" defaultValue="Bike" />
                        <label className="deleteuser" htmlFor="vehicle4">{languageData.deleteuser}</label><br />
                        <input type="checkbox" id="vehicle5" name="vehicle5" defaultValue="Car" />
                        <label  className="deleteuser" htmlFor="vehicle5"> {languageData.addholiday}</label><br />
                        <input type="checkbox" id="vehicle6" name="vehicle6" defaultValue="Boat" />
                        <label  className="deleteuser" htmlFor="vehicle6"> {languageData.deleteuser}</label><br /><br />
                      </div>

                    </div>


                  </div>


                  {/* /.card-body */}
                  {/* <div className="card-footer">
                      Many more skins available. <a href="https://bantikyan.github.io/icheck-bootstrap/">Documentation</a>
                    </div> */}
                </div>
                {/* /.card */}
                {/* Bootstrap Switch */}

                {/* /.card */}
              </div>
              {/* /.col (right) */}
            </div>

          </div>
          {/* /.container-fluid */}
        </section>
        <div className="btnss">
          <button type="button" class="btn btn-primary submitbtn" onClick={submit}><b>{languageData.submit}</b></button>
          <Link to='/dashboard'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
        </div>

        {/* /.content */}
      </div>


      {/* Content Wrapper. Contains page content */}

      {/* test form */}

      {/* <form>
                  Select image to upload:
                  <input type="file" name="image" id="image" />
                  <button onClick={handleUpload}>Upload</button>
              </form> */}




      {/* test form */}


      <Footer />



    </>
  )
}

export default AccessControl