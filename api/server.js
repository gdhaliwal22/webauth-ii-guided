const express = require("express");
const helmet = require("helmet");

// lets you answer request from different domains
// research credentails: true when connecting from your React app
const cors = require("cors"); // cross origin resource sharing
const session = require("express-session"); // 1: npm i express-session

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

// 2: configure the session and cookies
const sessionConfiguration = {
  name: "chocolatechip", //default name is sid
  secret: process.env.COOKIE_SECRET || "is it secret? is it safe?",
  saveUninitialized: true, // read about it on the docs to respect GDPR
  resave: false, // save sessions even when they have not changed
  cookie: {
    maxAge: 1000 * 60 * 60, // value for 1 hour (in milliseconds)
    secure: process.env.NODE_ENV === "development" ? false : true, // do we send cookie over unsecure https only?
    httpOnly: true // prevent client JS code from access to the cookie, browser will now protect this cookie
  }
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration)); // 3: use the session middleware globally

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  // now there will be an object that will save info about session
  // add session: req.session
  res.json({ api: "up", session: req.session });
});

module.exports = server;
