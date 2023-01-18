const User = require("../models/user");

module.exports.registerForm = (req, res) => {
    res.render("register.ejs");
};

module.exports.registerUser = async(req, res, next) => {
    const { email, username, password } = req.body;
    const newUser = new User({
        email,
        username,
    });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
    });
    req.flash("success", "Welcome");
    res.redirect("/hospitals");
};
module.exports.loginUser = (req, res) => {
    res.render("login.ejs");
};
module.exports.authUser = async(req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/hospitals";
    delete req.session.returnTo;
    console.log(req.user._id);
    console.log("loggedin");
    res.redirect(redirectUrl);
};
module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/");
};