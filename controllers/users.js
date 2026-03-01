const user = require("../models/user");

module.exports.signup= (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.register = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const registeredUser = await user.register(newUser, password);
        req.login(registeredUser, (error) => {
            if (error) {
                return next(error);
            }
            req.flash("success", `Welcome ${req.user.username}! Signed Up successfully`);

            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
module.exports.login = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.loginPost = async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.locals;
    req.flash("success", `Welcome back ${req.user.username} to wanderlust!`);
    res.redirect(redirectUrl);
}
module.exports.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            console.log(error);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    })
}