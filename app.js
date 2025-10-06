if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user.js");
const admin = require("./model/admin.js");
const project = require("./model/project.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const nodemailer = require("nodemailer");
const flash = require('connect-flash');
const { isLoggedIn } = require("./middleware.js");
const village = require("./model/village.js");
const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");
const budget = require("./model/budget.js");
const ExpressError = require("./ExpressError.js");
const { asyncWrap } = require("./middleware.js");


main().then(() => {
    console.log("Database is connected!!");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(process.env.DB_URL);
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});
store.on("error", () => {
    console.log("Error in Mongo Session Store : ", err);

})
app.use(session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 1000 * 60 * 60 * 24 * 15,
        maxAge: 1000 * 60 * 60 * 24 * 15,
        httpOnly: true,
    }
}));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use('user-local', new localStrategy(User.authenticate()));
passport.use('admin-local', new localStrategy(admin.authenticate()));
// Serialize user with type info
passport.serializeUser((user, done) => {
    done(null, { id: user._id, type: user.constructor.modelName }); // modelName will be 'Admin' or 'User'
});

// Deserialize user based on type
passport.deserializeUser(async (obj, done) => {
    try {
        if (obj.type === 'Admin') {
            const user = await admin.findById(obj.id);
            done(null, user);
        } else if (obj.type === 'User') {
            const user = await User.findById(obj.id);
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err);
    }
});

app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");

    if (req.user) {
        res.locals.currUser = await req.user.populate("village");
    } else {
        res.locals.currUser = null;
    }

    next();
});


app.get("/", (req, res) => {
    // throw new ExpressError(401,"This is error");
    res.render("sections/index.ejs");

});

app.get("/about", (req, res) => {
    res.render("sections/about.ejs");
});




app.use("/Admin", adminRouter);
app.use("/user", userRouter);
app.get("/loggedOut", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out now !!!");
        res.redirect("/");
    })
});

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occuried" } = err;
    // req.flash("error",message);
    res.status(status).render("sections/error.ejs", { status, message, error: err });
});

app.listen(8080, () => {
    console.log("Server is running out !!!!!!!");
});