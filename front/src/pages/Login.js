import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"
import login from '../images/login.jpg'

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  let navigate = useNavigate();

  const loginFunction = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/auth/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.message);
        alert("Something went wrong. Check your credentials.");
      });
  };

  return (
    <>
    <div className="login">
      <h3>Login Form</h3>
      <form onSubmit={loginFunction}>
        <div className="email">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <button className="btn-login" type="submit" >Login</button> 
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/register">Register here</Link>
      </p>
         </div>
         <div className="login-img">
         <img  src={login}/>
         </div>
    
    </>
  );
};

export default Login;