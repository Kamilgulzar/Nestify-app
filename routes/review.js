const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapSync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview} = require('../middleware.js');
const {isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//New Review
//Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview)
);

//Delete review 
router.delete("/:reviewid",isLoggedIn, isAuthor, reviewController.destroyReview )


module.exports = router;