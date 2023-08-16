import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import './Holiday.css'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";


const Holiday = () => {
  const [languageData, setLanguageData] = useState(en);
  const [id, setId] = useState()


  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntriesPerPage, setSelectedEntriesPerPage] = useState(5);
  const [length, setlength] = useState([]);


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

  useEffect(() => {
    if (token) {
      console.log("Token available");
      getHolidayList();
      getHolidayTotalLength()
      setCurrentPage(1); // Reset currentPage to 1
    } else {
      alert("Token Not available");
    }
  }, [searchText]);

  useEffect(() => {
    // setCurrentPage(1);
    getHolidayTotalLength()
    getHolidayList();
  }, [selectedEntriesPerPage, searchText]);

  function getHolidayTotalLength(page) {

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

    fetch("http://localhost:3000/dev/holiday_list", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setlength([result]);
        setId(result._id)
      })
      .catch(error => console.log('error', error));

  }

  function getHolidayList(page) {
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

    fetch("http://localhost:3000/dev/holiday_list", requestOptions)
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

  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      getHolidayList(currentPage - 1);
    }
  }

  function handlePageClick(page) {
    setCurrentPage(page);
    getHolidayList(page);
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  }
  // const token = localStorage.getItem('token');
  // console.log(token)

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
        getHolidayList()
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
            {/* <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            /> */}

            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{languageData.holidays}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/addholiday'>  <button className='add bg-primary'>{languageData.addholiday}</button></Link>
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
                          <th className="tableheader">{languageData.name}</th>
                          <th className="tableheader">{languageData.from}</th>
                          <th className="tableheader">{languageData.to}</th>
                          <th className="tableheader" colSpan={2}>{languageData.actions}</th>
                        </tr>
                      </thead>
                      <tbody>

                      {data.flatMap((post) => {
                          const filteredData = post.res_data.data.filter((item) => {
                            const searchFields = [
                              item.holidayName,
                             
                              new Date(item.createdAt).toLocaleDateString('en-GB'),
                            ];
                            const lowerSearchText = searchText ? searchText.toLowerCase() : '';
                            return searchFields.some((field) => field && field.toLowerCase().includes(lowerSearchText));
                          });

                          if (filteredData.length === 0) {
                            return (
                              <tr>
                                <td colSpan={6} className="no-records-found">
                                 <h1> {languageData.noRecordsFound}</h1>
                                </td>
                              </tr>
                            );
                          }

                          return filteredData.map((item, i) => {
                            const createdAtDate = new Date(item.createdAt);
                            // const formattedDate = createdAtDate.toLocaleDateString('en-GB');
                            const dateFrom = new Date(item.dateFrom);
                                    const formattedDateFrom = dateFrom.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                                    const dateTo = new Date(item.dateTo);
                                    const formattedDateTo = dateTo.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                            const originalIndex = ((currentPage - 1) * selectedEntriesPerPage) + i + 1; // Calculate the original index
                            // const daysDifference = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24)); // Calculate the difference in days

                            return (
                              <tr key={i}>
                                <td className="tabledata">{originalIndex}</td>
                                {/* <td className="tabledata">{daysDifference}</td> */}
                                <td className="tabledata">{item.holidayName}</td>
                                <td className="tabledata">{formattedDateFrom}</td>
                                <td className="tabledata">{formattedDateTo}</td>
                                <td className="tabledata">
                                  <Link to={'/updateholiday/' + item._id}>
                                    <i className="fas fa-edit"></i>
                                  </Link>
                                </td>
                                <td className="tabledata">
                                  <i className="fas fa-trash" onClick={() => deleteHoliday(item._id)}></i>
                                </td>
                              </tr>
                            );
                          });
                        })}
                        {/* {
                          data && data.map(post => {
                            return (

                              <>

                                {post.res_data.data.filter(
                                  (item) =>
                                    item.holidayName.toLowerCase().includes(searchText.toLowerCase()) // Update this line based on the property you want to search by
                                )
                                  .map((item, i) => {
                                    const dateFrom = new Date(item.dateFrom);
                                    const formattedDateFrom = dateFrom.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                                    const dateTo = new Date(item.dateTo);
                                    const formattedDateTo = dateTo.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

                                    return (
                                      <tr key={i}>
                                        <td className="tabledata">{i + 1}</td>
                                        <td className="tabledata">{item.holidayName}</td>
                                        <td className="tabledata">{formattedDateFrom}</td>
                                        <td className="tabledata">{formattedDateTo}</td>
                                        
                                        <td className="tabledata"><Link to={'/updateholiday/' + item._id}><i class="fas fa-edit"></i></Link> </td>
                                        <td className="tabledata"><i className="fas fa-trash" onClick={() => deleteHoliday(item._id)}></i></td>
                                      </tr>

                                    )
                                  }


                                  )}

                              </>
                            )
                          })
                        } */}

                      </tbody>

                    </table>
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

export default Holiday