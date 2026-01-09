const User = require("../models/user.js");

module.exports.renderSignUpForm =  (req,res)=>{
    res.render("Users/signup.ejs",)
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome! You are logged in!");
            return res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("Users/login.ejs")
};

module.exports.login = async(req,res)=>{
  req.flash("success","Welcome back to Universa");
  const redirectUrl = res.locals.redirectUrl || "/listings"
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
  req.logout({ keepSessionInfo: true }, function (err) {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
}