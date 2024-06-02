//Send task id to your friend via email through codechefspider@gmail

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const transporter = require("./transporter");
const { body, validationResult } = require("express-validator");
router.post(
  "/task",
  [body("email").notEmpty().isEmail().withMessage("Invalid Email")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("index", {
        title: "Task",
        roomId: req.body.taskId,
        errorMessage: errors.array(),
      });
    } else {
      let mailOptions = {
        from: "codechefspider@gmail",
        to: req.body.email,
        subject: `Your Friend ${req.body.userName} has sent you a task to complete.`,
        text:
          "Name: " +
          req.body.userName +
          "\nEmail: " +
          req.body.userEmail +
          "\nTask Id: " +
          req.body.taskId +
          "\n Message: " +
          req.body.msg,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.render("task", {
            title: "Task",
            content: req.body.content,
            roomId: req.body.taskId,
            successMessage: "Email sent successfully",
            show: false,
          });
        }
      });
    }
  }
);
module.exports = router;
