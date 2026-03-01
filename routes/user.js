
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware");
const usercontroller = require("../controllers/users");

router.route("/signup")
    .get(usercontroller.signup)
    .post(wrapAsync(usercontroller.register));

router.route("/login")
    .get(usercontroller.login)
    .post(savedUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), usercontroller.loginPost);


router.get("/logout", usercontroller.logout);

module.exports = router;