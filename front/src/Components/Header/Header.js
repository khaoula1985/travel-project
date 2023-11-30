import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../images/logo.jpg';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    // Remove the user token from local storage to log them out
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="nav">
        {/* logo */}
        <div className="logo">
          <img src={logo} alt="Logo" style={{ marginLeft: "80px", marginTop: "-23px", height: "55px", width: "70px", boxShadow: "none" }} />
        </div>
        {/* logo */}
        {/* navbar menu */}
        <div className="navbar">
          <ul className="nav_items d-flex align-items-center justify-content-between">
            <li className="nav-tem"><Link to="/">Home</Link></li>
            <li className="nav-tem"><Link to="/hotel">Hotels</Link></li>
            <li className="nav-tem"><Link to="/flight">Flights</Link></li>
            <li className="nav-tem"><Link to="/tours">Trips</Link></li>
            <li className="nav-tem"><Link to="/gallery">Photos & Memories</Link></li>
          </ul>
        </div>
        <div className="nav_buttons">
          {isLoggedIn ? (
            <button className="log_out" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <button className="login_btn">
                <Link to="/login">Login</Link>
              </button>
              <button className="register_btn">
                <Link to="/register">Register</Link>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
