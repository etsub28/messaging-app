const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");
const authRouter = require("./routes/auth");
const path = require("path");
const friendsRouter = require("./routes/friends");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true only when using HTTPS in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);
app.use("/auth", authRouter);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/friends", friendsRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});
module.exports = app;



