
import { Routes, Route, Navigate } from 'react-router-dom' // Corrected import statement
import Home from '../pages/Home'
import Tours from '../pages/Tours'
import Flightbookingconfirmation from '../pages/flightbookingconfirmation'
import SearchResultList from '../pages/SearchResultList'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Gallery from '../pages/Gallery'
import Hotels from '../pages/hotels'
import Flight from '../pages/Flight'
import FlightsResult from '../pages/FlightsResult'
import BookingConfirmation from '../pages/BookingConfirmation'
import Waitmailconfirmation from '../pages/waitmailconfirmation'
import BookingTour from '../pages/bookingTour'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/tours' element={<Tours />} />
      <Route path='/tours/search' element={<SearchResultList />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/gallery' element={<Gallery />} />
      <Route path='/hotel' element={<Hotels />} />
      <Route path='/flight' element={<Flight />} />
     
      <Route path='/flight/searchresult' element={<FlightsResult />} />
      <Route path="/bookingconfirmation" element={<BookingConfirmation />} />
      <Route path="/waitmailconfirmation" element={<Waitmailconfirmation />} />
      <Route path="/flightbookingconfirmation" element={<Flightbookingconfirmation />} />
      <Route path="/bookingTour" element={<BookingTour />} />
    </Routes>
    
  )
}

export default Router
