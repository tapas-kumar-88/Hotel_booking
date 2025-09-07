import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
    },
    hotelAddress: {
      type: String,
      required: true,
    },
    rating: {
      type: Number, // better as number
      required: true,
    },
    price: {
      type: Number, // better as number
      required: true,
    },
    amenities:
      {
        type: [String], // store multiple amenities
        required: true,
      },
    
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
