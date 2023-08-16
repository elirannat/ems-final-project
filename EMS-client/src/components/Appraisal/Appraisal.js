import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './Appraisal.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const Appraisal = () => {
  const [languageData, setLanguageData] = useState(en);
  const [id, setId] = useState()

  //get token from localStorage and pass dynamically in API
  var token = localStorage.getItem('token');
  token = token.replace(/^"(.*)"$/, '$1');
  //get token from localStorage and pass dynamically in API
  
  //get companyId from localStorage and pass dynamically in API
  var SimpleComapnyId = localStorage.getItem('companyId')
  var companyId = SimpleComapnyId.replace(/^"(.*)"$/, '$1');
  //get companyId from localStorage and pass dynamically in API


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
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntriesPerPage, setSelectedEntriesPerPage] = useState(5);
  const [length, setlength] = useState([]);


  
  useEffect(() => {
    if (token) {
      console.log("Token available");
      getAppraisalList();
      getAppraisalTotalLength()
      setCurrentPage(1); // Reset currentPage to 1
    } else {
      alert("Token Not available");
    }
  }, [searchText]);

  useEffect(() => {
    // setCurrentPage(1);
    getAppraisalTotalLength()
    getAppraisalList();
  }, [selectedEntriesPerPage, searchText]);


  function getAppraisalTotalLength(page) {
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
      "companyId": companyId
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/appraisal_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setlength([result])
      })
      .catch(error => console.log('error', error));
  }
  function getAppraisalList(page) {
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
      "companyId": companyId
    });


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/appraisal_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setData([result])
      })
      .catch(error => console.log('error', error));
  }

  //  .then(result => {
  //         setData([result])
  //         setId(result._id)
  //       })

  const totalEntries = length.flatMap(post => post.res_data.data).length
  const totalPages = Math.ceil(totalEntries / selectedEntriesPerPage);
  // const lastEntryIndex = currentPage * selectedEntriesPerPage;
  // const firstEntryIndex = lastEntryIndex - selectedEntriesPerPage;
  // const currentEntries = data.flatMap(post => post.res_data.data)
  //   .filter((item, index) => index >= firstEntryIndex && index < lastEntryIndex);



  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      getAppraisalList(currentPage - 1);
    }
  }

  function handlePageClick(page) {
    setCurrentPage(page);
    getAppraisalList(page);
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  }


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

    fetch("http://localhost:3000/dev/delete_appraisal", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        getAppraisalList()
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
                <h1>{languageData.appraisallist}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/addappraisal'>  <button className='add bg-primary'>{languageData.addappraisal}</button></Link>
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
                          <th className="tableheader">{languageData.firstname}</th>
                          <th className="tableheader">{languageData.lastname}</th>
                          <th className="tableheader">{languageData.datefrom}</th>
                          <th className="tableheader">{languageData.dateto}</th>
                          <th className="tableheader">{languageData.percentage}</th>
                          <th className="tableheader">{languageData.previoussalary}</th>
                          <th className="tableheader">{languageData.newsalary}</th>
                          {/* <th>{languageData.ownerfirstname}</th> */}
                          {/* <th>{languageData.ownerlastname}</th> */}
                          {/* <th className="tableheader">{languageData.adddefault}</th> */}
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
                          data && data.map(post => {
                            return (

                              <>

                                {post.res_data.data
                                  .filter((item) => {
                                    const searchFields = [
                                      item.firstName,
                                      item.lastName,
                                      item.email,
                                      new Date(item.createdAt).toLocaleDateString('en-GB'),
                                      new Date(item.dayFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }),
                                      new Date(item.dayTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }),
                                      item.percentage.toString(), // Convert percentage to string
                                      item.previousSalary.toString(), // Convert previousSalary to string
                                      item.newSalary.toString(), // Convert newSalary to string
                                      // Add other fields you want to search here
                                    ];
                                    const lowerSearchText = searchText ? searchText.toLowerCase() : '';
                                    return searchFields.some((field) => {
                                      if (typeof field === 'string') {
                                        return field.toLowerCase().includes(lowerSearchText);
                                      }
                                      return false;
                                    });
                                  })
                                  .map((item, i) => {
                                    const createdAtDate = new Date(item.createdAt);
                                    const formattedDate = createdAtDate.toLocaleDateString('en-GB');
                                    const dayFrom = new Date(item.dayFrom);
                                    const formattedDayFrom = dayFrom.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                                    const dayTo = new Date(item.dayTo);
                                    const formattedDayTo = dayTo.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
                                    const originalIndex = ((currentPage - 1) * selectedEntriesPerPage) + i + 1; // Calculate the original index
                                    return (
                                      <tr key={i}>
                                        {/* {
          console.log(item._id)
        } */}
                                        <td className="tabledata">{originalIndex}</td>
                                        <td className="tabledata">{item.firstName}</td>
                                        <td className="tabledata">{item.lastName}</td>
                                        <td className="tabledata">{formattedDayFrom}</td>
                                        <td className="tabledata">{formattedDayTo}</td>
                                        <td className="tabledata">{item.percentage}</td>
                                        <td className="tabledata">{item.previousSalary}</td>
                                        <td className="tabledata">{item.newSalary}</td>
                                        <td className="tabledata">{formattedDate}</td>
                                        <td className="tabledata"><Link to={'/updateappraisal/' + item._id}><i class="fas fa-edit"></i></Link></td>
                                        <td className="tabledata"><i className="fas fa-trash" onClick={() => deleteCompany(item._id)}></i></td>
                                      </tr>
                                    );
                                  })}



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

export default Appraisal