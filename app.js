if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const users = require("./routes/user.js");

// ------- view + middleware -------
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(process.cwd(), "public")));

// ========== IMPORTANT CHANGES BELOW ==========

// ✅ use env Mongo URI (Atlas) instead of localhost
const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nestify";

// connect once (serverless safe)
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo connection error:", err));

// ✅ use env PORT fallback (for local only)
const PORT = process.env.PORT || 8080;

// 🔐 session secret should come from env
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "devsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// -------- passport --------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// -------- routes --------
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// root
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  console.error(
    `ERROR ${status} on ${req.method} ${req.originalUrl} → ${message}`
  );
  console.error(err.stack);

  res.status(status).render("Listings/error.ejs", { message });
});

// ========== KEY PART FOR VERCEL ==========

// 👉 export app (Vercel uses this)
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
