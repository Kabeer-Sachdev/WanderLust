const Review = require("../models/review");

const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newreview = new Review(req.body.review); 
    newreview.author = req.user._id; 
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("new data saved");
    req.flash("success", "New review added!");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview = async (req, res) => {
    const { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}

