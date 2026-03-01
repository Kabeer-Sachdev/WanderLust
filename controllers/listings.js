const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    try {
        const { category, search } = req.query;
        let filter = {};

        if (category && category !== "All") {
            filter.category = category;
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const allListings = await Listing.find(filter).maxTimeMS(3000);
        res.render("listings/index", { allListings, selectedCategory: category || "All" });
    } catch (error) {
        console.error("Error fetching listings:", error.message);
        res.render("listings/index", { allListings: [], selectedCategory: "All" });
    }
};

module.exports.newListing = async (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const showlist = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner").maxTimeMS(3000);
        if (!showlist) {
            req.flash("error", "Listing does not exist!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { showlist });
    } catch (error) {
        req.flash("error", "Unable to load listing");
        res.redirect("/listings");
    }
}

module.exports.createListing = async (req, res, next) => {
    try {
        let url = req.file ? req.file.path : "";
        let filename = req.file ? req.file.filename : "";

        const listing = new Listing({
            ...req.body.listing,
            image: { url, filename },
            owner: req.user._id
        });

        await listing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create listing. Try again.");
        res.redirect("/listings/new");
    }
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const showlist = await Listing.findById(id);
    if (!showlist) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit", { showlist });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not exist!");
            return res.redirect("/listings");
        }

        Object.assign(listing, req.body.listing);

        if (typeof req.file !== "undefined") {
            listing.image = { url: req.file.path, filename: req.file.filename };
        }

        await listing.save();
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Failed to update listing. Try again.");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}