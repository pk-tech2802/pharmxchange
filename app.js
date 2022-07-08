const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo");

const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const userRoutes = require("./routes/users");
const records = require("./routes/records");
const forums = require("./routes/forum");

const User = require("./models/user");

mongoose.connect("mongodb+srv://cs:1234@cluster0.wyw0m.mongodb.net/cs?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig = {
    secret: "hack",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", userRoutes);
app.use("/records", records);
app.use("/records/:id/forum", forums);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    // res.status(statusCode).render('error', { err })
    res.status(statusCode).render("error", { err });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});
