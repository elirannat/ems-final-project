import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './User.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const User = () => {
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
  const [data, setData] = useState([])
  useEffect(() => {

    getUserList()



  }, [])

  function getUserList() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 0180dd44a4dd0768a7d929ab131a5750f9592128");

    var raw = JSON.stringify({
      "order_column": "_id",
      "order_dir": "asc",
      "start": 0,
      "length": 10,
      "search_text": "",
      "roleId": ""
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/user_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        setData([result])
        setId(result._id)
      })
      .catch(error => console.log('error', error));
  }


  function deleteCompany(id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 0180dd44a4dd0768a7d929ab131a5750f9592128");
    myHeaders.append("Content-Type", "application/json");


    var raw = JSON.stringify({
      "_id": (id)
    });

    var requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:3000/dev/delete_user`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)

        getUserList()

      }

      )
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
                <h1>{languageData.userlist}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/adduser'>  <button className='add bg-primary'>{languageData.adduser}</button></Link>
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
                          <th className="tableheader">{languageData.firstname}</th>
                          <th className="tableheader">{languageData.lastname}</th>
                          {/* <th>{languageData.ownerfirstname}</th> */}
                          {/* <th>{languageData.ownerlastname}</th> */}
                          <th className="tableheader">{languageData.email}</th>
                          {/* <th>{languageData.workingday}</th> */}
                          {/* <th>{languageData.workinghour}</th> */}
                          {/* <th>{languageData.breakhour}</th> */}
                          {/* <th>{languageData.salaryenable}</th> */}
                          {/* <th>{languageData.leaveenable}</th> */}
                          <th className="tableheader">{languageData.createdat}</th>
                          <th className="tableheader" colSpan={2}>{languageData.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data.map(post => {
                            return (

                              <>

                                {post.res_data.data.map((item, i) => {
                                  const createdAtDate = new Date(item.createdAt); // Create a new Date object from createdAt string
                                  const formattedDate = createdAtDate.toLocaleDateString('en-GB'); // Format the date in dd-mm-yyyy
                                  return (
                                    <tr key={i}>
                                      {/* {
                                                        console.log(item._id)
                                                      } */}

                                      <td className="tabledata">{i + 1}</td>
                                      <td className="tabledata">{item.firstName}</td>
                                      <td className="tabledata">{item.lastName}</td>
                                      {/* <td>{item.ownerFirstname}</td> */}
                                      {/* <td>{item.ownerLastname}</td> */}
                                      <td className="tabledata">{item.email}</td>
                                      {/* <td>{item.workingDays}</td> */}
                                      {/* <td>{item.workingHours}</td> */}
                                      {/* <td>{item.breakHours}</td> */}
                                      {/* <td>{item.salaryEnabled}</td> */}
                                      {/* <td>{item.leaveEnabled}</td> */}
                                      <td className="tabledata">{formattedDate}</td>
                                      {/* <td><Link to='/updatecompany'><button className="edt bg-primary">Edit</button></Link> </td> */}
                                      <td className="tabledata"><Link to={'/updateuser/' + item._id}><i class="fas fa-edit"></i></Link> </td>
                                      <td className="tabledata"><i class="fas fa-trash" onClick={() => deleteCompany(item._id)}></i></td>
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

export default User