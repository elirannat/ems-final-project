import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import Preview1 from '../Company/Images/preview1.jpg'
import Preview02 from '../Company/Images/preview02.jpg'
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './UpdateEmployee.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";


const UpdateEmployee = () => {

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

  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [status, setStatus] = useState('')
  const [empcode, setEmpCode] = useState('')
  const [designation, setDesignation] = useState('')
  const [basicsalary, setBasicSalary] = useState('')
  const [joiningdate, setJoinningDate] = useState('')
  const [resigndate, setResignDate] = useState('')
  const [qualification, setQualification] = useState('')
  const [gender, setGender] = useState('')
  const [pannumber, setPanNumber] = useState('')
  const [address, setAddress] = useState('')
  const [imageFile, setImageFile] = useState();
  const [data, setData] = useState('')

  const params = useParams();
  const [image, setImage] = useState();


  useEffect(() => {
    getUserList()
    console.log(params)

  }, [])

  const getUserList = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = "";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/edituserid/${params.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setFirstName(result.firstName)
        setLastName(result.lastName)
        setEmail(result.email)
        setPassword(result.password)
        setMobile(result.mobile)
        setStatus(result.status)
        setEmpCode(result.empCode)
        setDesignation(result.designation)
        setBasicSalary(result.basicSalary)
        // setJoinningDate(result.joiningdate)
        // setResignDate(result.gstno)
        setQualification(result.qualification)
        setGender(result.gender)
        setPanNumber(result.panNumber)
        setAddress(result.address)



      })
      .catch(error => console.log('error', error));
  }
  const handleSelectChange = (event) => {
    setStatus(event.target.value);
  }
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(selectedCountry);
  //   console.log(selectedCountry?.isoCode);
  //   console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  // }, [selectedCountry]);



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
  // const [ownerFirstname, setOwnerFirstName] = useState('')
  // const [ownerLastname, setOwnerLastName] = useState('')
  // const [address, setAddress] = useState('')
  // const [workingDays, setWorkingDays] = useState('')
  // const [workingHours, setWorkingHours] = useState('')
  // const [breakHours, setBreakHours] = useState('')


  function editUser(e) {
    console.log(firstname, lastname, status, empcode, designation, basicsalary, joiningdate
      , resigndate, qualification, gender, email, password, mobile, pannumber)
    e.preventDefault()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    var raw = JSON.stringify({
      "_id": params.id,
      "email": email,
      "password": password,
      "firstName": firstname,
      "lastName": lastname,
      "empCode": empcode,
      "mobile": mobile,
      "address": address,
      "qualification": qualification,
      "panNumber": pannumber,
      "designation": designation,
      "basicSalary": basicsalary,
      "gender": gender,
      "status": status,
      "companyId": companyId
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:3000/dev/edit_user", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setData(result)
        alert(` ${result.res_message} `)
        if(result.res_code === 1 ){
          navigate('/employee') 
        }else{
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
                  <h1>{languageData.updateemployee}</h1>
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
                      <h3 className="card-title"><b>{languageData.employeedetails}</b></h3>
                    </div>
                    {/* /.card-header */}
                    {/* form start */}
                    <form>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-6">
                            {/* text input */}
                            <div className="form-group">
                              <label>{languageData.firstname}</label>
                              <input type="text" className="form-control" placeholder={languageData.enterfirstname}
                                 value={firstname}
                                onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="form-group">
                              <label>{languageData.lastname}</label>
                              <input type="text" className="form-control" placeholder={languageData.enterlastname}
                               value={lastname}  onChange={(e) => setLastName(e.target.value)} />
                            </div>
                          </div>
                        </div>
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
                      <h3 className="card-title"><b>{languageData.companydetails}</b></h3>
                    </div>
                    {/* /.card-header */}
                    {/* form start */}
                    <form>
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.empcode}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enteremployeecode}
                            value={empcode}
                            onChange={(e) => setEmpCode(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.designation}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                           value={designation}
                            placeholder={languageData.enterdesignation}
                            onChange={(e) => setDesignation(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.basicsalary}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                           value={basicsalary}
                            placeholder={languageData.enterbasicsalary}
                            onChange={(e) => setBasicSalary(e.target.value)} />
                        </div>
                        {/* <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.joiningdate}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enterjoiningdate}
                            value={joiningdate}
                            onChange={(e) => setJoinningDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.resigndate}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enterresigndate}
                            value={resigndate}
                            onChange={(e) => setResignDate(e.target.value)} />
                        </div> */}
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.qualification}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                           value={qualification}
                            placeholder={languageData.enterqualification}
                            onChange={(e) => setQualification(e.target.value)} />
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
                      <h3 className="card-title"><b>{languageData.personaldetails}</b></h3>
                    </div>
                    {/* /.card-header */}
                    {/* form start */}
                    <form>
                      <div className="card-body othercard">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.gender}</label>
                          <input type="email" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.selectgender}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.email}</label>
                          <input type="email" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enteremail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.password}</label>
                          <input type="number" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enterpassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.mobile}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.entermobile}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.pannumber}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enterpannumber}
                            value={pannumber}
                            onChange={(e) => setPanNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">{languageData.address}</label>
                          <input type="text" className="form-control" id="exampleInputEmail1"
                            placeholder={languageData.enteraddress}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                        </div>
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
            <button type="button" class="btn btn-primary submitbtn" onClick={editUser}><b>{languageData.submit}</b></button>
            <Link to='/employee'><button type="button" class="btn btn-danger cancelbtn"><b>{languageData.cancel}</b></button></Link>
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

  export default UpdateEmployee