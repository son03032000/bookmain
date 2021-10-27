var express = require("express");
var path = require("path");
var expressValidator = require("express-validator");
var compression = require("compression");
var flash = require("connect-flash")
session = require("express-session"),
 MongoStore = require("connect-mongodb-session")(session),
 passport = require("passport")
 localStrategy = require("passport-local"),
 sanitizer = require("express-sanitizer"),
 methodOverride = require("method-override"),

User  = require("./models/user")
var UserRouter = require("./routes/user");
var authRoutes = require("./routes/auth");
var admin = require("./routes/admin");
var book = require('./routes/book')
var author = require('./routes/author')
var genre = require("./routes/genre")




var app = express();
if (process.env.NODE_ENV !== "production") require("dotenv").config();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(expressValidator());

app.use(express.static(__dirname + "/public"));
//Compress all routes
app.use(compression());
app.use(sanitizer());

//Set up mongoose connection
const mongoose = require("mongoose");


mongoose.connect( process.env.DB_URL, {});


var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const store = new MongoStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

app.use(
  session({
    // phải được khai báo trước phiên hộ chiếu và phương thức khởi tạo
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store,
    cookie:{maxAge: 1000*60*60}
  })
);
app.use(flash());
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  next();
});
app.use(authRoutes);
app.use("/", UserRouter);
app.use("/admin", admin);
app.use(book);
app.use(author);
app.use(genre);




const port = process.env.PORT || 3000;
server = app.listen(port, function () {
  console.log("its running now on " + port + "");
});




