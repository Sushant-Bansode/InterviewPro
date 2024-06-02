const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const transporter = require("./transporter");
const { body, validationResult } = require("express-validator");
router.get("/", (req, res) => {
  res.render("index", { title: "Uday's CodeAdda" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "Uday Code Adda - A platform for Coders" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

router.post(
  "/contact",
  [
    body("username").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("msg").notEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("contact", {
        title: "Contact Us",
        username: req.body.username,
        email: req.body.email,
        msg: req.body.msg,
        errorMessage: errors.array(),
      });
    } else {
      var mailOptions = {
        from: "codechefspider@gmail.com",
        to: "codechefspider@gmail.com",
        subject:
          "New Message From site Visitor at Code Adda and send a message",
        text:
          "Name: " +
          req.body.username +
          "\nEmail: " +
          req.body.email +
          "\nMessage: " +
          req.body.msg,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.render("thank", { title: "Thank You" });
        }
      });
    }
  }
);
module.exports = router;
