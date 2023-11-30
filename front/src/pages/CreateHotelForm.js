import React, { useState } from 'react';
import axios from 'axios';
import "./CreateHotelForm.css"
import { RiAdminLine } from "react-icons/ri";

const HotelCreateForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('');
  const [rooms, setRooms] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      { roomNumber: '', maxOccupancy: 1, pricePerNight: 0, unavailableDates: '' },
    ]);
  };

  const handleHotelUpload = async () => {
    try {
      if (!name || !city || !file) {
        setErrorMessage('Please fill in all required fields (Name, City, Image).');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('city', city);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('rating', rating);

      // Append the room data as an array of objects
      rooms.forEach((room, index) => {
        formData.append(`rooms[${index}][roomNumber]`, room.roomNumber);
        formData.append(`rooms[${index}][maxOccupancy]`, room.maxOccupancy);
        formData.append(`rooms[${index}][pricePerNight]`, room.pricePerNight);
        formData.append(`rooms[${index}][unavailableDates]`, room.unavailableDates);
      });

      // Append the image file
      formData.append('image', file);

      // Send the hotel data to the server
      await axios.post('http://localhost:8080/hotel', formData);

      // Clear the form fields
      setFile(null);
      setName('');
      setCity('');
      setDescription('');
      setAddress('');
      setRating('');
      setRooms([]);
      setSuccessMessage('Hotel added successfully!');
      setErrorMessage('');
    } catch (error) {
      console.log('Error handling hotel upload:', error);
      setSuccessMessage('');
      setErrorMessage('Error adding hotel. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Add Hotel <RiAdminLine/></h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="hotel-form">
        <input type="file" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Hotel Name"
          value={name}
          onChange={handleNameChange}
        />
        <input type="text" placeholder="City" value={city} onChange={handleCityChange} />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <input type="text" placeholder="Address" value={address} onChange={handleAddressChange} />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={handleRatingChange}
        />
        <h3>Rooms</h3>
        <button type="button" onClick={addRoom}>
          Add Room
        </button>
        {rooms.map((room, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Room Number"
              value={room.roomNumber}
              onChange={(e) => handleRoomChange(index, 'roomNumber', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Occupancy"
              value={room.maxOccupancy}
              onChange={(e) => handleRoomChange(index, 'maxOccupancy', e.target.value)}
            />
            <input
              type="number"
              placeholder="Price Per Night"
              value={room.pricePerNight}
              onChange={(e) => handleRoomChange(index, 'pricePerNight', e.target.value)}
            />
            <input
              type="text"
              placeholder="Unavailable Dates (comma-separated)"
              value={room.unavailableDates}
              onChange={(e) => handleRoomChange(index, 'unavailableDates', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleHotelUpload}>
          Add Hotel
        </button>
      </div>
    </div>
  );
};

export default HotelCreateForm;
