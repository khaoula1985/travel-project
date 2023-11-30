import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import monde from '../images/monde1.jpg'
import trips from '../images/Tour.png'
import flight from '../images/Flight.png'
import hotels from '../images/hotels.jpg'

const Home = () => {
  return (
    <>
    <div className='home' >
      <h1 className='landing'>Go Wherever Your Heart Desires...</h1>
      <img src={monde}/>
      <div className="icons" >
        <div className='flights'>
          <Link to="/flight">
          <img src={flight}/> 
          <h5>FLIGHTS</h5>
          </Link>
        </div>
      
        <div className='hotelsicon'>
         <Link to="/hotel">
         <img src={hotels} alt="Hotels" />
         <h5>HOTELS</h5>
         </Link>
        </div>
       
        <div className="trips">
         <Link to="/tours">
         <img src={trips}/>
         <h5>TRIPS</h5>
         </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
