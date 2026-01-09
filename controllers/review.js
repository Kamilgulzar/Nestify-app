const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  await Listing.findByIdAndUpdate(id,{ $push: { reviews:review._id}}) 
 req.flash("success","Review created!")
    
   res.redirect(`/listings/${listing._id}`); 
  }

module.exports.destroyReview = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
 req.flash("success","Review deleted!")
   res.redirect(`/listings/${id}`);
};