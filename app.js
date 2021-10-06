var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var compression = require("compression");
var multer = require("multer")
var flash = require("connect-flash")
session = require("express-session"),
 MongoStore = require("connect-mongodb-session")(session),
 passport = require("passport")
 localStrategy = require("passport-local"),
 uid = require("uid"), // để up ảnh
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
//Compress all routes
app.use(compression());

//Set up mongoose connection
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test", {});

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
  })
);
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// configure image file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uid()}-${file.originalname}`);
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(
  multer({ storage: fileStorage, fileFilter: filefilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

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


app.listen(3000, () => {
  console.log(`server started on port`);
});

module.exports = app;
