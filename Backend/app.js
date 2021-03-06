const express = require("express");
const connection = require("./db");
const publicationsRoutes = require("./routes/publications");
const commentsRoutes = require("./routes/comments");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const path = require("path");
// const helmet = require("helmet");

const clean = require("xss-clean");

const app = express();
connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(clean());
app.use(cookieParser());
app.use(express.json());
app.use("/api/publications", publicationsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
