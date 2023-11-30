import React from 'react'
import {BiLogoFacebookSquare}  from 'react-icons/bi';
import {BiLogoInstagramAlt}  from 'react-icons/bi';
import {BiLogoYoutube}  from 'react-icons/bi';
import {BiSolidMap}  from 'react-icons/bi';
import {BsFillTelephoneFill}  from 'react-icons/bs';
import {BiMailSend}  from 'react-icons/bi';
import logo from '../../images/logo.jpg';
import './Footer.css'

const Footer = () => {
  return (
    <div className="footer" style={{display:"flex", flexDirection:"row", marginTop:"25px", fontSize:"14px"}}> 
      <div style={{marginLeft:"100px"}}className='logoetsocial'>
        <img src={logo} style={{width:"70px",height:"55px",marginTop:"5px", boxShadow:"none"}}/>
      <div  className='social' style={{ marginLeft:"10px"}} >
      <a href="http://www.facebook.com"> <BiLogoFacebookSquare  style={{fontsize:"28px"}} /></a>
      <a href="http://www.instagram.com"> <BiLogoInstagramAlt style={{fontsize:"28px"}} /></a>
      <a href="http://www.youtube.com"> <BiLogoYoutube style={{fontsize:"28px"}} /></a>
      
      </div>
      </div> 
      <div style={{marginLeft:"200px"}} className='Discover'>
        <h5>Discover</h5>
        <a href="/home">Home</a> <br/>
        <a href="/flight">Flights</a><br/>
        <a href="/tour">Trips</a>
      </div>

      <div style={{marginLeft:"200px"}} className='Quick Links'>
        <h5>Quick Links</h5>
        <a href="/gallery">Gallery</a> <br/>
        <a href="/login">Login</a><br/>
        <a href="/register">Register</a>
      </div>

      <div style={{marginLeft:"200px"}} className='Contact' >
        <h5>Contact</h5>
        <p><span style={{fontWeight:"bolder"}}>< BiSolidMap/>adress:</span>...........</p>
        <p style={{marginTop:"-10px"}}><span style={{fontWeight:"bolder"}}><BiMailSend/>email:</span>...........</p> 
        <p style={{marginTop:"-10px"}}><span style={{fontWeight:"bolder"}}><BsFillTelephoneFill/>phone:</span>...........</p>
      </div>
    </div>
  )
}

export default Footer