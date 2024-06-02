const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").notEmpty().withMessage("password is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", {
        name: req.body.name,
        email: req.body.email,
        errorMessage: errors.array(),
      });
    } else {
      const user = await new User({
        name: req.body.name,
        email: req.body.email,
      });
      user.setPassword(req.body.password);
      user
        .save()
        .then((result) => {
          res.redirect("/login");
        })
        .catch((err) => {
          res.render("register", {
            name: req.body.name,
            email: req.body.email,
            errorMessage: err,
          });
          console.error(err);
        });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/"); // Handle error appropriately
    }
    res.redirect("/");
  });
});

module.exports = router;
