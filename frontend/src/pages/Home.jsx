import React from 'react'
import Hero from '../components/Hero.jsx';
import MostPicked from '../components/MostPicked.jsx';
import PopularRooms from '../components/PopularRooms.jsx';
import Testimonials from '../components/Testimonials.jsx';
import NewsLatter from '../components/NewsLatter.jsx';

const Home = () => {
  return (
    <div className='py-24'>
      <Hero/>
      <MostPicked/>
      <PopularRooms/>
      <Testimonials/>
      <NewsLatter/>
    </div>
  )
}

export default Home
