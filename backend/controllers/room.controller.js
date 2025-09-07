import Room from "../models/room.model.js";

// Add New Room
export const addRoom = async (req, res) => {
    try {
        const { roomType, hotel, pricePerNight, description, amenities, isAvailable } = req.body;
        const image = req.files?.map((file) => file.filename);
        const newRoom = new Room({
            roomType,
            hotel,
            pricePerNight,
            description,
            amenities,
            isAvailable,
            images: image,
        });
        await newRoom.save();
        return res.status(201).json({ message: "Room added successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Rooms for specific owner
export const getOwnerRooms = async (req,res) =>{
    try {
        const {id} = req.user;
        const rooms = await Room.find().populate({
            path: "hotel",
            match: { owner: id },
            select: "hotelName hotelAddress rating amenities",
        });
        const ownerRooms = rooms.filter((room) => room.hotel.owner === id);
        return res.status(200).json({rooms, success: true});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

// Get all rooms for user
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate({
            path: "hotel",
            select: "hotelName hotelAddress amenities rating owner",
            populate: {
                path: "owner",
                select: "name email",
            }
        }).exec();
        return res.status(200).json({ rooms, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Room
export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(roomId);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json({ message: "Room deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};