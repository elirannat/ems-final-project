import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import { Link } from 'react-router-dom'
import './MySalary.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";
import Footer from '../Footer/Footer'


const MySalary = () => {
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

  const [image, setImage] = useState();

  const [selectedRadioButton, setSelectedRadioButton] = useState("primary");

  const handleRadioButtonChange = (event) => {
    setSelectedRadioButton(event.target.value);
  };

  const showDropdown = selectedRadioButton === "secondary";
  const showDropdownPrimary = selectedRadioButton === "primary";
  return (
    <>
      <Navbar />
      <Sidebar />

      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            {/* <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{languageData.addemployee}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">General Form</li>
                </ol>
              </div>
            </div> */}
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}
              <div className="col-md-8">
                {/* general form elements */}
                {/* <div className="card card-primary mainsection01"> */}
                {/* <div className="card-header">
                    <h3 className="card-title"><b>{languageData.userdetails}</b></h3>
                  </div> */}
                {/* /.card-header */}
                {/* form start */}
                {/* <form> */}
                {/* <div className="card-body"> */}
                {/* <div className="row">
                        <div className="col-sm-6">
                          text input
                          <div className="form-group">
                            <label>{languageData.firstname}</label>
                            <input type="text" className="form-control" placeholder={languageData.enterfirstname}
                              onChange={(e) => setFirstName(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label>{languageData.lastname}</label>
                            <input type="text" className="form-control" placeholder={languageData.enterlastname}
                              onChange={(e) => setLastName(e.target.value)} />
                          </div>
                        </div>
                      </div> */}

                {/* /.card-body */}
                {/* <div className="form-group status">
                        <label>{languageData.status}</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control select2 " style={{ width: '100%' }}>
                          <option selected="selected">Alabama</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>

                        </select>
                      </div>
                    </div> */}
                {/* <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div> */}
                {/* </form> */}
                {/* </div> */}
                {/* /.card */}
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.salarydetail }</b></h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                          <label class="form-check-label" for="inlineRadio1">Earning</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                          <label class="form-check-label" for="inlineRadio2">Deduction</label>
                        </div>
                        {/* <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled/>
                            <label class="form-check-label" for="inlineRadio3">3 (disabled)</label>
                        </div> */}
                      </div>
                      <div className="form-group status">
                        <label>{languageData.title}</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option value="basic1">{languageData.basic1}</option>
                          <option value="basic2">{languageData.basic2}</option>
                          <option value="basic3">{languageData.basic3}</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <input
                          type="radio"
                          name="radioButton"
                          value="primary"
                          checked={selectedRadioButton === "primary"}
                          onChange={handleRadioButtonChange}
                        />
                        <label className='radioPrimary' htmlFor="primary">Primary</label>
                        <input
                          type="radio"
                          name="radioButton"
                          value="secondary"
                          checked={selectedRadioButton === "secondary"}
                          onChange={handleRadioButtonChange}
                        />
                        <label className='radioSecondary' htmlFor="secondary">Secondary</label>
                        <div style={showDropdown ? {} : { display: "none" }}>
                          <select className="form-control select2 ">
                            <option value="basic1">option1</option>
                            <option value="basic2">option2</option>
                            <option value="basic3">option3</option>
                          </select>
                        </div>
                      </div>
                      <div className="row">
                        {selectedRadioButton === "primary" ?
                          <div className="col-sm-12">
                            {/* text input */}
                            <div className="form-group">
                              <label>{languageData.unit}</label>
                              <input type="text" className="form-control" placeholder={languageData.inr}
                                onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                          </div>

                          :
                          <div className="col-sm-6" style={{ display: 'none' }}>
                            {/* text input */}
                            <div className="form-group">
                              <label>{languageData.unit}</label>
                              <input type="text" className="form-control" placeholder={languageData.percentage} disabled
                                onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                          </div>
                        }
                        {selectedRadioButton === "secondary" ?
                          <div className="col-sm-12">
                            {/* text input */}
                            <div className="form-group">
                              <label>{languageData.unit}</label>
                              <input type="text" className="form-control" placeholder={languageData.percentage}
                                onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                          </div>

                          :
                          <div className="col-sm-6" style={{ display: 'none' }}>
                            {/* text input */}
                            <div className="form-group">
                              <label>{languageData.unit}</label>
                              <input type="text" className="form-control" placeholder={languageData.inr} disabled
                                onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                          </div>
                        }
                      </div>
                      <div className="form-group status">
                        <label>{languageData.duration}</label>
                        <select className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option value="weekly">{languageData.weekly}</option>
                          <option value="monthly">{languageData.monthly}</option>
                          <option value="yearly">{languageData.yearly}</option>
                        </select>
                      </div>

                      <div className="form-group status">
                        <label>{languageData.priority}</label>
                        <select className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option value="optional">{languageData.optional}</option>
                          <option value="mandatory">{languageData.mandatory}</option>
                        </select>
                      </div> 
                      <div className="form-group status">
                        <label>{languageData.consideronbasisofpresentworkday}</label>
                        <select className="form-control select2 " style={{ width: '100%' }}>
                          {/* <option selected="selected">Alabama</option> */}
                          <option value="optional">{languageData.yes}</option>
                          <option value="mandatory">{languageData.no}</option>
                        </select>
                      </div> 


                      {/* <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio"/>
                          <label class="form-check-label" >{languageData.optional}</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" />
                          <label class="form-check-label" for="inlineRadio2">{languageData.mandatory}</label>
                      </div> */}
                    </div>
                  </form>
                </div>


              </div>
              {/*/.col (left) */}
              {/* right column */}
              {/* <div className="col-md-6">
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title"><b>{languageData.personaldetails}</b></h3>
                  </div> */}
              {/* /.card-header */}
              {/* form start */}
              {/* <form>
                    <div className="card-body othercard">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.gender}</label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.selectgender}
                          onChange={(e) => setGender(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.email}</label>
                        <input type="email" className="form-control" id="exampleInputEmail1"
                          placeholder={languageData.enteremail}
                          onChange={(e) => setEmail(e.target.value)} />
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">{languageData.password}</label>
                        <input type="password" className="form-control" id="password_field"
                          placeholder={languageData.enterpassword}
                          onChange={(e) => setPassword(e.target.value)} /> */}
              {/* <input type="checkbox" onclick={click} />Show Password */}
              {/* <span className="fa fa-eye viewpass mr-4 text-muted" onClick={click} id="togglePassword"></span> */}
              {/* </div>
                      <div className="form-group">
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
                      </div>

                    </div> */}

              {/* </form>
                </div> */}



              {/* /.card */}
              {/* </div> */}
              {/*/.col (right) */}
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>

        {/* /.content */}
        {/* /.content-wrapper */}
        <div className="btnss">
          <button type="button" class="btn btn-primary submitbtn" ><b>{languageData.submit}</b></button>
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

export default MySalary