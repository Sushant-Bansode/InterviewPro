const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.get("/createTask", (req, res) => {
  const newTask = new Task({});
  newTask
    .save()
    .then((result) => {
      res.redirect(`/task/${result._id}`);
    })
    .catch((err) => {
      res.render("error", {
        error: err,
      });
    });
});

router.get("/task/:_id", async (req, res) => {
  try {
    if (req.params._id) {
      const task = await Task.findOne({ _id: req.params._id });

      if (task) {
        res.render("task", {
          content: task.content,
          roomId: req.params._id,
          show: true,
        });
      } else {
        res.render("error", {
          error: "Task not found",
        });
      }
    } else {
      res.render("error", {
        error: "Task not found",
      });
    }
  } catch (err) {
    res.render("error", {
      error: err,
    });
  }
});

module.exports = router;
