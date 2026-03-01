const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review =require("./review");
const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String , required: true},
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
        }
    },
    price: { type: Number, min: [0, "Price must be a positive value"], default: 0 },
    location: { type: String,required: true },
    country: { type: String,required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    geometry : {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of [longitude, latitude]
            required: true
        }
    },
    category: {
        type: String,
        enum: ["Trending", "House", "Rooms", "Iconic cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farm", "Arctic"],
        required: true
    }
    
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;