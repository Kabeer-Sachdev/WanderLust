const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/expressError");
const { listingschema } = require("./schema");
const { reviewschema } = require("./schema");



module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.locals = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedUrl=(req,res,next)=>{
    if(req.session.locals){
        res.locals.redirectUrl = req.session.locals;
    }
    next();
}

module.exports.isOwner =async (req, res, next) => {
    const {id} =req.params;
    const listing =await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
        
module.exports.isAuthor =async (req, res, next) => {
    const {id,reviewid} =req.params;
    const review =await Review.findById(reviewid);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
        
module.exports.validateListing = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};