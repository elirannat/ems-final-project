// import { loadLanguages } from 'i18next'
// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import Footer from '../Footer/Footer'
// import Navbar from '../Navbar/Navbar'
// import Sidebar from '../Sidebar/Sidebar'
// import en from "../../locales/en/translation.json";
// import hi from "../../locales/hi/translation.json";
// import gu from "../../locales/gu/translation.json";

// const Home = () => {
//   const [languageData, setLanguageData] = useState(en);
//   useEffect(()=>{
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

//   },[])
//   return (
//     <>
//     <Navbar />
//     <Sidebar />
//      {/* Content Wrapper. Contains page content */}
// <div className="content-wrapper">
//   {/* Content Header (Page header) */}
//   <div className="content-header">
//     <div className="container-fluid">
//       <div className="row mb-2">
//         <div className="col-sm-6">
//           <h1 className="m-0">Dashboard</h1>
//         </div>{/* /.col */}
//         <div className="col-sm-6">
//           <ol className="breadcrumb float-sm-right">
//             {/* <li className="breadcrumb-item"><a href="#">Home</a></li>
//             <li className="breadcrumb-item active">Dashboard v1</li> */}
//           </ol>
//         </div>{/* /.col */}
//       </div>{/* /.row */}
//     </div>{/* /.container-fluid */}
//   </div>
//   {/* /.content-header */}
//   {/* Main content */}
//   <section className="content">
//     <div className="container-fluid">
//       {/* Small boxes (Stat box) */}
//       <div className="row">
//         <div className="col-lg-4 col-6">
//           {/* small box */}
//           <div className="small-box bg-info">
//             <div className="inner">
//               <h3>7</h3>
//               <p>Company</p>
//             </div>
//             <div className="icon">
//               <i className="ion ion-bag" />
//             </div>
//             {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
//           </div>
//         </div>
//         {/* ./col */}
//         <div className="col-lg-4 col-6">
//           {/* small box */}
//           <div className="small-box bg-success">
//             <div className="inner">
//               <h3>3343</h3>
//               <p> User</p>
//             </div>
//             <div className="icon">
//               <i className="ion ion-stats-bars" />
//             </div>
//             {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
//           </div>
//         </div>
//         {/* ./col */}
//           {/* small box */}
//         {/* <div className="col-lg-3 col-6">
//           <div className="small-box bg-warning">
//             <div className="inner">
//               <h3>3443</h3>
//               <p>User</p>
//             </div>
//             <div className="icon">
//               <i className="ion ion-person-add" />
//             </div>
//             <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
//           </div>
//         </div> */}
//         {/* ./col */}
//         <div className="col-lg-4 col-6">
//           {/* small box */}
//           <div className="small-box bg-danger">
//             <div className="inner">
//               <h3>4</h3>
//               <p>Admin</p>
//             </div>
//             <div className="icon">
//               <i className="ion ion-pie-graph" />
//             </div>
//             {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a> */}
//           </div>
//         </div>
//         {/* ./col */}
//       </div>
      
//     </div>{/* /.container-fluid */}
//   </section>
//   {/* /.content */}
// </div>
// {/* /.content-wrapper */}

// <Footer />
//     </>
//   )
// }

// export default Home