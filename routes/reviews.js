
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const { validateReview, isloggedin,isAuthor } = require("../middleware");
const reviewsController = require("../controllers/reviews");


//post review
router.post("/",isloggedin, validateReview, wrapAsync(reviewsController.createReview));

//delete review
router.delete("/:reviewid",isloggedin,isAuthor, wrapAsync(reviewsController.destroyReview));

module.exports = router;
