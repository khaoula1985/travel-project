import React, { useState, useEffect } from 'react';
import { ImAirplane } from 'react-icons/im';
import avions from '../images/giphy.gif';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Flight.css'
import refreshSound from './../images/call-to-attention.mp3';

const Flight = () => {
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [allFlights, setAllFlights] = useState([]);
  const [showNoFlightsMessage, setShowNoFlightsMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/flight').then((response) => {
      setAllFlights(response.data);
    });
    playRefreshSound();
  }, []);
  const playRefreshSound = () => {
    const audio = new Audio(refreshSound);
    audio.play();
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formattedDepartureDate = new Date(departureDate).toISOString().split('T')[0];

    const filteredFlights = allFlights.filter((flight) => {
      return (
        flight.departureAirport === departureAirport &&
        flight.arrivalAirport === arrivalAirport &&
        flight.departureDate.split('T')[0] === formattedDepartureDate
      );
    });

    if (filteredFlights.length === 0) {
      setShowNoFlightsMessage(true);
    } else {
      navigate('/flight/searchresult', { state: { filteredFlights } });
    }
  };

  return (
    <div className='flight'>
      <h1>
        Let your dreams take a flight!
      </h1>
      <img src={avions} className="avions"  />
      <div className='Flights' >
        <ImAirplane style={{ color: '#e28743' }} />
        <h3>Flights</h3>
        <form onSubmit={handleFormSubmit}>
          <div className='Date' >
            <div style={{ marginLeft: "170px" }}>
              <label htmlFor='departureDate'>Departure Date:</label>
              <input
                type='date'
                id='departureDate'
                placeholder='Enter your Departure Date'
                style={{ height: '25px' }}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <label htmlFor='departureAirport'>Departure Airport:</label>
              <select
                id='departureAirport'
                style={{ height: '25px' }}
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
              >
                <option value=''>Select Departure Airport</option>
                <option value='TUN'>Tunis-Carthage TUN</option>
                <option value='PAL'>Alquds-PAL</option>
                <option value='FCO'>Rome-FCO</option>
                <option value='BER'>Berlin-BER</option>
                <option value='BCN'>Barcelone-BCN</option>
                <option value='LON'>London-LON</option>
                <option value='CAI'>Caire-CAI</option>
                <option value='ORY'>Paris-ORY</option>
                <option value='IST'>Istanbul-IST</option>
              </select>
            </div>
            <div style={{ marginLeft: "300px" }}>
              <label htmlFor='arrivalAirport'>Arrival Airport:</label>
              <select
                id='arrivalAirport'
                style={{ height: '25px', marginLeft:"-7px" }}
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
              >
                <option value=''>Select Arrival Airport</option>
                <option value='TUN'>Tunis-Carthage TUN</option>
                <option value='PAL'>Alquds-PAL</option>
                <option value='FCO'>Rome-FCO</option>
                <option value='BER'>Berlin-BER</option>
                <option value='BCN'>Barcelone-BCN</option>
                <option value='LON'>London-LON</option>
                <option value='CAI'>Caire-CAI</option>
                <option value='ORY'>Paris-ORY</option>
                <option value='IST'>Istanbul-IST</option>
              </select>
            </div>
          </div>
          <button  type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Flight;
