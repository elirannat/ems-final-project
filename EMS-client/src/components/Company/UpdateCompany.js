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
import './UpdateCompany.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";



const UpdateCompany = () => {


const navigate = useNavigate();
  //Upload Section
  const handleUpload = () => {
    const fileInput = document.getElementById("image");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 0180dd44a4dd0768a7d929ab131a5750f9592128");

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
  //Upload Section

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
  //Language Section



  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [status, setStatus] = useState('')
  const [website, setWebsite] = useState('')
  const [other, setOther] = useState('')
  const [address01, setAddress01] = useState('')
  const [address02, setAddress02] = useState('')
  const [landmark, setLandmark] = useState('')
  const [pin, setPin] = useState('')
  const [gstno, setGstno] = useState('')
  const [othertax01, setOtherTax01] = useState('')
  const [othertax02, setOtherTax02] = useState('')
  const [image, setImage] = useState();
  const [imageFile, setImageFile] = useState();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState('')
  const params = useParams();

  useEffect(() => {
    getCompanyList()
    console.log(params)

  },[])

  const getCompanyList = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 0180dd44a4dd0768a7d929ab131a5750f9592128");

    var raw = "";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/editcompanyid/${params.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setCompanyName(result.companyName)
        setEmail(result.email)
        setMobile(result.mobile)
        setStatus(result.status)
        setWebsite(result.website)
        setOther(result.other)
        setAddress01(result.address01)
        setAddress02(result.address02)
        setLandmark(result.landmark)
        setPin(result.pin)
        setGstno(result.gstno)
        setOtherTax01(result.othertax01)
        setOtherTax02(result.othertax02)
        setSelectedCountry(result.selectedCountry)
        setSelectedState(result.selectedState)
        setSelectedCity(result.selectedCity)
        

      })
      .catch(error => console.log('error', error));
  }

  const handleSelectChange = (event) => {
    setStatus(event.target.value);
  }

  const updatecompany = () => {
    console.log(companyName, email, mobile, status, website, other, address01, address02, landmark, pin,
      gstno, othertax01, othertax02, selectedCountry, selectedState, selectedCity)


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 0180dd44a4dd0768a7d929ab131a5750f9592128");

    var raw = JSON.stringify({
      
      "_id":params.id,
      "companyName": companyName,
      "website": website,
      "email": email,
      "mobile": mobile,
      "other": other,
      "address01": address01,
      "address02": address02,
      "landmark": landmark,
      "country": selectedCountry,
      "state": selectedState,
      "city": selectedCity,
      "pin": pin,
      "gstno": gstno,
      "othertax01": othertax01,
      "othertax02": othertax02
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/edit_company/${params.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.res_code === 1) {
          alert(` ${result.res_message} `)


          navigate('/company')
        } else {
          alert('An error Occured')
        }
      })
      .catch(error => console.log('error', error));

  }





  const handleChange = (event) => {
    const file = event.target.files[0];
    const allowedFormats = ['image/png', 'image/jpeg'];
    const allowedSize = 20 * 1024; // 20kb

    // check if file is of allowed format and size
    if (allowedFormats.includes(file.type) && file.size <= allowedSize) {
      console.log(file)
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ url: reader.result, name: file.name });
        setImageFile(file)
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
        <form >
          <div className="imgsection1 section2">
            <img src={image.url} alt={image.name} height={120} width={120} className="prvimg" />
            <p className="imgname">{image.name}</p>
          </div>
          <div className="rmvdiv"><button type="submit" className="rmvbtn bg-success" onClick={handleUpload}>Upload</button></div>
          <div className="rmvdiv"><button className="rmvbtn bg-danger" onClick={handleRemove}>{languageData.remove}</button></div>
        </form>

      );
    } else {
      return (
        <>
          <div className="mainimg">
            <div className="imgsection1 section2">

              <img src={Preview02} alt='previewImage' className="prvimg" height={120} width={120} />
              <p className="imgname">{languageData.imagename}</p>
            </div>
            <div className="rmvdiv"><button className="rmvbtn bg-secondary" disabled >{languageData.remove}</button></div>
          </div>

        </>

      )
    }
  };


  
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
                <h1>{languageData.updatecompany}</h1>
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
                    <h3 className="card-title"><b>{languageData.companydetail}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.companyname}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.entercompanyname}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)} />
                      </div>
                      {/* <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                      </div> */}
                      <div className="form-group">
                        <div className="input-group grouplogo">
                          <label htmlFor="exampleInputFile" className="logo01">{languageData.companylogo}</label>
                          <form enctype="multipart/form-data" className="myimg" >
                            <div className="col-md-8 section1">
                              <input type="file" accept=".jpg, .png" onChange={handleChange} className="custom-file-input chooseinput" id="exampleInputFile" />
                              <label className="custom-file-label form-control choose" onChange={handleChange}>{languageData.choosefile}</label>
                            </div>
                            {/* <input type="file" accept=".jpg, .png" onChange={handleChange}  /> */}
                            <div className="section2 col-md-4">
                              {
                                renderImagePreview()

                              }

                            </div>
                            {/* {image && (
                              <div>
                                <img src={image.url} alt={image.name} height={120} width={120} />
                                <p>{image.name}</p>
                                <div><button className="rmvbtn bg-danger" onClick={handleRemove}>Remove</button></div>
                              </div>
                            )} */}
                          </form>


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
                        <label>{languageData.status}</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>

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
                    <h3 className="card-title"><b>{languageData.addressdetail}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.address01}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteraddress01}
                          value={address01}
                          onChange={(e) => setAddress01(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.address02}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteraddress02}
                          value={address02}
                          onChange={(e) => setAddress02(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.landmark}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enterlandmark}
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)} />
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.country}</label>
                            <input type="text" className="form-control" placeholder={languageData.country}
                            value={selectedCountry}
                              onChange={(e) => setSelectedCountry(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.state}</label>
                            <input type="text" className="form-control" placeholder={languageData.state}
                            value={selectedState}
                              onChange={(e) => setSelectedState(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          {/* text input */}
                          <div className="form-group">
                            <label>{languageData.city}</label>
                            <input type="text" className="form-control" placeholder={languageData.city}
                            value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.pin}</label>
                            <input type="number" className="form-control" placeholder={languageData.enterpin}
                            value={pin}
                              onChange={(e) => setPin(e.target.value)} />
                          </div>
                        </div>
                      </div>

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
                    <h3 className="card-title"><b>{languageData.otherdetail}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body othercard">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.email}</label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.mobile}</label>
                        <input type="number" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.entermobile}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.website}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.otherdetail}</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          value={other}
                          onChange={(e) => setOther(e.target.value)} />
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

                {/* general form elements disabled */}

                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.taxdetail}</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body taxbody ">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.gstno}:-</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.gstno}
                          value={gstno}
                          onChange={(e) => setGstno(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.othertax01} :-</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.othertax01}
                          value={othertax01}
                          onChange={(e) => setOtherTax01(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.othertax02} :-</label>
                        <input type="text" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.othertax02}
                          value={othertax02}
                          onChange={(e) => setOtherTax02(e.target.value)} />
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
              </div>
              {/*/.col (right) */}
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
        {/* /.content-wrapper */}
        <div className="btnss">
          <button type="button" class="btn btn-primary submitbtn" onClick={updatecompany}><b>{languageData.submit}</b></button>
          <Link to='/company'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
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

export default UpdateCompany