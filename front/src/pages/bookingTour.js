import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './bookingTour.css';
import Tourimg from './../images/lets-go-luna.gif'

const BookingTour = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { tour } = location.state || { tour: null };

  const calculateTotalPrice = () => {
   
    return numberOfPersons * (tour ? tour.price : 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your logic to handle form submission, e.g., send booking details to the server
    // After successful submission, you can navigate to the confirmation page
    navigate('/waitmailconfirmation');
  };

  return (
    <div className='bookingtour'>
      <h1>Booking Tour</h1>
      <img src={Tourimg}/>
      {tour && (
        <div>
          <p>Destination: {tour.destination}</p>
          <p>Price: {tour.price}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Number of Persons:
          <input
            type="number"
            value={numberOfPersons}
            onChange={(e) => setNumberOfPersons(e.target.value)}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <p>Total Price: {calculateTotalPrice()}</p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BookingTour;