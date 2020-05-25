const express = require("express");
const path = require("path");

const routes = require("./routes/index");
const books = require("./routes/books");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/books", books);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

app.listen(3000, () => {
  console.log("The application is running on localhost:300");
});

module.exports = app;
