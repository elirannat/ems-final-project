import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './Salary.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const Salary = () => {
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


  var token = localStorage.getItem('token');
  token = token.replace(/^"(.*)"$/, '$1');



  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntriesPerPage, setSelectedEntriesPerPage] = useState(5);
  const [length, setlength] = useState([]);


  useEffect(() => {
    if (token) {
      console.log("Token available");
      getSalaryList();
      getSalaryTotalLength()
      setCurrentPage(1); // Reset currentPage to 1
    } else {
      alert("Token Not available");
    }
  }, [searchText]);

  useEffect(() => {
    // setCurrentPage(1);
    getSalaryTotalLength()
    getSalaryList();
  }, [selectedEntriesPerPage, searchText]);


  function getSalaryTotalLength(page) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var start = (page - 1) * selectedEntriesPerPage; // Calculate the start index based on the page number
    var length = 10000000000


    var raw = JSON.stringify({
      "order_column": "_id",
      "order_dir": "asc",
      "start": start,
      "length": length,
      "search_text": searchText,
      "companyId": "64490e4f9fc32034188515f7"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/company_salary_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setlength([result])
        setId(result._id)
      })
      .catch(error => console.log('error', error));
  }

  
  function getSalaryList(page) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var start = (page - 1) * selectedEntriesPerPage; // Calculate the start index based on the page number
    var length = selectedEntriesPerPage


    var raw = JSON.stringify({
      "order_column": "_id",
      "order_dir": "asc",
      "start": start,
      "length": length,
      "search_text": searchText,
      "companyId": "64490e4f9fc32034188515f7"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/company_salary_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setData([result])
        setId(result._id)
      })
      .catch(error => console.log('error', error));
  }

  const totalEntries = length.flatMap(post => post.res_data.data).length
  const totalPages = Math.ceil(totalEntries / selectedEntriesPerPage);
  // const lastEntryIndex = currentPage * selectedEntriesPerPage;
  // const firstEntryIndex = lastEntryIndex - selectedEntriesPerPage;
  // const currentEntries = data.flatMap(post => post.res_data.data)
  //   .filter((item, index) => index >= firstEntryIndex && index < lastEntryIndex);



  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      getSalaryList(currentPage - 1);
    }
  }

  function handlePageClick(page) {
    setCurrentPage(page);
    getSalaryList(page);
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  }


  //  .then(result => {
  //         setData([result])
  //         setId(result._id)
  //       })

  function deleteCompany(id) {

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

    fetch("http://localhost:3000/dev/delete_company_salary", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        getSalaryList()
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
                <h1>{languageData.salarytype}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/addsalary'>  <button className='add bg-primary'>{languageData.addsalary}</button></Link>
                </ol>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="entries-dropdown">
                  <span>{languageData.show}&nbsp;</span>
                  <select className="selectedEntries"
                    value={selectedEntriesPerPage}
                    onChange={(e) => setSelectedEntriesPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span>&nbsp;{languageData.entries}</span>
                </div>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </ol>
              </div>
            </div>


            {/* <div class="input-group mb-3">
              <div class="input-group-prepend">
              </div>
              <input
                className="form-control"
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div> */}
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
                          <th className="tableheader">{languageData.salarytype}</th>
                          <th className="tableheader">{languageData.amount}</th>
                          <th className="tableheader">{languageData.amounttype}</th>
                          <th className="tableheader">{languageData.payas}</th>
                          <th className="tableheader">{languageData.createdat}</th>
                          <th className="tableheader" colSpan={2}>{languageData.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data && data.map(post => {
                            return (

                              <>

                                {
                                  post.res_data.data
                                    .filter((item) => {
                                      const searchFields = [
                                        item.salaryType,
                                        item.amount,
                                        item.payType,
                                        item.payAs,
                                        // Add other fields you want to search here
                                        new Date(item.createdAt).toLocaleDateString('en-GB'), // Include the formatted date field in the search fields
                                      ];
                                      const lowerSearchText = searchText ? searchText.toLowerCase() : '';
                                      return searchFields.some((field) =>
                                        field && field.toLowerCase().includes(lowerSearchText)
                                      );
                                    })
                                    .map((item, i) => {
                                      const createdAtDate = new Date(item.createdAt); // Create a new Date object from createdAt string
                                      const formattedDate = createdAtDate.toLocaleDateString('en-GB'); // Format the date in dd-mm-yyyy
                                      const originalIndex = ((currentPage - 1) * selectedEntriesPerPage) + i + 1; // Calculate the original index
                                      return (
                                        <tr key={i}>
                                          <td className="tabledata">{originalIndex}</td>
                                          <td className="tabledata">{item.salaryType}</td>
                                          <td className="tabledata">{item.amount}</td>
                                          <td className="tabledata">{item.payType}</td>
                                          <td className="tabledata">{item.payAs}</td>
                                   
                                          <td className="tabledata">{formattedDate}</td>
                                          
                                          <td className="tabledata">
                                            <Link to={'/updatesalary/' + item._id}>
                                              <i className="fas fa-edit"></i>
                                            </Link>
                                          </td>
                                          <td className="tabledata">
                                            <i className="fas fa-trash" onClick={() => deleteCompany(item._id)}></i>
                                          </td>
                                        
                                        </tr>
                                      );
                                    })
                                }


                              </>
                            )
                          })
                        }

                      </tbody>

                    </table>
                     {/* pagination code  */}
                     <div className="pagination">
                      <div>
                        <span className="entries-text">
                          {languageData.showing} {((currentPage - 1) * selectedEntriesPerPage) + 1} {languageData.to} {Math.min((currentPage * selectedEntriesPerPage), totalEntries)} {languageData.of} {totalEntries} {languageData.entries}
                        </span>
                      </div>
                      <div>
                        <div className="buttons">
                          <button className="btn btn-primary previous" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            {languageData.previous}
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i + 1}
                              className={`btn btn-secondary numbers ${currentPage === i + 1 ? 'active' : ''}`}
                              onClick={() => handlePageClick(i + 1)}
                            >
                              {i + 1}
                            </button>
                          ))}

                          <button className="btn btn-primary next" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {languageData.next}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* pagination code  */}
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

export default Salary