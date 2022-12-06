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

const { Promise } = require("mongoose");

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET_PROD,
  env: plaid.environments.production
});


app.use(express.json());
app.use(cors())
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));

app.get('/',(req,res)=>{
  res.render('coming-soon')
})

app.get('/marketing/22-23/01/landingpage', (req,res)=>{
    res.render('form-page')
})

app.get('/sales/application', (req, res) => {
  res.render('application')
})

app.post('/create-account',
  upload.fields([
    {
      name: "drivinLicense",
      maxCount: 1,
    },
    {
      name: "voided",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    const bodyData = req.body
    var { fullName, cmpName, industry, cmpType, startDate, zipCode, loanAmount, annualRevenue, creditScore, purposeOfLone, phone, ssn, email, taxId ,hidden_address } = req.body;

    startDate = startDate[0] + startDate[1] + "-" + startDate[2] + startDate[3] + startDate[4] + startDate[5]
    zipCode = zipCode[0] + zipCode[1] + zipCode[2] + zipCode[3] + zipCode[4]

    let drivinLicense = "/uploads/" + req.files['drivinLicense'][0].filename
    let voided = "/uploads/" + req.files.voided[0].filename
    
    await enquiry.deleteMany({})

    transectionList(req.body.hidden_public_token).then(async (data) => {      
      transactions = data.fechedtransectionsList
      items=[]
      let address = hidden_address
      const isCreated = await enquiry.create({ fullName, cmpName, industry, cmpType, startDate, zipCode, loanAmount, annualRevenue, creditScore, purposeOfLone, phone, ssn, email, taxId, drivinLicense, voided,transactions,items ,address}); 
      
      const pdfPath = `/uploads/pdf/${isCreated.fullName}.pdf`;
      await pdfConverter({userDetails:isCreated, avgbalances:avgbalances, zipcity:req.body.zipcity, zipstate: req.body.zipstate}, pdfPath); 
      
      const trasectionpdf = `/transaction/pdf/transaction-${isCreated.fullName}.pdf`;
      await pdfConverter2({ userDetails: transactions }, trasectionpdf);
      
      const attachments = [
        {path:   'public/'+pdfPath},
        { path:  'public/'+trasectionpdf},
        { path:  'public/'+isCreated.voided},
        { path:  'public/'+isCreated.drivinLicense},
      ];
      
      const options = {
        to: ['rohit.kp.pandey@gmail.com','asheesh.bhardwaj@gmail.com', 'tanner@lendinghat.com' ], //  
        subject: "Your from successfully submitted",
        attachments: attachments,
      };  
      
    const isSend = await sendEmail(options); 
    res.send({ success:"ok", isSend:isSend })

    }).catch(err => {
      res.send(err)
    })
 
})

app.post('/create_link_token', (req, res) => {
  client.createLinkToken({
    user: {
      client_user_id: `enviroment${Date.now()}-userid` 
    },
    client_name: 'Lending Hat',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en',
    redirect_uri: "https://lendinghat.com/outh-return.html"
  }, (err, linkTokenResponse) => {
    res.json({ link_token: linkTokenResponse.link_token });
  });

});

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

app.post('/get/plaid-address', (req, res) => {
  let { public_token } = req.body;
  client.exchangePublicToken(public_token, async (err, response) => {
    if (err) {
      return res.json({ error: "Oops", error: err });
    }
    let { access_token } = response; 
    const resdata = await client.getIdentity(access_token).catch((err) => {
        if(err) console.log(err)
    });
    const identities = resdata.accounts.flatMap((account) => account.owners); 
    res.send({ message: "transection recieved success fully", address: identities[0]?.addresses[0].data?.street })

  });
});

function transectionList(public_token) {
  return new Promise((resolve, reject) => {

    client.exchangePublicToken(public_token, (err, response) => {
      if (err) {
        reject({ fechedtransectionsList: [] })
      }
      let { access_token } = response;
      let today = moment().format('YYYY-MM-DD');
      let past = moment().subtract(90, 'days').format('YYYY-MM-DD');

      client.getTransactions(access_token, past, today, async (err, response) => {
        if (err) {
          reject({error:err, fechedtransectionsList: [] })
        }
        avgbalances = 0
        for (let index = 0; index < response.accounts.length; index++) {
            const element = response.accounts[index];
            avgbalances += element.balances.available?parseInt(element?.balances.available):parseInt(element.balances.current)                    
        }

        // try {
          
        //   // const identityResponse = await client.identityGet({  access_token: access_token }) 
        //   // console.log(identityResponse)

        //   const identityVerificationListss = await client.identityVerificationList({  access_token: access_token });
        //   console.log(identityVerificationListss)

        // } catch (error) {
        //   console.log(error)
        // }
        

        resolve({ fechedtransectionsList: response.transactions,avgbalances:avgbalances })
      })
    });
  })
}


app.get('/newtemp', async(req, res) => {
  const userDetails = await enquiry.findOne({});
  res.render('newpdf',{userDetails})
})

app.post('/get-transection', (req, res) => {
  transectionList(req.body.public_token).then(data => {
    res.send(data)
  }).catch(err => {
    res.send(err)
  })
})
app.get('/testing', async (req, res) => {
  const userDetails = await enquiry.findOne({});
  res.send({userDetails})
  //  res.render('pdfTemplate',{userDetails})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening to port 3000");
});
