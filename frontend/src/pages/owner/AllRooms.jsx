import React, { useContext,useEffect,useState } from 'react'
import { AppContext } from '../../context/AppContext.jsx'
import { motion} from 'motion/react';
import {MapIcon, Star} from 'lucide-react'
import { toast } from 'react-hot-toast';

const AllRooms = () => {
    const {navigate,axios } = useContext(AppContext);

    const [roomData, setRoomData] = useState([]);
    const fetchOwnerRooms = async () => {
      try {
        const {data} = await axios.get('/api/room/get');
        if(data.success){
          setRoomData(data.rooms);
        }else{
          toast.error(data.message);
        }
        
      } catch (error) {
        toast.error(error.message);
      }
    };
    useEffect(() => {
      fetchOwnerRooms();
    }, []);

  const deleteRoom = async (id) => {
    try {
      const {data} = await axios.delete("/api/room/delete/"+id);
      if(data.success){
        toast.success(data.message);
        fetchOwnerRooms();
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* header */}
        <div className='mb-8 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-xl p-6'>
          <div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'> Your All Rooms</h1>
            <p className='text-gray-600'>
              Manage your rooms here
            </p>
          </div>
          <motion.button
            className='bg-primary text-white px-6 py-1 rounded-md cursor-pointer'
            onClick={() => navigate("/owner/add-room")}
            whileHover={{scale: 1.05}}
            transition={{ease: "easeInOut", duration:0.3}}
          >Add New Room</motion.button>
        </div>

        {/* Room Table */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Hotel
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Room Type
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Location
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Rating
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Price/Night
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Amenities
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>
                {roomData.map((room,index) =>(
                  <tr
                    key={room._id}
                    className={`hover:bg-blue-50 transition-all duration-200' ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className='px-6 py-6'>
                      <div className='flex items-center space-x-4'>
                        <div className='relative'>
                          <img src={`http://localhost:4000/images/${room.images[0]}`} alt={room.roomType} className='w-20 h-16 rounded-xl object-cover shadow-md'/>
                          <div className='absolute inset-0 bg-gradient-to-t from-black/20'></div>
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors'>
                            {room.hotel.hotelName}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-6'>
                      <div className='flex items-start space-x-2'>
                        <MapIcon className='w-4 h-4 text-gray-400 mt-1 flex-shrink-0'/>
                        <span className='text-gray-600 text-sm leading-relaxed'>{room.roomType}</span>
                      </div>
                    </td>
                    <td className='px-6 py-6'>
                      <div className='flex items-start space-x-2'>
                        <span className='text-gray-600 text-sm leading-relaxed'>{room.hotel.hotelAddress}</span>
                      </div>
                    </td>
                    <td className='px-6 py-6'>
                      <div className='flex items-start space-x-2'>
                        <Star className='w-4 h-4 text-yellow-400 fill-current'/>
                        <span className='text-gray-600 text-sm leading-relaxed'>{room.hotel.rating}</span>
                      </div>
                    </td>
                    <td className='px-6 py-6'>
                      <div className='flex items-start space-x-2'>
                        <span className='text-gray-600 text-sm leading-relaxed'>${room.pricePerNight}</span>
                      </div>
                    </td>
                    
                    <td className='px-6 py-6'>
                      <div className='flex flex-wrap gap-1'>
                        {room.amenities.split(",").map((amenity,index) =>(
                          <span key={index} className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full'>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={() => deleteRoom(room._id)}
                        className='bg-red-500 text-white py-1 px-4 rounded-full cursor-pointer'>
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllRooms

