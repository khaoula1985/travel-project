import React, { useState, useEffect } from 'react';
import { MdLocalHotel } from 'react-icons/md';
import CreateHotelForm from './CreateHotelForm';
import axios from 'axios';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HotelsPage from '../images/hotelspage.png';
import jwt_decode from 'jwt-decode';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { RiAdminLine } from "react-icons/ri";
import './hotels.css';

const HotelList = ({ hotels, handleEdit, handleDelete, isAdmin, handleBook }) => {
  return (
    <div className="hotel-list">
      <div className="row">
        <h1>Our Hotels List</h1>
        {hotels.map((hotel) => (
          <div key={hotel._id} className="col-md-3 mb-4" style={{ marginLeft: "80px" }}>
            <div className="card">
              <img src={hotel.image} alt="Hotel Images" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title" style={{ textAlign: "center" }}>{hotel.name}</h5>
                <p className="card-text">City: {hotel.city}</p>
                <p className="card-text">Rating: {hotel.rating}</p>
                <p className="card-text">Address: {hotel.address}</p>
                {hotel.searchParams && ( // Check if hotel has search parameters
                  <div>
                    <h5>Booking Details</h5>
                    <p>Max Persons: {hotel.maxPersons}</p>
                    <p>Check-in Date: {hotel.checkInDate}</p>
                    <p>Check-out Date: {hotel.checkOutDate}</p>
                    <p>Total Price: {hotel.totalPrice}</p>
                  </div>
                )}
                <div className='Buttons'>
                  <button className="btnedit" onClick={() => handleEdit(hotel)} disabled={!isAdmin}>
                    <AiFillEdit />
                  </button>
                  <button className="btndel" onClick={() => handleDelete(hotel._id)} disabled={!isAdmin}>
                    <AiFillDelete />
                  </button>
                  <button className="btnbook" onClick={() => handleBook(hotel)}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    maxPersons: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [editingHotel, setEditingHotel] = useState(null);
  const [editedHotel, setEditedHotel] = useState({
    name: '',
    city: '',
    address: '',
    rating: 0,
    image: '',
    rooms: [],
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    loadHotels();
    loadUserInfo();
  }, []);

  useEffect(() => {
    const { destination, checkInDate, checkOutDate, maxPersons } = location.state || {};

    if (destination && checkInDate && checkOutDate && maxPersons) {
      setSearchParams({
        destination,
        checkInDate,
        checkOutDate,
        maxPersons,
      });

      handleSearch();
    }
  }, [location.state]);

  const loadHotels = () => {
    axios.get('http://localhost:8080/hotel')
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.error('Error fetching hotels:', error);
      });
  };

  const loadUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      const userId = decoded.userId;
      axios.get(`http://localhost:8080/user/${userId}`)
        .then((response) => {
          const user = response.data;
          console.log(user);
          setIsAdmin(user.isAdmin);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setEditedHotel({ ...hotel });
  };

  const handleSave = () => {
    axios.put(`http://localhost:8080/hotel/${editingHotel._id}`, editedHotel)
      .then((response) => {
        console.log('Hotel updated successfully:', response.data);
        const updatedHotels = hotels.map((h) => (h._id === editingHotel._id ? editedHotel : h));
        setHotels(updatedHotels);
        setEditingHotel(null);
      })
      .catch((error) => {
        console.error('Error updating hotel:', error);
      });
  };

  const handleDelete = (hotelId) => {
    axios.delete(`http://localhost:8080/hotel/${hotelId}`)
      .then((response) => {
        console.log(`Deleted hotel with ID: ${hotelId}`);
        loadHotels();
      })
      .catch((error) => {
        console.error('Error deleting hotel:', error);
      });
  };

  const handleSearch = () => {
    axios.get('http://localhost:8080/hotel')
      .then((response) => {
        const filteredHotels = response.data.map((h) => {
          const destinationMatch = (h.city && h.city.toLowerCase().includes(searchParams.destination.toLowerCase())) ||
            (h.address && h.address.toLowerCase().includes(searchParams.destination.toLowerCase()));
          const roomAvailable = h.rooms.some((room) => {
            return room.unavailableDates.every((date) => {
              return date < searchParams.checkInDate || date > searchParams.checkOutDate;
            });
          });
          const maxPersonsMatch = h.rooms.some((room) => {
            return room.maxOccupancy >= parseInt(searchParams.maxPersons, 10);
          });
  
          if (destinationMatch && roomAvailable && maxPersonsMatch) {
            const numberOfNights = calculateNumberOfNights(searchParams.checkInDate, searchParams.checkOutDate);
            const totalPrice = calculateTotalPrice(h.rooms[0].pricePerNight, parseInt(searchParams.maxPersons, 10), numberOfNights);
  
            const hotelDetails = {
              ...h,
              searchParams: { ...searchParams },
              maxPersons: parseInt(searchParams.maxPersons, 10),
              checkInDate: searchParams.checkInDate,
              checkOutDate: searchParams.checkOutDate,
              totalPrice,
            };
  
            console.log('Filtered Hotel:', hotelDetails);
            return hotelDetails;
          }
  
          return null;
        }).filter(Boolean);
  
        console.log('Filtered Hotels:', filteredHotels);
        
        if (filteredHotels.length === 0) {
          // Display a message when there are no available hotels
          alert("Sorry, no available hotels.");
        }
  
        setHotels(filteredHotels);
      })
      .catch((error) => {
        console.error('Error searching hotels:', error);
      });
  };
  
  
  const calculateNumberOfNights = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut - checkIn;
    const numberOfNights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return numberOfNights;
  };
  
  const calculateTotalPrice = (pricePerNight, maxPersons, numberOfNights) => {
    return pricePerNight * maxPersons * numberOfNights;
  };
  
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleBook = (hotel) => {
    navigate(`/bookingconfirmation`, {
      state: {
        bookingInfo: {
          hotelName: hotel.name, 
          maxPersons: hotel.maxPersons || 0,
          checkInDate: hotel.checkInDate || '',
          checkOutDate: hotel.checkOutDate || '',
          totalPrice: hotel.totalPrice || 0,
        },
      },
    });
  };

  return (
    <div className="hotels">
      <h1>Welcome to Our Hotels<MdLocalHotel /></h1>
      <img src={HotelsPage} className='hotelspage' />
      <div className='servicebox'>
        <div className='Hotels'>
        
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
            placeholder="Where are you going?"
            style={{ height: '25px' }}
          />
          <div className='dates' style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div>
              <label htmlFor="checkInDate">Check-in Date:</label>
              <input
                type="date"
                id="checkInDate"
                value={searchParams.checkInDate}
                onChange={(e) => setSearchParams({ ...searchParams, checkInDate: e.target.value })}
                placeholder="Enter your check-in Date"
                style={{ height: '25px' }}
              />
            </div>
            <div>
              <label htmlFor="checkOutDate">Check-out Date:</label>
              <input
                type="date"
                id="checkOutDate"
                value={searchParams.checkOutDate}
                onChange={(e) => setSearchParams({ ...searchParams, checkOutDate: e.target.value })}
                placeholder="Enter your check-out Date"
                style={{ height: '25px' }}
              />
            </div>
            <div>
              <label htmlFor="maxPersons">Max Persons:</label>
              <input
                type="number"
                id="maxPersons"
                value={searchParams.maxPersons}
                onChange={(e) => setSearchParams({ ...searchParams, maxPersons: e.target.value })}
                placeholder="Enter number of persons"
                style={{ height: '25px' }}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            style={{ borderRadius: "10px", padding: "3px", marginTop: "20px" }}
          >
            Search
          </button>
        </div>
      </div>
      <HotelList
        hotels={hotels.map((hotel) => ({
          ...hotel,
          maxPersons: hotel.maxPersons || 0,
          checkInDate: hotel.checkInDate || '',
          checkOutDate: hotel.checkOutDate || '',
          totalPrice: hotel.totalPrice || 0,
        }))}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isAdmin={isAdmin}
        handleBook={handleBook}
      />

      {editingHotel && (
        <div className="edit-hotel-form">
          <h1>Edit Hotel <RiAdminLine/></h1>
          <input
            type="text"
            value={editedHotel.name}
            onChange={(e) => setEditedHotel({ ...editedHotel, name: e.target.value })}
            placeholder="Hotel Name"
          />
          <input
            type="text"
            value={editedHotel.city}
            onChange={(e) => setEditedHotel({ ...editedHotel, city: e.target.value })}
            placeholder="City"
          />
          <input
            type="text"
            value={editedHotel.address}
            onChange={(e) => setEditedHotel({ ...editedHotel, address: e.target.value })}
            placeholder="Address"
          />
          <input
            type="number"
            value={editedHotel.rating}
            onChange={(e) => setEditedHotel({ ...editedHotel, rating: e.target.value })}
            placeholder="Rating"
          />

          <input
            type="text"
            value={editedHotel.image}
            onChange={(e) => setEditedHotel({ ...editedHotel, image: e.target.value })}
            placeholder="Images"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      <Outlet />
      <div className='create'>
        {isAdmin && <CreateHotelForm fetchHotels={loadHotels} />}
      </div>
    </div>
  );
};

export default Hotels;
