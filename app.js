const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

const PORT = process.env.PORT || 5000;

//Passport config
require("./config/password")(passport);

//DB Config
const db = require("./config/keys").MongoURI;

//Mongo Connection
mongoose
   .connect(db, { useNewUrlParser: true })
   .then(() => console.log("MongoDB Connected..."))
   .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bode Parser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
   session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
   })
);

app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

//Global Variables
app.use((req, res, next) => {
   res.locals.success_msg = req.flash("success_msg");
   res.locals.error_msg = req.flash("error_msg");
   res.locals.error = req.flash("error");
   next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(PORT, function (err) {
   if (err) {
      console.log(`ERROR OCCURED ON LISTENING`);
      return;
   }
   console.log(`server started on port ${PORT}`);
});
