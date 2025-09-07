import React, { useContext } from 'react';
import {motion} from "motion/react";
import { AppContext } from '../context/AppContext.jsx';

const RoomCard = ({room}) => {
    const {navigate} = useContext(AppContext);
  return (
    <motion.div
        whileHover={{scale:1.1}}
        transition={{duration:2, ease:"easeInOut"}}
    >
      <div className='rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out max-w-80 bg-white px-3 md:px-5'>
        <img src={`http://localhost:4000/images/${room.images[0]}`} alt="" className='w-full h-52 object-cover'/>
        <h1 className='mt-3 px-4 pt-3 mb-1 text-lg font-semibold text-heading'>
            {room.roomType}
        </h1>
        <div className='flex items-center gap-4 justify-between'>
            <p className='text-sm px-4 text-gray-600'>${room.pricePerNight}/per night</p>
            <button onClick={()=>{
                navigate(`/room/${room._id}`);
                window.scrollTo({top:0, behavior:"smooth"});
            }}
            className='bg-primary text-white rounded-md px-4 py-1 mb-3 cursor-pointer'
            >
                See Details</button>
        </div>
      </div>
    </motion.div>
  )
}

export default RoomCard
