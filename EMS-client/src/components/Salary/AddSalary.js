import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './AddSalary.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";


const AddSalary = () => {
 

  var token = localStorage.getItem('token');
  token = token.replace(/^"(.*)"$/, '$1');

  

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
    // window.location.reload()


    // navigate1('/addcompany')

    // const handleStorageChange = () => {
    //   if (localStorage.getItem("lang") !== lang) {


    //   }
    // };

    // window.addEventListener("storage", handleStorageChange);

    // return () => {
    //   window.removeEventListener("storage", handleStorageChange);
    // };
  },[]);

 

  const [salaryType, setSalaryType] = useState('')
  const [amount, setAmount] = useState('')
  const [payAs, setPayAs] = useState('')
  const [payType, setPayType] = useState('')
  const [data, setData] = useState('')


  const navigate = useNavigate();
 

  function addMySalary(e) {
    console.log(salaryType,amount,payAs,payType)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    var raw = JSON.stringify({
      "companyId": "64490e4f9fc32034188515f7",
      "salaryType": salaryType,
      "amount": amount,
      "payAs": payAs,
      "payType": payType
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:3000/dev/add_company_salary", requestOptions)
      .then(response => response.json())
      .then(result => {
        setData([result])
        if (result.res_code === 1) {
         
          alert(` ${result.res_message} `
          )
          navigate('/salary')
        } else {
          alert(` ${result.res_message} `)
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
                <h1>{languageData.addsalary}</h1>
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
                    <h3 className="card-title"><b>{languageData.salarydetail}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label>{languageData.salarytype}</label>
                        <input type="text" className="form-control" 
                          placeholder={languageData.entersalary}
                          onChange={(e) => setSalaryType(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>{languageData.amount}</label>
                        <input type="text" className="form-control" 
                          placeholder={languageData.enteramount}
                          onChange={(e) => setAmount(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>{languageData.amounttype}</label>
                        <input type="text" className="form-control" 
                          placeholder={languageData.enteramount}
                          onChange={(e) => setPayAs(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>{languageData.paytype}</label>
                        <input type="text" className="form-control" 
                          placeholder={languageData.enteramounttype}
                          onChange={(e) => setPayType(e.target.value)} />
                      </div>
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
          <button type="button" class="btn btn-primary submitbtn" onClick={addMySalary}><b>{languageData.submit}</b></button>
          <Link to='/salary'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
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

export default AddSalary