import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import Stripe from "stripe";

// function to check availability of room
export const checkAvaailability = async ({
    room, checkInDate, checkOutDate
}) => {
    try {
        const booking = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = booking.length === 0;
        return isAvailable;
    } catch (error) {
        console.log("error", error);
    }
};

//api to check availability of room
// POST /api/bookings/check-availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvaailability({
            room, checkInDate, checkOutDate
        });
        res.status(200).json({ success: true, isAvailable });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// api to book a room
// POST /api/bookings/book
export const bookRoom = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        const { room, checkInDate, checkOutDate, persons, paymentMethod } = req.body;

        // before booking Check availability
        const isAvailable = await checkAvaailability({
            room, checkInDate, checkOutDate
        });

        if (!isAvailable) {
            return res.status(400).json({ message: "Room is not available", success: false });
        }

        // get total price for room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // calculate totalPrice based on per night
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice = totalPrice * nights ;

        // Create a new booking
        const booking = await Booking.create({
            user: id,
            room,
            hotel: roomData.hotel._id,
            checkIn,
            checkOut,
            persons,
            totalPrice,
            paymentMethod,
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: " Room Booked Successfully",
            html: `
            <h1>Hotel Booking Confirmation</h1>
            <p>Dear ${user.name},</p>
            <p>Thank you for booking with us. Your booking details are as follows:</p>
            <ul>
                <li>Booking ID: ${booking._id}</li>
                <li>Hotel Name: ${roomData.hotel.hotelName}</li>
                <li>Room Type: ${roomData.roomType}</li>
                <li>Check-In Date: ${checkInDate}</li>
                <li>Check-Out Date: ${checkOutDate}</li>
                <li>Number of Persons: ${persons}</li>
                <li>Total Price: ${process.env.CURRENCY || "$"} ${totalPrice}</li>
            </ul>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "Room booked successfully"});
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// api to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.user;
        const bookings = await Booking.find({ user: id })
            .populate("room hotel")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

// api to get all bookings of a hotel
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
    try {
        const { id } = req.user;
        const hotels = await Hotel.find({ owner: id }).select("_id");
        if( !hotels ){
            return res.status(404).json({ message: "Hotel Not Found", success: false });
        }
        const hotelIds = hotels.map((hotel) => hotel._id);
        const bookings = await Booking.find({ hotel: { $in: hotelIds } })
            .populate("room hotel")
            .sort({ createdAt: -1 });
            if( bookings.length === 0 ){
                return res.status(404).json({ message: "No Bookings Found", success: false });
            }else{
                res.status(200).json({ success: true, bookings });
            }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const stripePayment = async (req,res) =>{
     
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;
    const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
        {
            price_data: {
                    currency: 'usd',
                    product_data: {
                        name: roomData.hotel.hotelName,
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
        },
    ];

    // creat checkout session
    const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${origin}/loader/my-bookings`,
        cancel_url: `${origin}/my-bookings`,
        metadata: {
            bookingId,
        },
    });
    await booking.updateOne({ isPaid: true, status: "confirmed"});
    res.json({ success: true, url: session.url });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}