const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "codechefspider@gmail.com",
    pass: "peowulaxmzoaduwp",
  },
});

module.exports = transporter;
