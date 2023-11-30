import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import valise from './../images/valise.gif'
import './BookingConfirmation.css'
import axios from 'axios';


const BookingConfirmation = () => {
  const location = useLocation();
  const bookingInfo = location.state ? location.state.bookingInfo : null;

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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8080/send-email', {
        name: formData.name,
        email: formData.email,
        bookingInfo,
      });
  
      console.log(response);
  
      if (response.status === 200) {
        console.log('Email sent successfully');
        // Navigate to the waitmailconfirmation page
        navigate('/waitmailconfirmation');
      } else {
        console.log('Failed to send email');
        
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Axios Response:', error.response); 
     
    } finally {
     
      alert("Verify your informations and try again, please");
    }
  };
  


  if (!bookingInfo) {
    return <p>No booking information available.</p>;
  }

  return (
    <div className="booking-confirmation" style={{ marginTop: "150px" }}>
      <img src={valise}/>
      <h1>Booking Confirmation</h1>

      <p>Hotel: {bookingInfo.hotelName}</p>
      <p>Max Persons: {bookingInfo.maxPersons}</p>
      <p>Check-in Date: {bookingInfo.checkInDate}</p>
      <p>Check-out Date: {bookingInfo.checkOutDate}</p>
      <p>Total Price: {bookingInfo.totalPrice}</p>

      {/* Display user-entered information */}
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BookingConfirmation;
