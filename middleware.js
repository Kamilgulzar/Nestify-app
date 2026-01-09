const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema ,ReviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","User must be logged in before performing any task!");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
   let {id} = req.params
   let listing = await Listing.findById(id)
   console.log(listing.owner)
   if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permision to this listing")
    return res.redirect(`/listings/${id}`)
   }
   next();
}

module.exports.validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(",")
    );
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(",")
    );
  } else {
    next();
  }
};

module.exports.isAuthor = async(req,res,next)=>{
  let { id, reviewid } = req.params;
   let review = await Review.findById(reviewid)
   if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permision to this review")
    return res.redirect(`/listings/${id}`)
   }
   next();
}