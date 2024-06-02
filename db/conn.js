const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/udayCodeAddaDB")
  // .connect(
  //   "mongodb+srv://udayberad21:<6BHQY7iaNIIX8L5G>@cluster0.erepvee.mongodb.net/?retryWrites=true&w=majority"
  // )
  .then(() => {
    console.log("connection Successful................");
  })
  .catch((err) => {
    console.log("connection failed ...");
  });
