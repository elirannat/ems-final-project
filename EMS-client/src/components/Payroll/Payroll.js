import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './Payroll.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";


const Payroll = () => {
  const [languageData, setLanguageData] = useState(en);
  const [id, setId] = useState()
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

  })

  //get token from localStorage and pass dynamically in API
  var token = localStorage.getItem('token');
  token = token.replace(/^"(.*)"$/, '$1');
  //get token from localStorage and pass dynamically in API
  
  //get companyId from localStorage and pass dynamically in API
  var SimpleComapnyId = localStorage.getItem('companyId')
  var companyId = SimpleComapnyId.replace(/^"(.*)"$/, '$1');
  //get companyId from localStorage and pass dynamically in API

  

  const [data, setData] = useState([])
  useEffect(() => {

    getPayrollList()
  }, [])

  function getPayrollList() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      "userId": "64491243fcd87d3c380e6b36",
      "month": 4,
      "year": 2022,
      "totalWorkingDays": 26,
      "leave": 4,
      "basicSalary": 10000,
      "salaryList": [
        {
          "salaryId": "62627636ac86fa3d28126181",
          "payAs": "fixed",
          "payType": "payment",
          "amount": 2000
        },
        {
          "salaryId": "626276574115163d281825a3",
          "payAs": "percentage",
          "payType": "payment",
          "amount": 30
        },
        {
          "salaryId": "6262767412716f3d287ee776",
          "payAs": "fixed",
          "payType": "deduction",
          "amount": 200
        },
        {
          "salaryId": "626276805c01073d28d3da8c",
          "payAs": "percentage",
          "payType": "deduction",
          "amount": 10
        }
      ],
      "description": "Testing"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/add_payroll", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

  }


  function deleteHoliday(id) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      "_id": (id)
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/delete_holiday", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        getPayrollList()
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
                <h1>{languageData.payroll}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/addpayroll'>  <button className='add bg-primary'>{languageData.addpayroll}</button></Link>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  {/* <div className="card-header">
              <h3 className="card-title">DataTable with minimal features &amp; hover style</h3>
            </div> */}
                  {/* /.card-header */}
                  <div className="card-body">
                    <table id="example2" className="table table-head-fixed table-bordered table-hover">
                      <thead>
                        <tr>
                          <th className="tableheader">{languageData.srno}</th>
                          <th className="tableheader">{languageData.month}</th>
                          <th className="tableheader">{languageData.year}</th>
                          <th className="tableheader">{languageData.totalworkingdays}</th>
                          <th className="tableheader">{languageData.leave}</th>
                          <th className="tableheader">{languageData.basicsalary}</th>
                          <th className="tableheader">{languageData.allowance}</th>
                          <th className="tableheader">{languageData.deduction}</th>
                          <th className="tableheader">{languageData.netsalary}</th>
                          <th className="tableheader">{languageData.description}</th>
                          <th className="tableheader">{languageData.createdat}</th>
                          <th className="tableheader" colSpan={2}>{languageData.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data && data.map(post => {
                            return (

                              <>

                                {post.res_data.data.map((item, i) => {
                                  const dateFrom = new Date(item.dateFrom);
                                  const formattedDateFrom = dateFrom.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                                  const dateTo = new Date(item.dateTo);
                                  const formattedDateTo = dateTo.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                                  return (
                                    <tr key={i}>
                                      {/* {
                                                        console.log(item._id)
                                                      } */}

                                      <td className="tabledata">{i + 1}</td>
                                      <td className="tabledata">{item.month}</td>
                                      <td className="tabledata">{item.year}</td>
                                      <td className="tabledata">{item.totalworkingdays}</td>
                                      <td className="tabledata">{item.leave}</td>
                                      <td className="tabledata">{item.basicsalary}</td>
                                      <td className="tabledata">{item.allowance}</td>
                                      <td className="tabledata">{item.deduction}</td>
                                      <td className="tabledata">{item.netsalary}</td>
                                      <td className="tabledata">{item.description}</td>
                                      <td className="tabledata">{item.createdat}</td>
                                      {/* <td>{item.ownerFirstname}</td> */}
                                      {/* <td>{item.ownerLastname}</td> */}
                                      {/* <td className="tabledata">{item.addAsDefault}</td> */}
                                      {/* <td>{item.workingDays}</td> */}
                                      {/* <td>{item.workingHours}</td> */}
                                      {/* <td>{item.breakHours}</td> */}
                                      {/* <td>{item.salaryEnabled}</td> */}
                                      {/* <td>{item.leaveEnabled}</td> */}
                                      {/* <td className="tabledata">{formattedDate}</td> */}
                                      {/* <td><Link to='/updatecompany'><button className="edt bg-primary">Edit</button></Link> </td> */}
                                      <td className="tabledata"><Link to={'/updateholiday/' + item._id}><i class="fas fa-edit"></i></Link> </td>
                                      <td className="tabledata"><i className="fas fa-trash" onClick={() => deleteHoliday(item._id)}></i></td>
                                      {/* <td><button className="dlt bg-primary">Delete</button></td> */}

                                    </tr>

                                  )
                                }


                                )}

                              </>
                            )
                          })
                        }

                      </tbody>

                    </table>
                  </div>
                  {/* /.card-body */}
                </div>

              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      <Footer />
      {/* /.content-wrapper */}


    </>
  )
}

export default Payroll