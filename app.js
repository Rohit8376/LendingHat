require('dotenv').config()
const cors = require("cors");
const cookieparser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const { sendEmail } = require("./src/helper/emailService");
const path = require("path");
const moment = require('moment');
const plaid = require('plaid');
const db = require("./src/helper/db");
const { ejs2pd2, pdfConverte2, pdfConverter2 } = require("./src/helper/transections");
const { ejs2pdf, pdfConverter } = require("./src/helper/pdfService");
const app = express();
const upload = require('./src/helper/upload');
const enquiry = require("./src/model/enquiry");
// const { pdfConverter } = require("./src/helper/pdfService");
const { Promise } = require("mongoose");
const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox
});

app.use(express.json());
app.use(cors())
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(`/public`));

// 

app.set("view engine", "ejs");
app.use(express.static('public'));
// app.use(express.static(__dirname + "/public"));


// app.use(require("./src/routes"));

app.get('/', (req, res) => {
  res.render('form-page')
})

app.post('/create-account',
  upload.fields([
    {
      name: "drivinLicense",
      maxCount: 1,
    },
    {
      name: "bankStatemets",
      maxCount: 3,
    },
    {
      name: "voided",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    const bodyData = req.body
    var { fullName, cmpName, industry, cmpType, startDate, zipCode, loanAmount, annualRevenue, creditScore, purposeOfLone, phone, ssn, website, taxId } = req.body;

    startDate = startDate[0] + startDate[1] + "-" + startDate[2] + startDate[3] + startDate[4] + startDate[5]
    zipCode = zipCode[0] + zipCode[1] + zipCode[2] + zipCode[3] + zipCode[4]

    let drivinLicense = "uploads/" + req.files['drivinLicense'][0].filename
    let voided = "uploads/" + req.files.voided[0].filename
    let email = "rohit.kp.pandey@gmail.com"
    await enquiry.deleteMany({})

    
    transectionList(req.body.hidden_public_token).then(async (data) => {      
      transactions = data.fechedtransectionsList 
      items=[]
      const isCreated = await enquiry.create({ fullName, cmpName, industry, cmpType, startDate, zipCode, loanAmount, annualRevenue, creditScore, purposeOfLone, phone, ssn, website, taxId, drivinLicense, voided,transactions,items });
      
      // const pdfPath = `uploads/pdf/${isCreated.fullName}.pdf`;
      // const pdfPath = `public/uploads/pdf/${isCreated.fullName}.pdf`;
      // await pdfConverter({ userDetails: isCreated }, pdfPath); 
    
      // // const trasectionpdf = `transection/pdf/transections-${isCreated.fullName}.pdf`;
      // const trasectionpdf = `public/transection/pdf/transections-${isCreated.fullName}.pdf`;
      // await pdfConverter2({ userDetails: transactions }, trasectionpdf);

      // const attachments = [
      //   {
      //     path: pdfPath
      //   },
      //   {
      //     path: trasectionpdf
      //   },
      //   { 
      //     path: "./public/"+isCreated.voided
      //   },
      //   { 
      //     path: "./public/"+isCreated.drivinLicense
      //   },
      // ];

      // const options = {
      //   to: ['rohit.kp.pandey@gmail.com'], 
      //   subject: "Your from successfully submitted",
      //   attachments: attachments,
      // };
  
      // const isSend = await sendEmail(options);

      const finaldata = { 
        pdfPath:pdfPath,
        trasectionpdf:trasectionpdf,
        drivinLicense:isCreated.drivinLicense,
        voided:isCreated.voided
      }

      res.send({ ffff:"isSend" })
      
    }).catch(err => {
      res.send(err)
    })
 
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



app.get('/testform', (req, res) => {
  res.render('form')
})

app.post('/get_access_token', (req, res) => {

  let { public_token, uid } = req.body;

  console.log("body of file ", public_token)

  client.exchangePublicToken(public_token, (err, response) => {

    if (err) {
      return res.json({ error: "Oops" });
    }

    let { access_token, item_id } = response;

    console.log(access_token, item_id)


    // need to save this   access_token: access_token, item_id: item_id

    let today = moment().format('YYYY-MM-DD');
    let past = moment().subtract(90, 'days').format('YYYY-MM-DD');

    client.getTransactions(access_token, past, today, (err, response) => {
      if (err) {
        console.log(access_token)
        res.send(err)
      }
      // console.log(response.transactions )
      res.send({ message: "transection recieved success fully", transection: response.transactions })
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
    if (err) {
      return res.json({ error: "Oops", error: err });
    }
    let { access_token, item_id } = response;
    client.identityGet(access_token, (err, response) => {
      if (err) {
        console.log(access_token)
        res.send(err)
      }
      // console.log(response )
      res.send({ message: "transection recieved success fully", transection: response })
    })
  });
});



app.post('/get-transection', (req, res) => {
  transectionList(req.body.public_token).then(data => {
    res.send(data)
  }).catch(err => {
    res.send(err)
  })
})



function transectionList(public_token) {
  return new Promise((resolve, reject) => {
    client.exchangePublicToken(public_token, (err, response) => {
      if (err) {
        reject({ fechedtransectionsList: [] })
      }
      let { access_token } = response;
      let today = moment().format('YYYY-MM-DD');
      let past = moment().subtract(90, 'days').format('YYYY-MM-DD');
      client.getTransactions(access_token, past, today, (err, response) => {
        if (err) {
          reject({ fechedtransectionsList: [] })
        }
        // console.log(response.transactions )
        resolve({ fechedtransectionsList: response.transactions })
      })
    });
  })
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening to port 3000");
});
