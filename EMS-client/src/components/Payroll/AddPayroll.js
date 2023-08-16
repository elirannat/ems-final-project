import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './AddPayroll.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";


const AddPayroll = () => {

  //get token from localStorage and pass dynamically in API
  var token = localStorage.getItem('token');
  token = token.replace(/^"(.*)"$/, '$1');
  //get token from localStorage and pass dynamically in API
  
  //get companyId from localStorage and pass dynamically in API
  var SimpleComapnyId = localStorage.getItem('companyId')
  var companyId = SimpleComapnyId.replace(/^"(.*)"$/, '$1');
  //get companyId from localStorage and pass dynamically in API


  const handleUpload = () => {
    const fileInput = document.getElementById("image");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("image", fileInput.files[0]);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/upload", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }


  const navigate1 = useNavigate();

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
  });

  // useEffect(()=>{
  //   const lang = localStorage.getItem("lang") || "en";
  //   switch (lang) {
  //     case "hi":
  //       setLanguageData(hi);
  //       break;
  //     case "gu":
  //       setLanguageData(gu);
  //       break;
  //     default:
  //       setLanguageData(en);
  //       break;
  //   }

  // })

  const [employee, setEmployee] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [totalWorkingDays, setTotalWorkingDays] = useState('')
  const [leave, setLeave] = useState('')
  const [other, setOther] = useState('')
  const [totalincome, setTotatlIncome] = useState('')
  const [basicsalary, setBasicSalary] = useState('')
  const [hrapercentage, setHraPercentage] = useState('')
  const [hraamount, setHraAmount] = useState('')
  const [tax, setTax] = useState('')
  const [taxamount, setTaxAmount] = useState('')
  const [tds, setTds] = useState('')
  const [tdsamount, setTdsAmount] = useState('')
  const [otherdeduction, setOtherDeduction] = useState('')
  const [totaldeduction, setTotalDeduction] = useState('')
  const [netsalary, setNetSalary] = useState();
  const [data, setData] = useState('')

  const [image, setImage] = useState();

 
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(selectedCountry);
  //   console.log(selectedCountry?.isoCode);
  //   console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  // }, [selectedCountry]);



  

  const handleRemove = () => {
    setImage(null);
  };
  // const handleUpload = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer c0d9173f64eabfe036e825faa9a53b703766cea3");

  //   var formdata = new FormData();
  //   formdata.append("image", imageFile);

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: 'follow'
  //   };
  //   fetch("http://localhost:3000/dev/upload", requestOptions)
  // .then(response => response.json())
  // .then(result => console.log(result))
  // .catch(error => console.log('error', error));

  //   // Rest of the code...
  // };

 
  // const [ownerFirstname, setOwnerFirstName] = useState('')
  // const [ownerLastname, setOwnerLastName] = useState('')
  // const [address, setAddress] = useState('')
  // const [workingDays, setWorkingDays] = useState('')
  // const [workingHours, setWorkingHours] = useState('')
  // const [breakHours, setBreakHours] = useState('')


  function addUser(e) {
    console.log(employee, month, year, totalWorkingDays, leave, other,totalincome
      , hrapercentage, hraamount, tax, taxamount, tds, tdsamount,otherdeduction,totaldeduction,netsalary)
  
    e.preventDefault()


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
                <h1>{languageData.addpayroll}</h1>
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
              <div className="col-md-6">
                {/* general form elements */}
                <div className="card card-primary mainsection01">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.generaldetails}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body section01">
                      <div className="row">
                        <div className="col-sm-12">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.employee}</label>
                            <input type="text" className="form-control" placeholder={languageData.enteremployeename}
                              onChange={(e) => setEmployee(e.target.value)} />
                          </div>
                        </div>
                        {/* <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.lastname}</label>
                            <input type="text" className="form-control" placeholder={languageData.enterlastname}
                              onChange={(e) => setLastName(e.target.value)} />
                          </div>
                        </div> */}
                      </div>
                      {/* <div className="row">
                        <div className="col-sm-6">
                        
                          <div className="form-group">
                            <label>{languageData.month}</label>
                            <input type="text" className="form-control" placeholder={languageData.entermonth}
                              onChange={(e) => setMonth(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.year}</label>
                            <input type="text" className="form-control" placeholder={languageData.enteryear}
                              onChange={(e) => setYear(e.target.value)} />
                          </div>
                        </div>
                      </div> */}
                      <div className="row">
                        <div className="col-sm-6">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.totalworkingdays}</label>
                            <input type="text" className="form-control" placeholder={languageData.enterworkingdays}
                              onChange={(e) => setTotalWorkingDays(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.leave}</label>
                            <input type="text" className="form-control" placeholder={languageData.enterleave}
                              onChange={(e) => setLeave(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.other}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterotherdetails}
                          onChange={(e) => setOther(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.totalincome}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.entertotalincome}
                          onChange={(e) => setTotatlIncome(e.target.value)} />
                      </div> */}
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.companyname}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.entercompanyname}
                          onChange={(e) => setCompanyName(e.target.value)} />
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
                      {/* <div className="form-group status">
                        <label>{languageData.status}</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control select2 " style={{ width: '100%' }}>
                          <option selected="selected">Alabama</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>

                        </select>
                      </div> */}
                    </div>
                    {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
                  </form>
                </div>
                {/* /.card */}
                {/* general form elements */}
              

                {/* /.card */}
                {/* Input addon */}

                {/* /.card */}
                {/* Horizontal Form */}

                {/* /.card */}
              </div>
              {/*/.col (left) */}
              {/* right column */}
              <div className="col-md-6">
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.deductions}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body othercard">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.basicsalary}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterbasicsalary}
                          onChange={(e) => setBasicSalary(e.target.value)} />
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.hra}%</label>
                            <input type="text" className="form-control" placeholder={languageData.enterhra}
                              onChange={(e) => setHraPercentage(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.hraamount}</label>
                            <input type="text" className="form-control" placeholder={languageData.enterhraamount}
                              onChange={(e) => setHraAmount(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    <div className="row">
                        <div className="col-sm-6">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.tax}</label>
                            <input type="text" className="form-control" placeholder={languageData.entertaxamount}
                              onChange={(e) => setTax(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.taxamount}</label>
                            <input type="text" className="form-control" placeholder={languageData.entertaxamount}
                              onChange={(e) => setTaxAmount(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.tds}</label>
                            <input type="text" className="form-control" placeholder={languageData.entertds}
                              onChange={(e) => setTds(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.tdsamount}</label>
                            <input type="text" className="form-control" placeholder={languageData.entertdsamount}
                              onChange={(e) => setTdsAmount(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.otherdeduction}</label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterotherdeduction}
                          onChange={(e) => setOtherDeduction(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.totaldeduction}</label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.entertotaldeduction}
                          onChange={(e) => setTotalDeduction(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.netsalary}</label>
                        <input type="number" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enternetsalary}
                          onChange={(e) => setNetSalary(e.target.value)} />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.mobile}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.entermobile}
                          onChange={(e) => setMobile(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.pannumber}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterpannumber}
                          onChange={(e) => setPanNumber(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.address}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteraddress}
                          onChange={(e) => setAddress(e.target.value)} />
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

                {/* general form elements disabled */}

                {/* <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.taxdetail}</b></h3>
                  </div> */}
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
              </div>
              {/*/.col (right) */}
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>

        {/* /.content */}
        {/* /.content-wrapper */}
        <div className="btnss">
          <button type="button" class="btn btn-primary submitbtn" onClick={addUser}><b>{languageData.submit}</b></button>
          <Link to='/payroll'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
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

export default AddPayroll