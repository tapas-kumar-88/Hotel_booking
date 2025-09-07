import React, { useContext } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Hotels from "./pages/Hotels.jsx"
import Rooms from "./pages/Rooms.jsx"
import SingleRoom from "./pages/SingleRoom.jsx"
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import About from "./pages/About.jsx"
import MyBookings from "./pages/MyBookings.jsx"
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { Toaster } from 'react-hot-toast'
import { AppContext } from './context/AppContext.jsx'
import OwnerLayout from './pages/owner/OwnerLayout.jsx'
import AllHotels from './pages/owner/AllHotels.jsx'
import RegisterHotel from './pages/owner/RegisterHotel.jsx'
import AllRooms from './pages/owner/AllRooms.jsx'
import AddRoom from './pages/owner/AddRoom.jsx'
import Bookings from './pages/owner/Bookings.jsx'
import Loader from './components/Loader.jsx'

const App = () => {
  const ownwerPath = useLocation().pathname.includes("owner");
  const {owner} = useContext(AppContext);
  return (
    <div className='w-full mx-auto'>
      <Toaster />
      {!ownwerPath && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:id" element={<SingleRoom />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/loader/:nextUrl" element={<Loader />} />

        <Route path='/owner' element={owner ? <OwnerLayout /> : <Login />}>
          <Route index element={owner ? <AllHotels /> : <Login />}/>
          <Route path='register-hotel' element={owner ? <RegisterHotel /> : <Login />}/>
          <Route path='rooms' element={owner ? <AllRooms /> : <Login />}/>
          <Route path='add-room' element={owner ? <AddRoom /> : <Login />}/>
          <Route path='bookings' element={owner ? <Bookings /> : <Login />}/>
        </Route>
      </Routes>
      {!ownwerPath && <Footer/>}
    </div>
  )
}

export default App
