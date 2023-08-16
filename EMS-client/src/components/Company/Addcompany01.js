import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

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
      <div className="content-wrapper" id="quickForm">
        {/* Content Header (Page header) */}
        <section className="content-header " >
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Add Company</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#"></a></li>
                  {/* <li className="breadcrumb-item active"></li> */}
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* SELECT2 EXAMPLE */}
            <div className="card card-default">
              <div className="card-header bg-primary">
                <h2 className="card-title"><b>Company Details</b></h2>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  {/* <button type="button" className="btn btn-tool" data-card-widget="remove">
              <i className="fas fa-times" />
            </button> */}
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company Name</label>
                      <input placeholder="Enter Company Name " value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="form-control select2" />
                    </div>
                    {/* <div className="form-group">
                      <label>Status</label>
                      <select className="form-control select2 " style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>Active</option>
                        <option>Inactive</option>

                      </select>
                    </div> */}

                    {/* /.form-group */}
                    {/* <div className="form-group">
                      <label>Email</label>
                      <input placeholder="Enter Email" type='email' value={ownerFirstname} onChange={(e) => setOwnerFirstName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Mobile</label>
                      <input placeholder="Enter Mobile" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input placeholder="Enter Website" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control select2" />
                    </div> */}
                    {/* <div className="form-group">
                      <label> Mobile</label>
                      <input placeholder="Enter Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="form-control select2" />
                    </div> */}

                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Company Logo</label>
                      <div className="input-group">
                        <div className="myimg">
                          <input type="file" accept=".jpg, .png" onChange={handleChange} className="custom-file-input" id="exampleInputFile" />
                          <label className="custom-file-label form-control" onChange={handleChange}>Choose file</label>
                          {/* <input type="file" accept=".jpg, .png" onChange={handleChange}  /> */}
                          {image && (
                            <div>
                              <img src={image.url} alt={image.name} height={120} width={120} />
                              <p>{image.name}</p>
                              <div><button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button></div>
                            </div>
                          )}
                        </div>


                        {/* <div>
                          {image ? (
                            <div>
                              <img src={image} alt="avatar" height={100} width={100} />
                              <p>File name: {imageName}</p>
                              <p>Size: {(imageSize / 1024).toFixed(2)} KB</p>
                            </div>
                          ) : (
                            <div>
                              <input type="file" accept=".jpg, .png" onChange={handleImageUpload} />
                              <button onClick={handleImageDelete}></button>
                            </div>
                          )}
                        </div> */}
                        {/* <div className="custom-file"> */}
                        {/* <input type="file" className="custom-file-input" id="exampleInputFile"/>
                          <label className="custom-file-label" "exampleInputFile">Choose file</label> */}



                        {/* AdminLte Upload system */}
                        {/* <div className="card-body">
                            <div id="actions" className="row">
                              <div className="col-lg-6">
                                <div className="btn-group w-100">
                                  <span className="btn btn-success col fileinput-button">
                                    <i className="fas fa-plus" />
                                    <span>Add files</span>
                                  </span>
                                  <button type="submit" className="btn btn-primary col start">
                                    <i className="fas fa-upload" />
                                    <span>Start upload</span>
                                  </button>
                                  <button type="reset" className="btn btn-warning col cancel">
                                    <i className="fas fa-times-circle" />
                                    <span>Cancel upload</span>
                                  </button>
                                </div>
                              </div>
                              <div className="col-lg-6 d-flex align-items-center">
                                <div className="fileupload-process w-100">
                                  <div id="total-progress" className="progress progress-striped active" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                                    <div className="progress-bar progress-bar-success" style={{ width: '0%' }} data-dz-uploadprogress />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="table table-striped files" id="previews">
                              <div id="template" className="row mt-2">
                                <div className="col-auto">
                                  <span className="preview"><img src="data:," alt data-dz-thumbnail /></span>
                                </div>
                                <div className="col d-flex align-items-center">
                                  <p className="mb-0">
                                    <span className="lead" data-dz-name />
                                    (<span data-dz-size />)
                                  </p>
                                  <strong className="error text-danger" data-dz-errormessage />
                                </div>
                                <div className="col-4 d-flex align-items-center">
                                  <div className="progress progress-striped active w-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                                    <div className="progress-bar progress-bar-success" style={{ width: '0%' }} data-dz-uploadprogress />
                                  </div>
                                </div>
                                <div className="col-auto d-flex align-items-center">
                                  <div className="btn-group">
                                    <button className="btn btn-primary start">
                                      <i className="fas fa-upload" />
                                      <span>Start</span>
                                    </button>
                                    <button data-dz-remove className="btn btn-warning cancel">
                                      <i className="fas fa-times-circle" />
                                      <span>Cancel</span>
                                    </button>
                                    <button data-dz-remove className="btn btn-danger delete">
                                      <i className="fas fa-trash" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}

                        {/* </div> */}
                        {/* AdminLte Upload system */}
                        {/* <div className="input-group-append">
                        <span className="input-group-text">Upload</span>
                      </div> */}
                      </div>
                    </div>

                    {/* <div className="form-group">
                      <label>Status</label>
                      <select className="form-control select2 " style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>Active</option>
                        <option>Inactive</option>

                      </select>
                    </div> */}

                    {/* /.form-group */}
                    {/* <div className="form-group">
                      <label>Email</label>
                      <input placeholder="Enter Email" type='email' value={ownerFirstname} onChange={(e) => setOwnerFirstName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Mobile</label>
                      <input placeholder="Enter Mobile" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input placeholder="Enter Website" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control select2" />
                    </div> */}

                    {/* /.form-group */}
                    {/* <div className="form-group">
                      <label>Website  </label>
                      <input placeholder="Enter Website Name" type='text'  className="form-control select2"  />
                    </div>
                    <div className="form-group">
                      <label>Working Days  </label>
                      <select className="form-control select2 select2-danger"  style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Working Hours</label>
                      <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                      </select>
                    </div> */}
                    {/* <div className="form-group"> */}
                    {/* <label>Break (1) Hours</label> */}
                    {/* <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}> */}
                    {/* <option selected="selected">Alabama</option> */}
                    {/* <option>1</option>
                        <option>2</option> */}

                    {/* </select> */}
                    {/* <input value={breakHours} onChange={(e) => setBreakHours(e.target.value)} className="form-control select2" /> */}
                    {/* </div> */}
                    {/* <div className="form-group"> */}
                    {/* <label>Break (2) Hours</label> */}
                    {/* <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}> */}
                    {/* <option selected="selected">Alabama</option> */}
                    {/* <option>1</option>
                        <option>2</option> */}

                    {/* </select> */}
                    {/* <input value={breakHours} onChange={(e) => setBreakHours(e.target.value)} className="form-control select2" /> */}
                    {/* </div> */}
                    {/* /.form-group */}
                  </div>
                  {/* <div className="col-md-3"> */}
                  {/* <div className="form-group"> */}
                  {/* <label>Company Logo</label> */}
                  {/* <div className="input-group"> */}
                  {/* <div className="preview">
                          {image && (
                            <div>
                              <img src={image.url} alt={image.name} height={100} width={100} />
                              <p>{image.name}</p>
                              <button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button>
                            </div>
                          )}
                          </div> */}
                  {/* <input type="file" accept=".jpg, .png" onChange={handleChange}  /> */}
                  {/* {image && (
                            <div>
                            <img src={image.url} alt={image.name} height={120} width={120} />
                            <p>{image.name}</p>
                            <div><button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button></div>
                            </div>
                          )} */}


                  {/* <div>
                          {image ? (
                            <div>
                              <img src={image} alt="avatar" height={100} width={100} />
                              <p>File name: {imageName}</p>
                              <p>Size: {(imageSize / 1024).toFixed(2)} KB</p>
                            </div>
                          ) : (
                            <div>
                              <input type="file" accept=".jpg, .png" onChange={handleImageUpload} />
                              <button onClick={handleImageDelete}></button>
                            </div>
                          )}
                        </div> */}
                  {/* <div className="custom-file"> */}
                  {/* <input type="file" className="custom-file-input" id="exampleInputFile"/>
                          <label className="custom-file-label" "exampleInputFile">Choose file</label> */}



                  {/* AdminLte Upload system */}
                  {/* <div className="card-body">
                            <div id="actions" className="row">
                              <div className="col-lg-6">
                                <div className="btn-group w-100">
                                  <span className="btn btn-success col fileinput-button">
                                    <i className="fas fa-plus" />
                                    <span>Add files</span>
                                  </span>
                                  <button type="submit" className="btn btn-primary col start">
                                    <i className="fas fa-upload" />
                                    <span>Start upload</span>
                                  </button>
                                  <button type="reset" className="btn btn-warning col cancel">
                                    <i className="fas fa-times-circle" />
                                    <span>Cancel upload</span>
                                  </button>
                                </div>
                              </div>
                              <div className="col-lg-6 d-flex align-items-center">
                                <div className="fileupload-process w-100">
                                  <div id="total-progress" className="progress progress-striped active" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                                    <div className="progress-bar progress-bar-success" style={{ width: '0%' }} data-dz-uploadprogress />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="table table-striped files" id="previews">
                              <div id="template" className="row mt-2">
                                <div className="col-auto">
                                  <span className="preview"><img src="data:," alt data-dz-thumbnail /></span>
                                </div>
                                <div className="col d-flex align-items-center">
                                  <p className="mb-0">
                                    <span className="lead" data-dz-name />
                                    (<span data-dz-size />)
                                  </p>
                                  <strong className="error text-danger" data-dz-errormessage />
                                </div>
                                <div className="col-4 d-flex align-items-center">
                                  <div className="progress progress-striped active w-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                                    <div className="progress-bar progress-bar-success" style={{ width: '0%' }} data-dz-uploadprogress />
                                  </div>
                                </div>
                                <div className="col-auto d-flex align-items-center">
                                  <div className="btn-group">
                                    <button className="btn btn-primary start">
                                      <i className="fas fa-upload" />
                                      <span>Start</span>
                                    </button>
                                    <button data-dz-remove className="btn btn-warning cancel">
                                      <i className="fas fa-times-circle" />
                                      <span>Cancel</span>
                                    </button>
                                    <button data-dz-remove className="btn btn-danger delete">
                                      <i className="fas fa-trash" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}

                  {/* </div> */}
                  {/* AdminLte Upload system */}
                  {/* <div className="input-group-append">
                        <span className="input-group-text">Upload</span>
                      </div> */}
                  {/* </div> */}
                  {/* </div> */}

                  {/* <div className="form-group">
                      <label>Status</label>
                      <select className="form-control select2 " style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>Active</option>
                        <option>Inactive</option>

                      </select>
                    </div> */}

                  {/* /.form-group */}
                  {/* <div className="form-group">
                      <label>Email</label>
                      <input placeholder="Enter Email" type='email' value={ownerFirstname} onChange={(e) => setOwnerFirstName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Mobile</label>
                      <input placeholder="Enter Mobile" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input placeholder="Enter Website" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control select2" />
                    </div> */}

                  {/* /.form-group */}
                  {/* <div className="form-group">
                      <label>Website  </label>
                      <input placeholder="Enter Website Name" type='text'  className="form-control select2"  />
                    </div>
                    <div className="form-group">
                      <label>Working Days  </label>
                      <select className="form-control select2 select2-danger"  style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Working Hours</label>
                      <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                      </select>
                    </div> */}
                  {/* <div className="form-group"> */}
                  {/* <label>Break (1) Hours</label> */}
                  {/* <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}> */}
                  {/* <option selected="selected">Alabama</option> */}
                  {/* <option>1</option>
                        <option>2</option> */}

                  {/* </select> */}
                  {/* <input value={breakHours} onChange={(e) => setBreakHours(e.target.value)} className="form-control select2" /> */}
                  {/* </div> */}
                  {/* <div className="form-group"> */}
                  {/* <label>Break (2) Hours</label> */}
                  {/* <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}> */}
                  {/* <option selected="selected">Alabama</option> */}
                  {/* <option>1</option>
                        <option>2</option> */}

                  {/* </select> */}
                  {/* <input value={breakHours} onChange={(e) => setBreakHours(e.target.value)} className="form-control select2" /> */}
                  {/* </div> */}
                  {/* /.form-group */}
                  {/* </div> */}
                  {/* /.col */}
                </div>
                {/* /.row */}
                {/* <h5>Custom Color Variants</h5> */}
                <div className="row">
                  <div className="col-md-5 col-12 col-sm-6">
                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                  <div className="col-md-5 col-12 col-sm-6">

                    {/* <div className="form-group">
                      <label> Hours</label>
                      <input className="form-control select2" />
                    </div> */}
                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                </div>
                {/* <div className="w-100">
                  <label>Address</label><br />
                  <textarea placeholder="Enter Full Address" value={address} onChange={(e) => setAddress(e.target.value)} className='w-100' rows={3} cols={100}></textarea>
                </div><br /> */}
                {/* <button type="button" className='addbtn bg-primary w-100' onClick={store}>Add Company</button> */}
                <br />



                {/* <h3 className='w-100'>sadfjhbasdflkasbdfklabsdfkjhabsdfkjhbasdf</h3> */}
                {/* /.row */}
              </div>
              {/* /.card-body */}
              {/* <div className="card-footer">
          Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
          the plugin.
        </div> */}
            </div>

            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        <section className="content">
          <div className="container-fluid">
            {/* SELECT2 EXAMPLE */}
            <div className="card card-default">
              <div className="card-header bg-primary">
                <h2 className="card-title"><b>Other Details</b></h2>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  {/* <button type="button" className="btn btn-tool" data-card-widget="remove">
              <i className="fas fa-times" />
            </button> */}
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    {/* <div className="form-group">
                      <label>Company Name</label>
                      <input placeholder="Enter Company Name " value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="form-control select2" />
                    </div> */}
                    <div className="form-group">
                      <label>Status</label>
                      <select className="form-control select2 " style={{ width: '100%' }}>
                        {/* <option selected="selected">Alabama</option> */}
                        <option>Active</option>
                        <option>Inactive</option>

                      </select>
                    </div>

                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Email</label>
                      <input placeholder="Enter Email" type='email' value={ownerFirstname} onChange={(e) => setOwnerFirstName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Mobile</label>
                      <input placeholder="Enter Mobile" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input placeholder="Enter Website" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Other</label>
                      <input placeholder="Other Detail" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control select2" />
                    </div>
                    {/* <div className="form-group">
                      <label> Mobile</label>
                      <input placeholder="Enter Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="form-control select2" />
                    </div> */}

                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                  <div className="col-md-4">
                    {/* <div className="form-group">
                      <label>Company Logo</label>
                      <div className="input-group">
                        <div>
                          <input type="file" accept=".jpg, .png" onChange={handleChange} className="custom-file-input" id="exampleInputFile" />
                          <label className="custom-file-label form-control">Choose file</label>
                          <input type="file" accept=".jpg, .png" onChange={handleChange}  />
                          {image && (
                            <div>
                              <img src={image.url} alt={image.name} height={120} width={120} />
                              <p>{image.name}</p>
                              <div><button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button></div>
                            </div>
                          )}
                        </div>
                        </div>
                    </div> */}



                    {/* <div>
                          {image ? (
                            <div>
                              <img src={image} alt="avatar" height={100} width={100} />
                              <p>File name: {imageName}</p>
                              <p>Size: {(imageSize / 1024).toFixed(2)} KB</p>
                            </div>
                          ) : (
                            <div>
                              <input type="file" accept=".jpg, .png" onChange={handleImageUpload} />
                              <button onClick={handleImageDelete}></button>
                            </div>
                          )}
                        </div> */}
                    {/* <div className="custom-file"> */}
                    {/* <input type="file" className="custom-file-input" id="exampleInputFile"/>
                          <label className="custom-file-label" "exampleInputFile">Choose file</label> */}



                    {/* AdminLte Upload system */}
                    {/* <div className="card-body">
                            <div id="actions" className="row">
                              <div className="col-lg-6">
                                <div className="btn-group w-100">
                                  <span className="btn btn-success col fileinput-button">
                                    <i className="fas fa-plus" />
                                    <span>Add files</span>
                                  </span>
                                  <button type="submit" className="btn btn-primary col start">
                                    <i className="fas fa-upload" />
                                    <span>Start upload</span>
                                  </button>
                                  <button type="reset" className="btn btn-warning col cancel">
                                    <i className="fas fa-times-circle" />
                                    <span>Cancel upload</span>
                                  </button>
                                </div>
                              </div>
                              <div className="col-lg-6 d-flex align-items-center">
                                <div className="fileupload-process w-100">
                                  <div id="total-progress" className="progress progress-striped active" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                                    <div className="progress-bar progress-bar-success" style={{ width: '0%' }} data-dz-uploadprogress />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="table table-striped files" id="previews">
                              <div id="template" className="row mt-2">
                                <div className="col-auto">
                                  <span className="preview"><img src="data:," alt data-dz-thumbnail /></span>
                                </div>
                                <div className="col d-flex align-items-center">
                                  <p className="mb-0">
                                    <span className="lead" data-dz-name />
                                    (<span data-dz-size />)
                                  </p>
                                  <strong className="error text-danger" data-dz-errormessage />
                                </div>
                                <div className="col-4 d-flex align-items-center">
                                  <div className="progress progress-striped active w-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                                    <div className="progress-bar progress-bar-success" style={{ width: '0%' }} data-dz-uploadprogress />
                                  </div>
                                </div>
                                <div className="col-auto d-flex align-items-center">
                                  <div className="btn-group">
                                    <button className="btn btn-primary start">
                                      <i className="fas fa-upload" />
                                      <span>Start</span>
                                    </button>
                                    <button data-dz-remove className="btn btn-warning cancel">
                                      <i className="fas fa-times-circle" />
                                      <span>Cancel</span>
                                    </button>
                                    <button data-dz-remove className="btn btn-danger delete">
                                      <i className="fas fa-trash" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}

                    {/* </div> */}
                    {/* AdminLte Upload system */}
                    {/* <div className="input-group-append">
                        <span className="input-group-text">Upload</span>
                      </div> */}

                    <div className="form-group">
                      <label>Country</label>
                      <Select className="country"
                        placeholder='Select Country'
                        options={Country.getAllCountries()}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCountry}
                        onChange={(item) => {
                          setSelectedCountry(item);
                        }}
                      />

                    </div>
                    <div className="form-group">
                      <label>State</label>

                      <Select className="state"
                        placeholder='Select State'
                        options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedState}
                        onChange={(item) => {
                          setSelectedState(item);
                        }}
                      />

                    </div>
                    <div className="form-group">
                      <label>City</label>

                      <Select className="city"
                        placeholder='Select City'
                        options={City.getCitiesOfState(
                          selectedState?.countryCode,
                          selectedState?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCity}
                        onChange={(item) => {
                          setSelectedCity(item);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Landmark (Line 1)</label>
                      <input placeholder="Enter Landmark (Line 1)" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                    </div>
                    <div className="form-group">
                      <label>Landmark (Line 2)</label>
                      <input placeholder="Enter Landmark (Line 2)" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                    </div>

                  </div>
                  {/* <input placeholder="Enter Email" type='email' value={ownerFirstname} onChange={(e) => setOwnerFirstName(e.target.value)} className="form-control select2" /> */}

                  {/* /.form-group */}
                  {/* <div className="form-group">
                    <label>State</label>
                    <input placeholder="Enter Email" type='email' value={ownerFirstname} onChange={(e) => setOwnerFirstName(e.target.value)} className="form-control select2" />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input placeholder="Enter Mobile" value={ownerLastname} onChange={(e) => setOwnerLastName(e.target.value)} className="form-control select2" />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input placeholder="Enter Website" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control select2" />
                  </div> */}

                  {/* /.form-group */}
                  {/* <div className="form-group">
                      <label>Website  </label>
                      <input placeholder="Enter Website Name" type='text'  className="form-control select2"  />
                    </div>
                    <div className="form-group">
                      <label>Working Days  </label>
                      <select className="form-control select2 select2-danger"  style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Working Hours</label>
                      <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                      </select>
                    </div> */}
                  {/* <div className="form-group"> */}
                  {/* <label>Break (1) Hours</label> */}
                  {/* <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}> */}
                  {/* <option selected="selected">Alabama</option> */}
                  {/* <option>1</option>
                        <option>2</option> */}

                  {/* </select> */}
                  {/* <input value={breakHours} onChange={(e) => setBreakHours(e.target.value)} className="form-control select2" /> */}
                  {/* </div> */}
                  {/* <div className="form-group"> */}
                  {/* <label>Break (2) Hours</label> */}
                  {/* <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}> */}
                  {/* <option selected="selected">Alabama</option> */}
                  {/* <option>1</option>
                        <option>2</option> */}

                  {/* </select> */}
                  {/* <input value={breakHours} onChange={(e) => setBreakHours(e.target.value)} className="form-control select2" /> */}
                  {/* </div> */}
                  {/* /.form-group */}
                </div>
                {/* /.col */}
              </div>
              {/* /.row */}
              {/* <h5>Custom Color Variants</h5> */}
              <div className="row">
                <div className="col-md-5 col-12 col-sm-6">
                  {/* /.form-group */}
                </div>
                {/* /.col */}
                <div className="col-md-5 col-12 col-sm-6">

                  {/* <div className="form-group">
                      <label> Hours</label>
                      <input className="form-control select2" />
                    </div> */}
                  {/* /.form-group */}
                </div>
                {/* /.col */}
              </div>
              {/* <div className="w-100">
                  <label>Address</label><br />
                  <textarea placeholder="Enter Full Address" value={address} onChange={(e) => setAddress(e.target.value)} className='w-100' rows={3} cols={100}></textarea>
                </div><br /> */}
              {/* <button type="button" className='addbtn bg-primary w-100' onClick={store}>Add Company</button> */}
              {/* <br /> */}



              {/* <h3 className='w-100'>sadfjhbasdflkasbdfklabsdfkjhabsdfkjhbasdf</h3> */}
              {/* /.row */}
            </div>
            {/* /.card-body */}
            {/* <div className="card-footer">
          Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
          the plugin.
        </div> */}
          </div>

          {/* /.row */}

        </section>
        {/* /.container-fluid */}
        {/* /.content */}
        <section className="content">
          <div className="container-fluid">
            {/* SELECT2 EXAMPLE */}
            <div className="card card-default">
              <div className="card-header bg-primary">
                <h2 className="card-title"><b>Tax Details</b></h2>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  {/* <button type="button" className="btn btn-tool" data-card-widget="remove">
                    <i className="fas fa-times" />
                  </button> */}
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>GST No :-</label>
                      <input placeholder="Enter GST No" className="form-control select2" />
                    </div>
                    {/* /.form-group */}

                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Other Tax No 1 :-</label>
                      <input placeholder="Enter Other Tax No 1" className="form-control select2" />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Other Tax No 2 :-</label>
                      <input placeholder="Enter Other Tax No 2" className="form-control select2" />
                    </div>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
                {/* <h5>Custom Color Variants</h5> */}
                <div className="row">
                  <div className="col-12 col-sm-6">
                    {/* <div className="form-group">
                      <label>Minimal (.select2-danger)</label>
                      <select className="form-control select2 select2-danger" data-dropdown-css-class="select2-danger" style={{ width: '100%' }}>
                        <option selected="selected">Alabama</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Delaware</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Washington</option>
                      </select>
                    </div> */}
                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                  <div className="col-12 col-sm-6">
                    <div className="form-group">
                      {/* <label>Multiple (.select2-purple)</label> */}
                      {/* <div className="select2-purple">
                        <select className="select2" multiple="multiple" data-placeholder="Select a State" data-dropdown-css-class="select2-purple" style={{ width: '100%' }}>
                          <option>Alabama</option>
                          <option>Alaska</option>
                          <option>California</option>
                          <option>Delaware</option>
                          <option>Tennessee</option>
                          <option>Texas</option>
                          <option>Washington</option>
                        </select>
                      </div> */}
                    </div>
                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.card-body */}
              {/* <div className="card-footer">
                Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
                the plugin.
              </div> */}
            </div>
            {/* /.card */}
            {/* SELECT2 EXAMPLE */}
            <div className="card card-default">
              <div className="card-header bg-primary">
                <h2 className="card-title"><b>Contact Person Detail</b></h2>
                <div className="card-tools">
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  {/* <button type="button" className="btn btn-tool" data-card-widget="remove">
                    <i className="fas fa-times" />
                  </button> */}
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="empty">First Name</label>
                      <input placeholder="First Name" className="form-control select2" />
                    </div>
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Last Name</label>
                      <input placeholder="Last Name" className="form-control select2" />
                    </div>
                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="empty">Email</label>
                      <input placeholder="Email" className="form-control select2" />
                    </div>
                    {/* /.form-group */}
                    <div className="form-group">
                      <label>Mobile</label>
                      <input placeholder="Mobile" className="form-control select2" />
                    </div>

                    {/* /.form-group */}
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.card-body */}
              {/* <div className="card-footer">
                Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
                the plugin.
              </div> */}
            </div>
            {/* /.card */}

            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        <div className="btns">



          <button type="button" class="btn btn-primary submitbtn"><b>Submit</b></button>
          <button type="button" class="btn btn-danger cancelbtn"><b>Cancel</b></button>
          {/* <button type="button" className="btn btn-block btn-primary btn-sm ">Primary</button>
        <button type="button" className="btn btn-block btn-danger btn-sm">Cancel</button> */}
        </div>
        {/* <button type="submit" className='addbtn bg-primary w-20' onClick={store}>Add Company</button>
        <button type="submit" className='cancelbtn bg-danger w-20'>Cancle</button> */}
      </div >


      <Footer />



    </>
  )
}

export default AddCompany