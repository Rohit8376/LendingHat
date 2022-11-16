const cors = require("cors");
const cookieparser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./src/helper/db");
const { ejs2pdf, pdfConverter } = require("./src/helper/pdfService");
const app = express();

const allowedOrigins = ["http://localhost:3000"];
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
  })
);
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("./src/routes"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening to port 3000");
});
