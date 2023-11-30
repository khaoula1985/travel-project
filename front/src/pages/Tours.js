import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { RiAdminLine } from "react-icons/ri";
import book from './../images/giphy2.gif';
import './Tours.css';

const Tours = () => {
  const [file, setFile] = useState(null);
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [tourItems, setTourItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    //loadTourItems();
    loadUserInfo();
  }, []);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
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

  const handleTourUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination', destination);
    formData.append('rating', rating);
    formData.append('price', price);

    try {
      
      await axios.post('http://localhost:8080/tour', formData);

      setFile(null);
      setDestination('');
      setPrice('');
      setRating('');
      loadTourItems();
    } catch (error) {
      console.log('Error handling tour upload:', error);
    }
  };

  const loadTourItems = () => {
    axios
      .get('http://localhost:8080/getTourItems')
      .then((res) => {
        setTourItems(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadTourItems();
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      setIsAdmin(decoded.isAdmin);
    }
  }, []);

  const handleEdit = (itemId) => {
    if (isAdmin){
    setEditItemId(itemId);
    const itemToEdit = tourItems.find((item) => item._id === itemId);
    if (itemToEdit) {
      setDestination(itemToEdit.destination);
      setPrice(itemToEdit.price);
      setRating(itemToEdit.rating);
      setFile(itemToEdit.image);
    }
  }else
  {
    alert("Sorry your are not allowed to edit Trip!")
  }
  };

  const handleSaveEdit = async () => {
    try {
      if (editItemId) {
        const formData = new FormData();

        if (file) {
          formData.append('file', file);
        }

        formData.append('destination', destination);
        formData.append('rating', rating);
        formData.append('price', price);

        const response = await axios.put(
          `http://localhost:8080/tour/${editItemId}`,
          formData
        );

        console.log('FormData:', formData);

        setEditItemId(null);

        // Update the edited fields in the front-end
        setTourItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editItemId
              ? {
                  ...item,
                  destination,
                  price,
                  rating,
                 
                }
              : item
          )
        );

        setFile(null);
        setDestination('');
        setPrice('');
        setRating('');
      }
    } catch (error) {
      console.log('Error saving changes:', error);
    }
  };

  const handleDelete = async (tourId) => {
    try {
      if (isAdmin) {
        await axios.delete(`http://localhost:8080/tour/${tourId}`);
        loadTourItems();
      } else {
        alert('You do not have permission to delete tours.');
      }
    } catch (error) {
      console.log('Error deleting tour:', error);
    }
  };

  const handleBook = (tour) => {
    navigate('/bookingTour', { state: { tour } });
  };

  return (
    <div className='container-tour'>
      <h1>Let's travel together!</h1>
      <div className="rotate-image">
        <img src={book} className="booknow" alt="book-now" />
      </div>
      <div className='Tourscards'>
        {tourItems.map((item, index) => (
          <Card key={index} style={{ width: '18rem' }}>
            <Card.Img
              variant="top"
              src={`http://localhost:8080/uploads/${item.image}`}
              className="cardimage"
              alt="tour-img"
            />
            <Card.Body>
              <Card.Title>{item.destination}</Card.Title>
              <Card.Text>
                <p>
                  <span>Price:</span> {item.price}
                </p>
              </Card.Text>
              <Card.Text>
                <p>
                  <span>Rating:</span> {item.rating}
                </p>
              </Card.Text>
              <Card.Text>
                <p>
                  <span>Date:</span> {new Date(item.createdAt).toDateString()}
                </p>
              </Card.Text>
              <Button variant="danger" onClick={() => handleDelete(item._id)}>
                Delete
              </Button>
              {editItemId === item._id ? (
                <>
                  <input type="file" onChange={handleImageChange} />
                  <input
                    type="text"
                    value={destination}
                    onChange={handleDestinationChange}
                  />
                  <input
                    type="number"
                    value={price}
                    onChange={handlePriceChange}
                  />
                  <input
                    type="number"
                    value={rating}
                    onChange={handleRatingChange}
                  />
                  <Button variant="success" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="info" onClick={() => handleEdit(item._id)}>
                  Edit
                </Button>
              )}
              <Button variant="primary" onClick={() => handleBook(item)}>
                Book
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      {isAdmin && (
        <div className='addTour' style={{ marginTop: '200px' }}>
          <h3>Add a Tour <RiAdminLine /></h3>
          <input type="file" onChange={handleImageChange} />
          <p>Destination</p>
          <input
            type="text"
            value={destination}
            onChange={handleDestinationChange}
          />
          <p>Price</p>
          <input type="number" value={price} onChange={handlePriceChange} />
          <p>Rating</p>
          <input type="number" value={rating} onChange={handleRatingChange} />
          <Button variant="primary" onClick={handleTourUpload}>
            Upload
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tours;
