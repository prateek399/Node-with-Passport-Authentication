const express = require("express");
const router = express.Router();
//get User model
const User = require("../models/User");
const passport = require("passport");

const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
   res.render("login");
});

router.get("/register", (req, res) => {
   res.render("register");
});

router.post("/register", (req, res) => {
   const { name, email, password, password2 } = req.body;
   const errors = [];
   // Check if required body if filled or not
   if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please fill all the fields" });
   }

   //Check if passwords match
   if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
   }

   //Check if passwords have more than 6 characters
   if (password.length < 6) {
      errors.push({ msg: "Password should have atleast 6 characters" });
   }

   if (errors.length > 0) {
      res.render("register", {
         errors,
         name,
         email,
         password,
         password2,
      });
   } else {
      User.findOne({ email: email }).then(function (user) {
         if (user) {
            errors.push({ msg: "Email id already registered" });
            res.render("register", {
               errors,
               name,
               email,
               password,
               password2,
            });
         } else {
            const newUser = new User({
               name,
               email,
               password,
            });
            bcrypt.genSalt(10, function (err, salt) {
               bcrypt.hash(newUser.password, salt, function (err, hash) {
                  if (err) throw err;

                  newUser.password = hash;
                  newUser
                     .save()
                     .then((user) => {
                        req.flash(
                           "success_msg",
                           "You are now registered and can log in"
                        );
                        res.redirect("/users/login");
                     })
                     .catch((err) => console.log(err));
               });
            });
         }
      });
   }
});

router.post("/login", (req, res, next) => {
   passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
   })(req, res, next);
});

router.get("/logout", (req, res) => {
   req.logout((err) => {
      if (err) throw err;
      req.flash("success_msg", "You are logged out");
      res.redirect("/users/login");
   });
});

module.exports = router;
