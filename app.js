const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const conn = require("./db/conn");
const Task = require("./models/task");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");
/////////////////////////////////
const config = require("./config");
const passport = require("passport");
const session = require("express-session");

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/*************/ ////////Socket  Chat Application Logic ////////

const http = require("http").createServer(app);

//socket
const io = require("socket.io")(http);
const ot = require("ot");
const roomList = {};
let str = "This is a Markdown heading \n\n" + "var x = 10;";

io.on("connection", (socket) => {
  console.log("Connected...");

  const findByIdAndUpdateAsync = (roomId, document) => {
    return Task.findByIdAndUpdate(roomId, { content: document }).exec();
  };

  socket.on("joinRoom", async (data) => {
    if (!roomList[data.room]) {
      let socketIOServer = new ot.EditorSocketIOServer(
        str,
        [],
        data.room,
        async function (socket, cb) {
          var self = this;
          try {
            await findByIdAndUpdateAsync(data.room, self.document);
            cb(true);
          } catch (error) {
            console.error(error);
            cb(false);
          }
        }
      );
      roomList[data.room] = socketIOServer;
    }

    roomList[data.room].addClient(socket);
    roomList[data.room].setName(socket, data.username);

    socket.room = data.room;
    socket.join(data.room);
  });

  socket.on("message", (msg) => {
    // socket.broadcast.emit("message", msg);
    io.to(socket.room).emit("message", msg);
  });
  socket.on("disconnect", () => {
    socket.leave(socket.room);
  });
});

/**********/ ///////

//////////////////////////////
require("./passport");
app.use(cookieParser());
app.use(
  session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
/////////////////////////////////
app.use(authRouter);
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});
const extraRouter = require("./routes/extra");
app.use(taskRouter);
app.use(indexRouter);
app.use(extraRouter);
app.get("/*", (req, res) => {
  res.render("error");
});

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
