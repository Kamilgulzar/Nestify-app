const mongoose = require("mongoose");
const Listing = require("../models/listing");  // adjust path if needed

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

async function migrate() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB ✅");

  const result = await Listing.updateMany(
    { "image.url": { $exists: true } },   // only old docs
    [
      { $set: { image: "$image.url" } }   // replace with just the url string
    ]
  );

  console.log(`Updated ${result.modifiedCount} documents`);
  mongoose.connection.close();
}

migrate().catch(err => {
  console.error("Migration failed ❌", err);
  mongoose.connection.close();
});
