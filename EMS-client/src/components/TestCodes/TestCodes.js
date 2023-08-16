import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import gu from "../../locales/gu/translation.json";
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';


const TestCodes = () => {
  const [languageData, setLanguageData] = useState(en);
  const [id, setId] = useState()
  
  var token = localStorage.getItem('token');
  token = token.replace(/^"(.*)"$/, '$1');


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

    console.log(`Bearer ${token}`)

    
    console.log(token)
    if (token) {
      console.log("Token available")

      getEmployeeList()
    } else {
      alert("Token Not available")
    }

  }, [])

  function getEmployeeList() {
    
    if (!token) {
      console.log("Token not available");
      // Handle the case when the token is not available
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      "order_column": "_id",
      "order_dir": "asc",
      "start": 0,
      "length": 10,
      "search_text": searchText,
      "roleId": "",
      "companyId": "64708732b999f14080b4ffdb"
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
        console.log(result)
        setData([result])
        setId(result._id)

      }

      )
      .catch(error => console.log('error', error));
  }






  function deleteCompany(id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
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

        getEmployeeList()

      }

      )
      .catch(error => console.log('error', error));
  }
  return (
    <>
    <div className="hold-transition sidebar-mini">
  <div className="wrapper">
    {/* Navbar */}
   <Navbar />
   <Sidebar />
    {/* /.navbar */}
    {/* Main Sidebar Container */}
  
    {/* Content Wrapper. Contains page content */}
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
     
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
             
              {/* /.card */}
              <div className="card">
                <div className="card-header">
                  <h1 className="card-title">DataTable with default features</h1>
                </div>
                
                {/* /.card-header */}
                <div className="card-body">
                  <table id="example1" className="table table-bordered table-striped">
                    <thead>
                    <tr>
                          <th>{languageData.srno}</th>
                          <th >{languageData.firstname}</th>
                          <th >{languageData.lastname}</th>
                          {/* <th>{languageData.ownerfirstname}</th> */}
                          {/* <th>{languageData.ownerlastname}</th> */}
                          <th>{languageData.email}</th>
                          {/* <th>{languageData.workingday}</th> */}
                          {/* <th>{languageData.workinghour}</th> */}
                          {/* <th>{languageData.breakhour}</th> */}
                          {/* <th>{languageData.salaryenable}</th> */}
                          {/* <th>{languageData.leaveenable}</th> */}
                          <th>{languageData.createdat}</th>
                          <th colSpan={2}>{languageData.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map(post => {
                          return (
                            <>
                              {post.res_data.data
                                .filter((item) => {
                                  const searchFields = [
                                    item.firstName,
                                    item.lastName,
                                    item.email,
                                    new Date(item.createdAt).toLocaleDateString('en-GB'), // Include the formatted date field in the search fields
                                    // Add other fields you want to search here
                                  ];
                                  const lowerSearchText = searchText ? searchText.toLowerCase() : '';
                                  return searchFields.some((field) => field && field.toLowerCase().includes(lowerSearchText));
                                })
                                .map((item, i) => {
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
                                      <td className="tabledata"><Link to={'/updateemployee/' + item._id}><i class="fas fa-edit"></i></Link> </td>
                                      <td className="tabledata"><i class="fas fa-trash" onClick={() => deleteCompany(item._id)}></i></td>
                                      {/* <td><button className="dlt bg-primary">Delete</button></td> */}
                                    </tr>
                                  );
                                })}

                            </>
                          )
                        })
                        }

                      </tbody>
                    
                  </table>
                </div>
                {/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
    {/* /.content-wrapper */}
    <Footer />
    {/* Control Sidebar */}

    {/* /.control-sidebar */}
  </div>
  {/* ./wrapper */}
</div>

    </>
  )
}

export default TestCodes


// import React, { useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
// import Footer from '../Footer/Footer';
// import Navbar from '../Navbar/Navbar';
// import Sidebar from '../Sidebar/Sidebar';
// import './Employee.css';
// import en from "../../locales/en/translation.json";
// import hi from "../../locales/hi/translation.json";
// import gu from "../../locales/gu/translation.json";

// const Employee = () => {
//   const [languageData, setLanguageData] = useState(en);
//   const [id, setId] = useState();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedEntriesPerPage, setSelectedEntriesPerPage] = useState(10);
//   const [searchText, setSearchText] = useState('');
//   const [data, setData] = useState([]);

//   var token = localStorage.getItem('token');
//   token = token.replace(/^"(.*)"$/, '$1');

//   useEffect(() => {
//     const lang = localStorage.getItem("lang") || "en";
//     switch (lang) {
//       case "hi":
//         setLanguageData(hi);
//         break;
//       case "gu":
//         setLanguageData(gu);
//         break;
//       default:
//         setLanguageData(en);
//         break;
//     }
//   }, []);

//   useEffect(() => {
//     if (token) {
//       console.log("Token available");
//       setCurrentPage(1); // Reset currentPage to 1
//       getEmployeeList();
//     } else {
//       alert("Token Not available");
//     }
//   }, [searchText]);

//   useEffect(() => {
//     // setCurrentPage(1);
//     getEmployeeList();
//   }, [selectedEntriesPerPage, searchText]);

//   function getEmployeeList(page) {
//     if (!token) {
//       console.log("Token not available");
//       return;
//     }
  
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     myHeaders.append("Authorization", `Bearer ${token}`);
  
//     var start = (page - 1) * selectedEntriesPerPage; // Calculate the start index based on the page number
//     var length = selectedEntriesPerPage;
  
//     var raw = JSON.stringify({
//       "order_column": "_id",
//       "order_dir": "asc",
//       "start": start,
//       "length": length,
//       "search_text": searchText,
//       "roleId": "",
//       "companyId": "64708732b999f14080b4ffdb"
//     });
  
