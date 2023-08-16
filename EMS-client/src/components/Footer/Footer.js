import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
  {/* /.content-wrapper */}
<footer className="main-footer">
  <strong>Copyright © 2023 <a className='names'>Eliran Natan</a>.</strong>
  All rights reserved.
  <div className="float-right d-none d-sm-inline-block">
    <b>Version</b> 5.0.0
  </div>
</footer>

    </>
  )
}

export default Footer