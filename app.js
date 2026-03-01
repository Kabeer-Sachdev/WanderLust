if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/reviews");
const listingRouter = require("./routes/listings");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// Database Connection
const dburl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
let dbConnected = false;

async function connectDB() {
    try {
        await mongoose.connect(dburl, { 
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 3000,
        });
        dbConnected = true;
        console.log("✓ Connected to database");
    } catch (err) {
        dbConnected = false;
        console.log("✗ Database connection error:", err.message);
        console.log("Starting app without database...");
    }
}

connectDB();

// Disable mongoose buffering if not connected
mongoose.set('bufferCommands', false);

app.engine('ejs', ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session Configuration
const sessionOptions = {
    secret: process.env.SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/", (req, res) => {
    if (dbConnected) {
        res.redirect("listings");
    } else {
        res.render("listings/index", { allListings: [], selectedCategory: "All" });
    }
})

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user || null;
    res.locals.success=req.flash("success") || [];
    res.locals.error=req.flash("error") || [];
    res.locals.dbConnected = dbConnected;
    next();
})

// Check database connection for routes that need it
app.use((req, res, next) => {
    if (!dbConnected && req.path !== '/' && req.path !== '/error') {
        return res.status(503).render("error.ejs", { message: "Database is not available. Please try again later." });
    }
    next();
})

app.use("/",userRouter );
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "something went wrong" } = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { message });
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}`);
})
