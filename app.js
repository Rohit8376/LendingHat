const cors = require("cors");
const cookieparser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config()
const plaid = require('plaid'); 
const db = require("./src/helper/db");
const { ejs2pdf, pdfConverter } = require("./src/helper/pdfService");
const app = express();

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox
});


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


app.post('/create_link_token', (req, res) => {
  // let { uid } = req.body;
  // console.log(`Recieved: ${uid} as token!!!`);
    client.createLinkToken({
      user: {
          client_user_id: "636d650b9402bf3b1cdd153a"
      },
      client_name: 'Lint',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
  }, (err, linkTokenResponse) => {
      res.json({ link_token: linkTokenResponse.link_token });
    });

  // User.findById("636d650b9402bf3b1cdd153a", (err, doc) => {
  //     if (err) {
  //         res.sendStatus(400);
  //         return;
  //     }
  //     let userId = doc._id;
  // });

});



app.post('/get_access_token', (req, res) => {

  let { public_token, uid } = req.body;


  console.log("body of file ",public_token )

  client.exchangePublicToken(public_token, (err, response) => {
      if (err)
          return res.json({ error: "Oops" });

      let { access_token, item_id } = response;

      console.log(access_token,item_id)
      // need to save this   access_token: access_token, item_id: item_id

      let today = moment().format('YYYY-MM-DD');
      let past = moment().subtract(90, 'days').format('YYYY-MM-DD');

      client.getTransactions(access_token, past, today, (err, response) => {
         if(err){
          console.log(access_token)
          res.send(err)
         }
          console.log(response.transactions )
          res.send({message:"transection recieved success fully", transection :response.transactions  })
      })


      // User.findByIdAndUpdate(uid, { $addToSet: { items: { access_token: access_token, item_id: item_id } } }, (err, data) => {
      //     console.log("Getting transactions");
      //     let today = moment().format('YYYY-MM-DD');
      //     let past = moment().subtract(90, 'days').format('YYYY-MM-DD');
      //     client.getTransactions(access_token, past, today, (err, response) => {
      //         res.send({ transactions: response.transactions });
      //         User.findByIdAndUpdate(uid, { $addToSet: { transactions: response.transactions } }, (err, data) => {
      //         });
      //     });
      // });


  });
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening to port 3000");
});
