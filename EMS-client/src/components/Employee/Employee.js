import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './Employee.css';
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";

const Employee = () => {
  const [languageData, setLanguageData] = useState(en);
  const [id, setId] = useState();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);

  
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
  }, []);

  useEffect(() => {
    if (token) {
      console.log("Token available");
      getEmployeeList();
      getEmployeeTotalLength()
      setCurrentPage(1); // Reset currentPage to 1
    } else {
      alert("Token Not available");
    }
  }, [searchText]);

  useEffect(() => {
    // setCurrentPage(1);
    getEmployeeTotalLength()
    getEmployeeList();
  }, [selectedEntriesPerPage, searchText]);

  function getEmployeeTotalLength(page) {
    if (!token) {
      console.log("Token not available");
      return;
    }

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
      "roleId": "",
      "companyId": companyId
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
        console.log(result);
        setlength([result]);
        setId(result._id);
      })
      .catch(error => console.log('error', error));
  }


  
  function getEmployeeList(page) {
    if (!token) {
      console.log("Token not available");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var start = (page - 1) * selectedEntriesPerPage; // Calculate the start index based on the page number
    var length = selectedEntriesPerPage;

    var raw = JSON.stringify({
      "order_column": "_id",
      "order_dir": "asc",
      "start": start,
      "length": length,
      "search_text": searchText,
      "roleId": "",
      "companyId": companyId
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
        console.log(result);
        setData([result]);
        setId(result._id);
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
      getEmployeeList(currentPage - 1);
    }
  }

  function handlePageClick(page) {
    setCurrentPage(page);
    getEmployeeList(page);
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  }





  function deleteEmployee(id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "_id": id
    });

    var requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/dev/delete_user", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // setData([result]);

        getEmployeeList();
        
      })
      .catch(error => console.log('error', error));
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{languageData.employeelist}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to='/addemployee'>
                    <button className='add bg-primary'>{languageData.addemployee}</button>
                  </Link>
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
          </div>
        </section>

        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <table id="example2" className="table table-head-fixed table-bordered table-hover">
                      <thead>
                        <tr>
                          <th className="tableheader">{languageData.srno}</th>
                          <th className="tableheader">{languageData.firstname}</th>
                          <th className="tableheader">{languageData.lastname}</th>
                          <th className="tableheader">{languageData.email}</th>
                          <th className="tableheader">{languageData.createdat}</th>
                          <th className="tableheader" colSpan={2}>{languageData.actions}</th>
                        </tr>
                      </thead>
                      {/* // Inside the tbody section */}
                      <tbody>
                        {data.flatMap((post) => {
                          const filteredData = post.res_data.data.filter((item) => {
                            const searchFields = [
                              item.firstName,
                              item.lastName, // Include lastName in the searchFields array
                              item.email,
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
                            const formattedDate = createdAtDate.toLocaleDateString('en-GB');
                            const originalIndex = ((currentPage - 1) * selectedEntriesPerPage) + i + 1; // Calculate the original index
                            return (
                              <tr key={i}>
                                <td className="tabledata">{originalIndex}</td>
                                <td className="tabledata">{item.firstName}</td>
                                <td className="tabledata">{item.lastName}</td>
                                <td className="tabledata">{item.email}</td>
                                <td className="tabledata">{formattedDate}</td>
                                <td className="tabledata">
                                  <Link to={'/updateemployee/' + item._id}>
                                    <i className="fas fa-edit"></i>
                                  </Link>
                                </td>
                                <td className="tabledata">
                                  <i className="fas fa-trash" onClick={() => deleteEmployee(item._id)}></i>
                                </td>
                              </tr>
                            );
                          });
                        })}
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Employee;