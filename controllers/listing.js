const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.render("Listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("Listings/new.ejs");
  //   console.log(req.user)
};

module.exports.createListing = async (req, res) => {
  //    if (!req.body.Listing.image) {
  //   req.body.Listing.image = undefined;   // trigger default
  // }
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.Listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
console.log(listing.reviews);
  res.render("Listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
 let originalImage = listing.image.url
 let originalimageurl = originalImage.replace("/upload","/upload/w_250")
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect(res.locals.redirectUrl);
  }

  res.render("Listings/edit.ejs", { listing , originalimageurl});
};

module.exports.updateListing = async (req, res) => {
  //  if (!req.body.Listing.image) {
  // req.body.Listing.image = undefined;   // trigger default
  // }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });

 if (req.body.Listing.geometry) {
    listing.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(req.body.Listing.geometry.coordinates[0]),
        parseFloat(req.body.Listing.geometry.coordinates[1])
      ]
    };
  }


  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect("/Listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
