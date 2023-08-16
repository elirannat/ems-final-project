import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'

import { useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './AddCompany.css'

const AddCompany = () => {

  const [image, setImage] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);



  const handleChange = (event) => {
    const file = event.target.files[0];
    const allowedFormats = ['image/png', 'image/jpeg'];
    const allowedSize = 20 * 1024; // 20kb

    // check if file is of allowed format and size
    if (allowedFormats.includes(file.type) && file.size <= allowedSize) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ url: reader.result, name: file.name });
      };
      reader.readAsDataURL(file);
    } else if (!allowedFormats.includes(file.type)) {
      alert('Image can only be in JPG or PNG format');
    } else {
      alert('Image size must be 20kb or less');
    }
  };

  const handleRemove = () => {
    setImage(null);
  };

  const renderImagePreview = () => {
    if (image) {
      return (
        <div>
          <div className="imgsection1">
            <img src={image.url} alt={image.name} height={120} width={120} />
            <p>{image.name}</p>
          </div>
          <div className="rmvdiv"><button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button></div>
        </div>

      );
    } else {
      return (
        <>
          <div className="imgsection">
            <img src={Preview02} alt='previewImage' height={120} width={120} />
            <p className="imgname">Image Name</p>
          </div>

        </>

      )
    }
  };
  const [companyName, setCompanyName] = useState('')
  const [ownerFirstname, setOwnerFirstName] = useState('')
  const [ownerLastname, setOwnerLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('')
  const [workingDays, setWorkingDays] = useState('')
  const [workingHours, setWorkingHours] = useState('')
  const [breakHours, setBreakHours] = useState('')
  const navigate = useNavigate();


  function store(e) {
    console.log(companyName, ownerFirstname, ownerLastname, email, mobile, address, status, workingDays, workingHours, breakHours)
    e.preventDefault()

    // let data = {companyName,ownerFirstname,ownerLastname,email,mobile,address,status,workingDays,workingHours,breakHours}

    // fetch('http://localhost:3000/dev/add_company',{
    //     method:'POST',
    //     headers:{
    //         "Content-Type": "application/json",
    //         "Accept" :"application/json",
    //         "Authorization":"Bearer d92c8c8f0b3722ef6bb962339025a04a28573ca4"
    //     },
    //     body:JSON.stringify(data)

    // }).then((result) =>{
    //     result.json().then((resp)=>{
    //         console.log('resp', resp)
    //     })
    // })

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer fc0fa7cb5c642843bc4063f2d74e5dd8330ecd0c");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "companyName": companyName,
      "ownerFirstname": ownerFirstname,
      "ownerLastname": ownerLastname,
      "email": email,
      "mobile": mobile,
      "address": address,
      "salaryEnabled": true,
      "leaveEnabled": true,
      "status": status,
      "workingDays": workingDays,
      "workingHours": workingHours,
      "breakHours": breakHours
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/add_company", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    // navigate('/company')

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
                <h1>Add Company</h1>
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
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>Company Detail</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Company Name</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                      </div> */}
                      <div className="form-group">
                        <label htmlFor="exampleInputFile">Company Logo</label>
                        <div className="input-group">
                          <div className="myimg">
                            <input type="file" accept=".jpg, .png" onChange={handleChange} className="custom-file-input" id="exampleInputFile" />
                            <label className="custom-file-label form-control" onChange={handleChange}>Choose file</label>
                            {/* <input type="file" accept=".jpg, .png" onChange={handleChange}  /> */}
                            {
                              renderImagePreview()

                            }
                            {/* {image && (
                              <div>
                                <img src={image.url} alt={image.name} height={120} width={120} />
                                <p>{image.name}</p>
                                <div><button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button></div>
                              </div>
                            )} */}
                          </div>


                          {/* <div className="custom-file">
                            <input type="file" className="custom-file-input" id="exampleInputFile" />
                            <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                          </div> */}
                          {/* <div className="input-group-append">
                            <span className="input-group-text">Upload</span>
                          </div> */}
                        </div>
                      </div>
                      {/* <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                      </div> */}
                      {/* /.card-body */}
                      <div className="form-group status">
                        <label>Status</label>
                        <select className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option>Active</option>
                          <option>Inactive</option>

                        </select>
                      </div>
                    </div>
                    {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
                  </form>
                </div>
                {/* /.card */}
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>Address Detail  </b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Address 01</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Address 02</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Landmark </label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group citypin">
                        <label htmlFor="exampleInputEmail1">City </label>
                        <input type="email" className="city"  placeholder="Select City" />
                        
                        <label htmlFor="exampleInputEmail1" className="pin1">Pin </label>
                        <input type="email" className="pin"  placeholder="Enter Pin" />
                      </div>
                      <div className="form-group statecountry">
                      <label htmlFor="exampleInputEmail1" className="state1">State</label>
                        <input type="email" className="state"  placeholder="Select City" />
                        
                        <label htmlFor="exampleInputEmail1" className="country1">Country</label>
                        <input type="email" className="country"  placeholder="Enter Pin" />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Detail</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div> */}
                      <div className="form-group">
                        {/* <label htmlFor="exampleInputEmail1">Company Name</label> */}
                        {/* <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" /> */}
                      </div>
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
              <div className="col-md-6">
              <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>Tax Details</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body taxbody ">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">GST No:-</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Tax 01 :-</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Tax 02 :-</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Detail</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div> */}
                      <div className="form-group">
                        {/* <label htmlFor="exampleInputEmail1">Company Name</label> */}
                        {/* <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" /> */}
                      </div>
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
               
                {/* Form Element sizes */}
                {/* <div className="card card-success">
                  <div className="card-header">
                    <h3 className="card-title">Different Height</h3>
                  </div>
                  <div className="card-body">
                    <input className="form-control form-control-lg" type="text" placeholder=".form-control-lg" />
                    <br />
                    <input className="form-control" type="text" placeholder="Default input" />
                    <br />
                    <input className="form-control form-control-sm" type="text" placeholder=".form-control-sm" />
                  </div>
                  /.card-body
                </div> */}
                {/* /.card */}
                {/* <div className="card card-danger">
                  <div className="card-header">
                    <h3 className="card-title">Different Width</h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-3">
                        <input type="text" className="form-control" placeholder=".col-3" />
                      </div>
                      <div className="col-4">
                        <input type="text" className="form-control" placeholder=".col-4" />
                      </div>
                      <div className="col-5">
                        <input type="text" className="form-control" placeholder=".col-5" />
                      </div>
                    </div>
                  </div>
                  /.card-body
                </div> */}
                {/* /.card */}
                {/* general form elements disabled */}
                {/* <div className="card card-warning">
                  <div className="card-header">
                    <h3 className="card-title">General Elements</h3>
                  </div>
                  /.card-header
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-sm-6">
                          text input
                          <div className="form-group">
                            <label>Text</label>
                            <input type="text" className="form-control" placeholder="Enter ..." />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>Text Disabled</label>
                            <input type="text" className="form-control" placeholder="Enter ..." disabled />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          textarea
                          <div className="form-group">
                            <label>Textarea</label>
                            <textarea className="form-control" rows={3} placeholder="Enter ..." defaultValue={""} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>Textarea Disabled</label>
                            <textarea className="form-control" rows={3} placeholder="Enter ..." disabled defaultValue={""} />
                          </div>
                        </div>
                      </div>
                      input states
                      <div className="form-group">
                        <label className="col-form-label" htmlFor="inputSuccess"><i className="fas fa-check" /> Input with
                          success</label>
                        <input type="text" className="form-control is-valid" id="inputSuccess" placeholder="Enter ..." />
                      </div>
                      <div className="form-group">
                        <label className="col-form-label" htmlFor="inputWarning"><i className="far fa-bell" /> Input with
                          warning</label>
                        <input type="text" className="form-control is-warning" id="inputWarning" placeholder="Enter ..." />
                      </div>
                      <div className="form-group">
                        <label className="col-form-label" htmlFor="inputError"><i className="far fa-times-circle" /> Input with
                          error</label>
                        <input type="text" className="form-control is-invalid" id="inputError" placeholder="Enter ..." />
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          checkbox
                          <div className="form-group">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" />
                              <label className="form-check-label">Checkbox</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" defaultChecked />
                              <label className="form-check-label">Checkbox checked</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" disabled />
                              <label className="form-check-label">Checkbox disabled</label>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          radio
                          <div className="form-group">
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="radio1" />
                              <label className="form-check-label">Radio</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" name="radio1" defaultChecked />
                              <label className="form-check-label">Radio checked</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" disabled />
                              <label className="form-check-label">Radio disabled</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          select
                          <div className="form-group">
                            <label>Select</label>
                            <select className="form-control">
                              <option>option 1</option>
                              <option>option 2</option>
                              <option>option 3</option>
                              <option>option 4</option>
                              <option>option 5</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>Select Disabled</label>
                            <select className="form-control" disabled>
                              <option>option 1</option>
                              <option>option 2</option>
                              <option>option 3</option>
                              <option>option 4</option>
                              <option>option 5</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          Select multiple
                          <div className="form-group">
                            <label>Select Multiple</label>
                            <select multiple className="form-control">
                              <option>option 1</option>
                              <option>option 2</option>
                              <option>option 3</option>
                              <option>option 4</option>
                              <option>option 5</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>Select Multiple Disabled</label>
                            <select multiple className="form-control" disabled>
                              <option>option 1</option>
                              <option>option 2</option>
                              <option>option 3</option>
                              <option>option 4</option>
                              <option>option 5</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  /.card-body
                </div> */}
                {/* /.card */}
                {/* general form elements disabled */}

                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>Other Details</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body othercard">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Mobile</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Website</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Other Detail</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <div className="form-group">
                        {/* <label htmlFor="exampleInputEmail1">Company Name</label> */}
                        {/* <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" /> */}
                      </div>
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
              </div>
              {/*/.col (right) */}
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
      {/* /.content-wrapper */}
      <div className="btnss">
      <button type="button" class="btn btn-primary submitbtn"><b>Submit</b></button>
          <button type="button" class="btn btn-danger cancelbtn"><b>Cancel</b></button>
      </div>
      </div>


      <Footer />



    </>
  )
}

export default AddCompany