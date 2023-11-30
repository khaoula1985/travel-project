import React from 'react';
import { Link } from 'react-router-dom';
import "./HotelsList.css";

const HotelList = ({ hotels, handleEdit, handleDelete }) => {
  return (
    <div className="hotel-list">
      <div className="row">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="col-md-3 mb-4" >
            <div className="card">
              <img src={hotel.image} alt="Hotel Images" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title" style={{textAlign:"center"}}>{hotel.name}</h5>
                <p className="card-text">City: {hotel.city}</p>
                <p className="card-text">Rating: {hotel.rating}</p>
                <p className="card-text">Address: {hotel.address}</p>
               
                <button className="btn btn-primary mr-2" onClick={() => handleEdit(hotel)}>Edit</button>
                <button className="btn btn-danger mr-2" onClick={() => handleDelete(hotel._id)}>Delete</button>
                <Link to={`/hoteldetails/${hotel._id}`} className="btn btn-info">See More</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelList;
