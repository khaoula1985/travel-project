import axios from "axios";
import React, { useState } from "react";
import './Register.css'
import registerimg from '../images/login.png';

const Register = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");


  const RegisterFunction = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/auth/register", {
        username,
        email,
        password,
      })
      .then(() => {
        console.log("welcome new user");
      })
      .catch((err) => {
        console.log(err.message);
        alert("Something went wrong , Check your informations");
      });
  };

  return (
    <>
    <div className="register">
      <h3>Register Form</h3>
      <form onSubmit={RegisterFunction}>
        <div className="username">
          <label htmlFor="username">username: </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => setusername(e.target.value)}
          />
        </div>
        <div className="email">
          <label htmlFor="email">email: </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="password">
          <label htmlFor="password">password: </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <button className="btn-register" type="submit" >Register</button> 
      </form>
    
    </div>
    <div className="register-img">
     <img  src={registerimg}/>
    </div>
    </>
  );
};

export default Register;