//     var requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: raw,
//       redirect: 'follow'
//     };
  
//     fetch("http://localhost:3000/dev/user_list", requestOptions)
//       .then(response => response.json())
//       .then(result => {
//         console.log(result);
//         setData([result]);
//         setId(result._id);
//       })
//       .catch(error => console.log('error', error));
//   }
  
  

//   const totalEntries = data.flatMap(post => post.res_data.recordsTotal - 28)
//   const totalPages = Math.ceil(totalEntries / selectedEntriesPerPage);
//   // const lastEntryIndex = currentPage * selectedEntriesPerPage;
//   // const firstEntryIndex = lastEntryIndex - selectedEntriesPerPage;
//   // const currentEntries = data.flatMap(post => post.res_data.data)
//   //   .filter((item, index) => index >= firstEntryIndex && index < lastEntryIndex);



//   function handlePreviousPage() {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       getEmployeeList(currentPage - 1);
//     }
//   }
  
//   function handleNextPage() {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       getEmployeeList(currentPage + 1);
//     }
//   }
  
    

//   function deleteEmployee(id) {
//     var myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);
//     myHeaders.append("Content-Type", "application/json");

//     var raw = JSON.stringify({
//       "_id": id
//     });

//     var requestOptions = {
//       method: 'POST',
//       body: raw,
//       headers: myHeaders,
//       redirect: 'follow'
//     };

//     fetch("http://localhost:3000/dev/delete_user", requestOptions)
//       .then(response => response.json())
//       .then(result => {
//         console.log(result);
//         setData([data]);

//         getEmployeeList();
//       })
//       .catch(error => console.log('error', error));
//   }

//   return (
//     <>
//       <Navbar />
//       <Sidebar />
//       <div className="content-wrapper">
//         <section className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1>{languageData.employeelist}</h1>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <Link to='/addemployee'>
//                     <button className='add bg-primary'>{languageData.addemployee}</button>
//                   </Link>
//                 </ol>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-sm-6">
//                 <div className="entries-dropdown">
//                   <span>{languageData.show}&nbsp;</span>
//                   <select
//                     value={selectedEntriesPerPage}
//                     onChange={(e) => setSelectedEntriesPerPage(Number(e.target.value))}
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={15}>15</option>
//                     <option value={20}>20</option>
//                   </select>
//                   <span>&nbsp;{languageData.entries}</span>
//                 </div>
//               </div>
//               <div className="col-sm-6">
//                 <ol className="breadcrumb float-sm-right">
//                   <input
//                     className="form-control"
//                     type="text"
//                     placeholder="Search..."
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                   />
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="content">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-12">
//                 <div className="card">
//                   <div className="card-body">
//                     <table id="example2" className="table table-head-fixed table-bordered table-hover">
//                       <thead>
//                         <tr>
//                           <th className="tableheader">{languageData.srno}</th>
//                           <th className="tableheader">{languageData.firstname}</th>
//                           <th className="tableheader">{languageData.lastname}</th>
//                           <th className="tableheader">{languageData.email}</th>
//                           <th className="tableheader">{languageData.createdat}</th>
//                           <th className="tableheader" colSpan={2}>{languageData.actions}</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {data.flatMap((post) =>
//                           post.res_data.data
//                             .filter((item) => {
//                               const searchFields = [
//                                 item.firstName,
//                                 item.lastName,
//                                 item.email,
//                                 new Date(item.createdAt).toLocaleDateString('en-GB'),
//                               ];
//                               const lowerSearchText = searchText ? searchText.toLowerCase() : '';
//                               return searchFields.some(
//                                 (field) => field && field.toLowerCase().includes(lowerSearchText)
//                               );
//                             })
//                             .map((item, i) => {
//                               const createdAtDate = new Date(item.createdAt);
//                               const formattedDate = createdAtDate.toLocaleDateString('en-GB');
//                               return (
//                                 <tr key={i}>
//                                   <td className="tabledata">{i + 1}</td>
//                                   <td className="tabledata">{item.firstName}</td>
//                                   <td className="tabledata">{item.lastName}</td>
//                                   <td className="tabledata">{item.email}</td>
//                                   <td className="tabledata">{formattedDate}</td>
//                                   <td className="tabledata">
//                                     <Link to={'/updateemployee/' + item._id}>
//                                       <i className="fas fa-edit"></i>
//                                     </Link>
//                                   </td>
//                                   <td className="tabledata">
//                                     <i
//                                       className="fas fa-trash"
//                                       onClick={() => deleteEmployee(item._id)}
//                                     ></i>
//                                   </td>
//                                 </tr>
//                               );
//                             })
//                         )}
//                       </tbody>

//                     </table>
//                     {/* pagination code  */}
//                     <div className="pagination">
//                       <div>
//                         <span className="entries-text">
//                           {languageData.showing} {((currentPage - 1) * selectedEntriesPerPage) + 1} {languageData.to} {Math.min((currentPage * selectedEntriesPerPage), totalEntries)} {languageData.of} {totalEntries} {languageData.entries}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="buttons">
//                           <button className="btn btn-primary previous" onClick={handlePreviousPage} disabled={currentPage === 1}>
//                             {languageData.previous}
//                           </button>
//                           {Array.from({ length: totalPages }, (_, i) => (
//                             <button
//                               key={i + 1}
//                               className={`btn btn-secondary numbers ${currentPage === i + 1 ? 'active' : ''}`}
//                               onClick={() => setCurrentPage(i + 1)}
//                             >
//                               {i + 1}
//                             </button>
//                           ))}
//                           <button className="btn btn-primary next" onClick={handleNextPage} disabled={currentPage === totalPages}>
//                             {languageData.next}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     {/* pagination code  */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default Employee;