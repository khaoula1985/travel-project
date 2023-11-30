import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import flightgif from './../images/flightgif.webp'
import './flightbookingconfirmation.css'

const FlightBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightInfo } = location.state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/waitmailconfirmation');
  };

  return (
    <div className="flight-booking-confirmation" style={{ marginTop: "150px" }}>
      <h2>Flight Booking Confirmation</h2>
      <img src={flightgif}/>
      <p><span>Flight Number:</span> {flightInfo.flightNumber}</p>
      <p><span>Airline:</span> {flightInfo.airline}</p>
      <p><span>Departure Time:</span> {flightInfo.departureTime}</p>
      <p><span>Arrival Time:</span> {flightInfo.arrivalTime}</p>
      <p><span>Departure Airport:</span> {flightInfo.departureAirport}</p>
      <p><span>Arrival Airport:</span> {flightInfo.arrivalAirport}</p>
      <p><span>Price:</span> {flightInfo.price}</p>

     
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default FlightBookingConfirmation;



