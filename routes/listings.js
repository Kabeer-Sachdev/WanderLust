const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isloggedin, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isloggedin,  upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.createListing));


router.get("/new", isloggedin, wrapAsync(listingController.newListing));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedin, isOwner, upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isloggedin, isOwner, wrapAsync(listingController.destroyListing));


router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.editListing));

module.exports = router;