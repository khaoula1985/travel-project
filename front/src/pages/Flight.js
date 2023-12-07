import React, { useState, useEffect } from 'react';
import { ImAirplane } from 'react-icons/im';
import avions from '../images/giphy.gif';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Flight.css';
import refreshSound from './../images/call-to-attention.mp3';
import { RiAdminLine } from "react-icons/ri";

const Flight = () => {
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [allFlights, setAllFlights] = useState([]);
  const [showNoFlightsMessage, setShowNoFlightsMessage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const loadUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      const userId = decoded.userId;
      axios.get(`http://localhost:8080/user/${userId}`)
        .then((response) => {
          const user = response.data;
          setIsAdmin(user.isAdmin);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8080/flight').then((response) => {
      setAllFlights(response.data);
    });
    playRefreshSound();
    loadUserInfo();
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

  const handleAddFlight = async () => {
    console.log('Adding a new flight...', newFlight);
    try {
      const response = await axios.post('http://localhost:8080/flight', newFlight);
      console.log('Flight added successfully:', response.data);
    } catch (error) {
      console.error('Error adding flight:', error.message);
    }
  };

  const [newFlight, setNewFlight] = useState({
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    departureTime: '',
    airline: '',
    flightNumber: '',
    arrivalTime: '',
    price: 0,
  });

  const handleNewFlightChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((prevFlight) => ({ ...prevFlight, [name]: value }));
  };

  return (
    <div className='flight'>
      <h1>Let your dreams take a flight!</h1>
      <img src={avions} className="avions" alt="Airplane" />
      <div className='Flights'>
        <ImAirplane style={{ color: '#e28743' }} />
        <h3>Flights</h3>
        <form onSubmit={handleFormSubmit}>
          <div className='Date'>
            <div style={{ marginLeft: '170px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
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
            <div style={{ marginLeft: '300px' }}>
              <label htmlFor='arrivalAirport'>Arrival Airport:</label>
              <select
                id='arrivalAirport'
                style={{ height: '25px', marginLeft: '-7px' }}
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
          <button type="submit">Search</button>
        </form>

        {isAdmin && (
          <div className='add-flight-section'>
            <h1>Add a New Flight <RiAdminLine/></h1>
            <form>
              <div>
                <label htmlFor='departureAirport'>Departure Airport:</label>
                <select
                  id='departureAirport'
                  name='departureAirport'
                  style={{ height: '25px' }}
                  value={newFlight.departureAirport}
                  onChange={handleNewFlightChange}
                >
                  <option value=''>Departure Airport</option>
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
              <div>
                <label htmlFor='arrivalAirport'>Arrival Airport:</label>
                <select
                  id='arrivalAirport'
                  name='arrivalAirport'
                  style={{ height: '25px' }}
                  value={newFlight.arrivalAirport}
                  onChange={handleNewFlightChange}
                >
                  <option value=''>Arrival Airport</option>
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
              <div>
                <label htmlFor='departureDate'>Departure Date:</label>
                <input
                  type='date'
                  id='departureDate'
                  name='departureDate'
                  style={{ height: '25px' }}
                  value={newFlight.departureDate}
                  onChange={handleNewFlightChange}
                />
              </div>
              <div>
                <label htmlFor='airline'>Airline:</label>
                <input
                  type='text'
                  id='airline'
                  name='airline'
                  style={{ height: '25px' }}
                  value={newFlight.airline}
                  onChange={handleNewFlightChange}
                />
              </div>
              <div>
                <label htmlFor='flightNumber'>Flight Number:</label>
                <input
                  type='text'
                  id='flightNumber'
                  name='flightNumber'
                  style={{ height: '25px' }}
                  value={newFlight.flightNumber}
                  onChange={handleNewFlightChange}
                />
              </div>
              <div>
                <label htmlFor='departureTime'>Departure Time:</label>
                <input
                  type='time'
                  id='departureTime'
                  name='departureTime'
                  style={{ height: '25px' }}
                  value={newFlight.departureTime}
                  onChange={handleNewFlightChange}
                />
              </div>
              <div>
                <label htmlFor='arrivalTime'>Arrival Time:</label>
                <input
                  type='time'
                  id='arrivalTime'
                  name='arrivalTime'
                  style={{ height: '25px' }}
                  value={newFlight.arrivalTime}
                  onChange={handleNewFlightChange}
                />
              </div>
              <div>
                <label htmlFor='price'>Price:</label>
                <input
                  type='number'
                  id='price'
                  name='price'
                  style={{ height: '25px' }}
                  value={newFlight.price}
                  onChange={handleNewFlightChange}
                />
              </div>
             
              <button type='button' onClick={handleAddFlight}>
                Add Flight
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flight;


