require('dotenv').config()
const cors = require("cors");
const cookieparser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const { sendEmail } = require("./src/helper/emailService");
const path = require("path");
const moment = require('moment'); 
const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const db = require("./src/helper/db");
const { ejs2pd2, pdfConverte2, pdfConverter2 } = require("./src/helper/transections");
const { ejs2pdf, pdfConverter } = require("./src/helper/pdfService");
const app = express();
const upload = require('./src/helper/upload');
const enquiry = require("./src/model/enquiry");

const { Promise } = require("mongoose"); 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET_PROD,
      "Plaid-Version": "2020-09-14",
    },
  },
});
const client = new PlaidApi(config);
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
app.get('/smallbusinessloan/lp1', (req,res)=>{
    res.render('form-page')
})
app.get('/smallbusinessloan/lp2', (req,res)=>{
  res.render('form-page-2')
})
app.get('/smallbusinessloan/lp3', (req,res)=>{
  res.render('form-page-3')
})
app.get('/sales/application', (req, res) => {
  res.render('application')
})
app.get('/smallbusinessloan/campaign1', (req,res)=>{
  res.render('lh-form-page')
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
 
    const access_token = req.session.access_token;
    console.log(">>>>>>>>>>>>>"+access_token)

    var { fullName, cmpName, industry, cmpType, startDate, zipCode, loanAmount, annualRevenue, creditScore, purposeOfLone, phone, ssn, email, taxId ,hidden_address } = req.body;

    startDate = startDate[0] + startDate[1] + "-" + startDate[2] + startDate[3] + startDate[4] + startDate[5]
    zipCode = zipCode[0] + zipCode[1] + zipCode[2] + zipCode[3] + zipCode[4]

    let drivinLicense = "/uploads/" + req.files['drivinLicense'][0].filename
    let voided = "/uploads/" + req.files.voided[0].filename
    

    console.log({ fullName, cmpName, industry, cmpType, startDate, zipCode, loanAmount, annualRevenue, creditScore, purposeOfLone, phone, ssn, email, taxId ,hidden_address })
    await enquiry.deleteMany({})
    const transactionsdata = await transectionList(access_token);

    console.log(transactionsdata)

    transactions = transactionsdata.fechedtransectionsList
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
        to: ['rohit.kp.pandey@gmail.com' ], //  'asheesh.bhardwaj@gmail.com', 'tanner@lendinghat.com'
        subject: "Your from successfully submitted",
        attachments: attachments,
      };  
      
      const isSend = await sendEmail(options); 
      res.send({ success:"ok", isSend:isSend })

})

app.post('/create_link_token', async(req, res) => {
  const tokenResponse = await client.linkTokenCreate({
    user: { client_user_id: req.sessionID },
    client_name: 'Lending Hat',
    language: "en",
    products: ["transactions"],
    country_codes: ["US"],
    redirect_uri: "https://lendinghat.com/oauth-return.html",
  });
  console.log(`Token response: ${JSON.stringify(tokenResponse.data)}`);
  res.json({link_token:tokenResponse.data.link_token});
});

app.post("/api/exchange_public_token", async (req, res, next) => {
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });
  console.log(`Exchange response: ${JSON.stringify(exchangeResponse.data)}`);
  req.session.access_token = exchangeResponse.data.access_token;
  res.json(true);
});
 
app.post('/get/plaid-address', async (req, res) => {
  const access_token = req.session.access_token; 
  const resdata = await client.identityGet({access_token: access_token}) 
  const identities = resdata.data.accounts.flatMap((account) => account.owners); 
  res.send({ message: "transection recieved success fully", address: identities[0]?.addresses[0].data?.street })
});

async function transectionList(access_token) {
   
    const startDate = moment().subtract(90, "days").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    const transactionResponse = await client.transactionsGet({
      access_token: access_token,
      start_date: startDate,
      end_date: endDate, 
    });
    response = transactionResponse.data
    avgbalances = 0
    for (let index = 0; index < response.accounts.length; index++) {
        const element = response.accounts[index];
        avgbalances += element.balances.available?parseInt(element?.balances.available):parseInt(element.balances.current)                    
    }
    return { fechedtransectionsList: response.transactions,avgbalances:avgbalances }
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
