import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./FlightsResult.css"
import flightgif from './../images/flightgif.webp'

const FlightsResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filteredFlights } = location.state;

  const handleBook = (flight) => {
    navigate(`/flightbookingconfirmation`, {
      state: {
        flightInfo: flight,
      },
    });
  };

  return (
    <div className='Fresult'>
      <h1> Flight Search Result</h1>
      <img src={flightgif}/>
      {filteredFlights.length === 0 ? (
        <p>No flights found for the selected criteria.</p>
      ) : (
        filteredFlights.map((flight, index) => (
          <div key={index} className="flight-search-result">
            <p>Flight {index + 1}</p>
            <p><span>Flight Number:</span> {flight.flightNumber}</p>
            <p><span>Airline:</span> {flight.airline}</p>
            <p><span>Departure Time:</span> {flight.departureTime}</p>
            <p><span>Arrival Time: </span>{flight.arrivalTime}</p>
            <p><span>Departure Airport:</span> {flight.departureAirport}</p>
            <p><span>Arrival Airport:</span> {flight.arrivalAirport}</p>
            <p><span>Price: </span>{flight.price}</p>
            
            <button className="book" onClick={() => handleBook(flight)}>
              Book
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FlightsResult;

