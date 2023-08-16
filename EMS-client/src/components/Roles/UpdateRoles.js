import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './UpdateRoles.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";


const UpdateRoles = () => {

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



  // const [salary, setSalary] = useState('')

  const navigate = useNavigate();


  const [data, setData] = useState('')

  const [roleName, setRoleName] = useState('')
  const [description, setDescription] = useState('')

  const params = useParams();



  useEffect(() => {
    getRolesList()
    console.log(params)

  }, [])

  const getRolesList = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = "";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/editroleid/${params.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setRoleName(result.roleName)
        setDescription(result.description)

      })
      .catch(error => console.log('error', error));
  }

  function UpdateRole() {
    console.log(roleName, description)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      "_id": params.id,
      "roleName": roleName,
      "description": description,
      "status": 'active',
      "companyId": companyId
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/edit_role", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setData(result)
        alert(` ${result.res_message} `)
        if (result.res_code === 1) {
          navigate('/roles')
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
                <h1>{languageData.updaterole}</h1>
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
                    <h3 className="card-title"><b>{languageData.roledetails}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.rolename}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterrolename}
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.description}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterdescription}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)} />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.updatesalary}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterpayas}
                          value={payAs}
                          onChange={(e) => setPayAs(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.updatesalary}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterpaytype}
                          value={payType}
                          onChange={(e) => setPayType(e.target.value)} />
                      </div> */}
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.address02}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteraddress02}
                          onChange={(e) => setAddress02(e.target.value)} />
                      </div> */}
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.landmark}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterlandmark}
                          onChange={(e) => setLandmark(e.target.value)} />
                      </div> */}
                      {/* <div className="row">
                        <div className="col-sm-6">
                          text input
                          <div className="form-group">
                            <label>{languageData.country}</label>
                            <input type="text" className="form-control" placeholder={languageData.country}
                              onChange={(e) => setSelectedCountry(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.state}</label>
                            <input type="text" className="form-control" placeholder={languageData.state}
                              onChange={(e) => setSelectedState(e.target.value)} />
                          </div>
                        </div>
                      </div> */}
                      {/* <div className="row">
                        <div className="col-sm-6">
                        
                          <div className="form-group">
                            <label>{languageData.city}</label>
                            <input type="text" className="form-control" placeholder={languageData.city}
                              onChange={(e) => setSelectedCity(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.pin}</label>
                            <input type="number" className="form-control" placeholder={languageData.enterpin}
                              onChange={(e) => setPin(e.target.value)} />
                          </div>
                        </div>
                      </div> */}

                      {/* <div className="form-group citypin">
                        <label htmlFor="exampleInputEmail1">City </label>
                        <input type="email" className="city" placeholder="Select City" />

                        <label htmlFor="exampleInputEmail1" className="pin1">Pin </label>
                        <input type="email" className="pin" placeholder="Enter Pin" />
                      </div>
                      <div className="form-group statecountry">
                        <label htmlFor="exampleInputEmail1" className="state1">State</label>
                        <input type="email" className="state" placeholder="Select City" />

                        <label htmlFor="exampleInputEmail1" className="country1">Country</label>
                        <input type="email" className="country" placeholder="Enter Pin" />
                      </div> */}
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Detail</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div> */}
                      {/* <div className="form-group"> */}
                      {/* <label htmlFor="exampleInputEmail1">Company Name</label> */}
                      {/* <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" /> */}
                      {/* </div> */}
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                      </div> */}

                    {/* <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                      </div> */}
                    {/* /.card-body */}

                    {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
                  </form>
                </div>

                {/* /.card */}
                {/* Input addon */}

                {/* /.card */}
                {/* Horizontal Form */}

                {/* /.card */}
              </div>
              {/*/.col (left) */}
              {/* right column */}
              {/* <div className="col-md-6"> */}
              {/* <div className="card card-primary"> */}
              {/* <div className="card-header">
                    <h3 className="card-title"><b>{languageData.otherdetail}</b></h3>
                  </div> */}
              {/* /.card-header */}
              {/* form start */}
              {/* <form> */}
              {/* <div className="card-body othercard"> */}
              {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.email}</label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.mobile}</label>
                        <input type="number" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          onChange={(e) => setMobile(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.website}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          onChange={(e) => setWebsite(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.otherdetail}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          onChange={(e) => setOther(e.target.value)} />
                      </div>
                      <div className="form-group">
                        {/* <label htmlFor="exampleInputEmail1">Company Name</label> */}
              {/* <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" /> */}
              {/* </div>  */}
              {/* </div> */}
              {/* <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                      </div> */}

              {/* <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                      </div> */}
              {/* /.card-body */}

              {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
              {/* </form> */}
            </div>

            {/* general form elements disabled */}

            {/* <div className="card card-primary"> */}
            {/* <div className="card-header"> */}
            {/* <h3 className="card-title"><b>{languageData.taxdetail}</b></h3> */}
            {/* </div> */}
            {/* /.card-header */}
            {/* form start */}
            {/* <form>
                    <div className="card-body taxbody ">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.gstno}:-</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.gstno}
                          onChange={(e) => setGstno(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.othertax01} :-</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.othertax01}
                          onChange={(e) => setOtherTax01(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.othertax02} :-</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.othertax02}
                          onChange={(e) => setOtherTax02(e.target.value)} />
                      </div> */}
            {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Detail</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div> */}
            {/* <div className="form-group"> */}
            {/* <label htmlFor="exampleInputEmail1">Company Name</label> */}
            {/* <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" /> */}
            {/* </div>
                    </div> */}
            {/* <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                      </div> */}

            {/* <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                      </div> */}
            {/* /.card-body */}

            {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
            {/* </form>
                </div> */}






            {/* /.card */}
            {/* </div> */}
            {/*/.col (right) */}
            {/* </div> */}
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
        {/* /.content-wrapper */}
        <div className="btnss">
          <button type="button" class="btn btn-primary submitbtn" onClick={UpdateRole} ><b>{languageData.submit}</b></button>
          <Link to='/roles'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
        </div>
      </div>
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

export default UpdateRoles