const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url:String,
    filename:String
    // type: String,
    // default: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&h=400&auto=format&fit=crop&q=80",
    // set: v => (v === "" ? undefined : v)
  },
  price: Number,
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
    
  ],
  owner:  {
    type: Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});



const Listing = new mongoose.model("Listing", listingSchema);

module.exports = Listing;
