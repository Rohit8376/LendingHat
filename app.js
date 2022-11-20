const cors = require("cors");
const cookieparser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config()
const moment = require('moment');
const plaid = require('plaid'); 
// const db = require("./src/helper/db");
const { ejs2pdf, pdfConverter } = require("./src/helper/pdfService");
const app = express();
const upload = require('./src/helper/upload');
const { Promise } = require("mongoose");
const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox
});


// const allowedOrigins = ["https://guarded-chamber-83440.herokuapp.com"];

app.use(express.json());
app.use(cors())
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `The CORS policy for this site does not allow access from the specified Origin`;
//         return callback(new Error(msg), false);
//       }

//       return callback(null, true);
//     },
//   })
// );
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// app.use(require("./src/routes"));

app.get('/',(req,res)=>{
  res.render('form-page')
})

app.post('/create-account',upload.any(), (req,res)=>{
  const bodyData = req.body
  transectionList(req.body.hidden_public_token).then(data=>{
    bodyData['transections'] = data.fechedtransectionsList;
    res.send(bodyData)
  }).catch(err=>{
    res.send(err)
  })

  // res.send({body:req.body, files:req.files, file:req.file})
})

app.post('/create_link_token', (req, res) => { 
    client.createLinkToken({
      user: {
          client_user_id: "636d650b9402bf3b1cdd153a"
      },
      client_name: 'Landing Hat',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
  }, (err, linkTokenResponse) => {
      res.json({ link_token: linkTokenResponse.link_token });
    });
 
});



app.post('/get_access_token', (req, res) => {

  let { public_token, uid } = req.body;

  console.log("body of file ",public_token )

  client.exchangePublicToken(public_token, (err, response) => {
      
      if (err){
        return res.json({ error: "Oops" });
      }

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



app.post('/get-dcos', (req, res) => {

  let { public_token } = req.body;
  client.exchangePublicToken(public_token, async (err, response) => {      
      if (err){
        return res.json({ error: "Oops" , error:err});
      }
      let { access_token, item_id } = response; 
      client.identityGet(access_token,  (err, response) => {
         if(err){
          console.log(access_token)
          res.send(err)
         }
          console.log(response )
          res.send({message:"transection recieved success fully", transection :response  })
      }) 
  });
});



app.post('/get-transection', (req,res)=>{
  transectionList(req.body.public_token).then(data=>{
    res.send(data)
  }).catch(err=>{
    res.send(err)
  })
})



function transectionList(public_token){ 
  return new Promise((resolve,reject)=>{
    client.exchangePublicToken(public_token, (err, response) => {
      if (err){
        reject({fechedtransectionsList:[]})
      } 
      let { access_token } = response;  
      let today = moment().format('YYYY-MM-DD');
      let past = moment().subtract(90, 'days').format('YYYY-MM-DD'); 
      client.getTransactions(access_token, past, today, (err, response) => {
         if(err){
          reject({fechedtransectionsList:[]})
         }
          console.log(response.transactions )
          resolve({fechedtransectionsList: response.transactions})  
      }) 
   });
  })
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening to port 3000");
});
