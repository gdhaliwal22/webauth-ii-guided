const express = require("express");
const helmet = require("helmet");

// lets you answer request from different domains
// research credentails: true when connecting from your React app
const cors = require("cors"); // cross origin resource sharing
const session = require("express-session"); // 1: npm i express-session
const KnexSessionStorage = require("connect-session-knex")(session); // <<<<< for storing sessions in db

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const knexConnection = require("../database/dbConfig.js");

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
  // store: new KnexSessionStorage({
  //   knex: knexConnection,
  //   clearInterval: 1000 * 60 * 10, // delete expires sessions every 10 minutes
  //   tablename: "user_sessions", // name of table i want created
  //   sidfieldname: "id", // name of the id for the table
  //   createtable: true // if table is not there go ahead and create it
  // })
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
