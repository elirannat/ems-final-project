import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './Company.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";
import ReactPaginate from "react-paginate";

const Company = () => {
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

    getCompanyList()
  }, [])

  function getCompanyList() {
    var myHeaders = new Headers();
    // const storedToken = localStorage.getItem('token');
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('tokenType');

    myHeaders.append("Authorization", "Bearer 0180dd44a4dd0768a7d929ab131a5750f9592128");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "order_column": "_id",
      "order_dir": "asc",
      "start": 0,
      "length": 25,
      "search_text": ""
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/company_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        setData([result])
        setId(result._id)

      }

      )
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

    fetch(`http://localhost:3000/dev/delete_company`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)

        getCompanyList()

      }

      )
      .catch(error => console.log('error', error));
  }
 
  


  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 4;
  const lastIndex = (currentPage + 1) * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.length > 0 ? data[0].res_data.data.slice(firstIndex, lastIndex) : [];

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  const pageCount = Math.ceil((data.length > 0 ? data[0].res_data.data.length : 0) / recordsPerPage);


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
                <h1>{languageData.companylist}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/addcompany'>  <button className='add bg-primary'>{languageData.addcompany}</button></Link>
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
                          <th className="tableheader">{languageData.companyname}</th>
                          {/* <th>{languageData.ownerfirstname}</th> */}
                          {/* <th>{languageData.ownerlastname}</th> */}
                          <th className="tableheader">{languageData.mobile}</th>
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
                          
                          records && records.map(post => {
                            console.log(records)
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
                                      <td className="tabledata">{item.companyName}</td>
                                      {/* <td>{item.ownerFirstname}</td> */}
                                      {/* <td>{item.ownerLastname}</td> */}
                                      <td className="tabledata">{item.mobile}</td>
                                      {/* <td>{item.workingDays}</td> */}
                                      {/* <td>{item.workingHours}</td> */}
                                      {/* <td>{item.breakHours}</td> */}
                                      {/* <td>{item.salaryEnabled}</td> */}
                                      {/* <td>{item.leaveEnabled}</td> */}
                                      <td className="tabledata">{formattedDate}</td>
                                      {/* <td><Link to='/updatecompany'><button className="edt bg-primary">Edit</button></Link> </td> */}
                                      <td className="tabledata"><Link to={'/updatecompany/' + item._id}><i class="fas fa-edit"></i></Link> </td>
                                      <td className="tabledata"><i className="fas fa-trash" onClick={() => deleteCompany(item._id)}></i></td>
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
                    <ReactPaginate
                      previousLabel="Prev"
                      nextLabel="Next"
                      pageCount={pageCount}
                      onPageChange={handlePageClick}
                      containerClassName="pagination"
                      previousLinkClassName="page-link"
                      nextLinkClassName="page-link"
                      disabledClassName="disabled"
                      activeClassName="active"
                    />
                    {/* <nav>
                      <ul className="pagination">

                        <li className="page-item">
                          <a href = "#"className="page-link"
                          onClick={prePage}> Prev</a>
                        </li>
                        {
                          numbers.map((n,i)=>(
                            <li className={`page-item ${currentPage === n?'active':""}`} key = {i}>
                              <a href = "#" className="page-link"
                              onClick={()=>changeCPage(n)}>{n}
                              </a>
                            </li>
                          ))
                        }
                         <li className="page-item">
                          <a  href = "#"className="page-link"
                          onClick={nextPage}>Next</a>
                        </li>
                      </ul>
                    </nav> */}
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

export default Company