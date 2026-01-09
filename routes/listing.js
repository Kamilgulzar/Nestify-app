const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapSync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

//Index route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(validateListing, upload.single('Listing[image]'), wrapAsync(listingController.createListing));
 
//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('Listing[image]'),
    validateListing,

    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit route
router.get(
  "/:id/edit",
  saveRedirectUrl,
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
