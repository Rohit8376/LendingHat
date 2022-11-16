const { sendEmail } = require("../../helper/emailService");
const { messages, Messages } = require("../../constants/messages");
const enquiry = require("../../model/enquiry");
const User = require("../../model/User");
const { pdfConverter } = require("../../helper/pdfService");

exports.formPage = async (req, res) => {
  try {
    const isEnquiry = await enquiry.findOne();

    // const {
    //   // fullName,
    //   cmpName,
    //   industry,
    //   cmpType,
    //   startDate,
    //   zipCode,
    //   loanAmount,
    //   annualRevenue,
    //   creditScore,
    //   purposeOfLone,
    //   phone,
    //   email,
    //   ssn,
    //   website,
    //   taxId,
    //   drivinLicense,
    //   voided,
    //   bankStatemets,
    // } = isEnquiry;
    // //console.log(isEnquiry);
    // const user = {
    //   fullName,
    //   cmpName,
    //   industry,
    //   cmpType,
    //   startDate,
    //   zipCode,
    //   loanAmount,
    //   annualRevenue,
    //   creditScore,
    //   purposeOfLone,
    //   phone,
    //   email,
    //   ssn,
    //   website,
    //   taxId,
    //   drivinLicense,
    //   voided,
    //   bankStatemets,
    // };
     
    res.render("form-page", { user:isEnquiry?isEnquiry:{} });
    // res.send({ user:isEnquiry?isEnquiry:{} });



  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};











exports.registeration = async (req, res) => {
  try {
    // const {
    //   fullName,
    //   cmpName,
    //   industry,
    //   cmpType,
    //   startDate,
    //   zipCode,
    //   loanAmount,
    //   annualRevenue,
    //   creditScore,
    //   purposeOfLone,
    //   phone,
    //   email,
    //   ssn,
    //   website,
    //   taxId,
    // } = req.body;
    // const file = req.files;
    // const drivinLicense = file?.drivinLicense[0].path;
    // const voided = file?.voided[0].path;
    // const bankStatemets = file?.bankStatemets[0].path;
    // const isCreated = await enquiry.create({
    //   fullName,
    //   cmpName,
    //   industry,
    //   cmpType,
    //   startDate,
    //   zipCode,
    //   loanAmount,
    //   annualRevenue,
    //   creditScore,
    //   purposeOfLone,
    //   phone,
    //   email,
    //   ssn,
    //   website,
    //   taxId,
    //   drivinLicense,
    //   voided,
    //   bankStatemets,
    // });
    //console.log(req.query);
    const isCreated = await enquiry.findOne({});
    if (!isCreated) throw new Error(messages.FAILED_TO_FETCH);
    const pdfPath = `./uploads/pdf/${isCreated.fullName}.pdf`;

    await pdfConverter({ userDetails: isCreated }, pdfPath);

    const attachments = [
      {
        path: pdfPath,
      },
      // {
      //   path: drivinLicense,
      // },
      // {
      //   path: voided,
      // },
      // {
      //   path: bankStatemets,
      // },
    ];

    const options = {
      to: `shyamnarayan0987@gmail.com`,
      subject: "Your from successfully submitted",

      attachments: attachments,
    };

    const isSend = await sendEmail(options);

    return res.status(201).json({
      message: Messages.DATA_CREATED,
      data: isSend.accepted,
    });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};
module.exports.setField = async function (req, res) {
  try {
    const isRecord = await enquiry.findOne({});
    console.log(req.body);
    if (!isRecord) {
      await enquiry.create(req.body);
    } else {
      const field = req.body;
      field.step = isRecord.step + 1;
      await enquiry.updateOne({ $set: field });
    }
    // console.log(req.body);
    res.status(201).send({ message: Messages.REQUEST_SUCCESS, data: req.body });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: error.message });
  }
};
module.exports.getField = async function (req, res) {
  try {
    const isValue = await enquiry.findOne({}, req.body);

    res
      .status(201)
      .send({ message: Messages.REQUEST_SUCCESS, data: { isValue } });
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
};
