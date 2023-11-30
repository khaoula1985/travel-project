import React from 'react'
import stars from "./../images/togetherrr.gif"
import './waitmailconfirmation.css'

const waitmailconfirmation = () => {
  return (
    <div className='confirmation'> 
      <img src={stars} className="final"/>
      <h1>Thank you for travelling with us ❤️  </h1>
      <h3>Your booking confirmation has been sent to the provided email address</h3>
  
      </div>
  )
}

export default waitmailconfirmation