const mongoose = require("mongoose"); 
const validator = require("validator");
const { Messages } = require("../constants/messages");

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      validate(value) {
        validate1(value, Messages.FULL_NAME_EMPTY);
      },
    },
    cmpName: {
      type: String,
      validate(value) {
        validate1(value, Messages.COMPANY_NAME);
      },
    },
    industry: {
      type: String,
      validate(value) {
        validate1(value, Messages.BUSINESS_INDUSTRY_EMPTY);
      },
    },

    cmpType: {
      type: String,
      validate(value) {
        validate1(value, Messages.ENTITY_TYPE_NOT_SELECTED);
      },
    },
    startDate: {
      type: String,
      validate(value) {
        validate1(value, Messages.BUSINESS_START_DATE); 
      },
    },
    zipCode: {
      type: String,
      validate(value) {
        validate1(value, Messages.ZIP_CODE_EMPTY);
      },
    },
    loanAmount: {
      type: String,
      validate(value) {
        validate1(value, Messages.LOAN_AMOUNT_EMPTY); 
      },
    },
    annualRevenue: {
      type: String,
      validate(value) {
        validate1(value, Messages.ANNUAL_REVENUE_EMPTY);
      },
    },
    creditScore: {
      type: String,
      validate(value) {
        validate1(value, Messages.CREDIT_SCORE_EMPTY);
      },
    },
    purposeOfLone: {
      type: String,
      validate(value) {
        validate1(value, Messages.LOAN_PURPOSE_EMPTY);
      },
    },
    phone: {
      type: String,
      validate(value) {
        validate1(value, Messages.INVALID_PHONE);
      },
    },
    // email: {
    //   type: String,
    //   default:null
    //   // unique: true,
    //   // index: true,
    //   // lowercase: true,
    //   // trim: true,
    //   // validate(value) {
    //   //   if (!validator.isEmail(value)) {
    //   //     throw new Error("Email is invalid!");
    //   //   }
    //   // },
    // },
    ssn: {
      type: String,
      validate(value) {
        validate1(value, Messages.INVALID_SSN);
      },
    },
    email: {
      type: String,
      default:null
    },
    address:{
      type: String,
      default:null
    },

    taxId: {
      type: String,
      validate(value) {
        validate1(value, Messages.INVALID_TAXID);
      },
    },

    drivinLicense: {
      type: String,
      validate(value) {
        validate1(value, Messages.DL_EMPTY);
      },
    },
    voided: {
      type: String,
      validate(value) {
        validate1(value, Messages.INDVALID_VOIDED_CHECK);
      },
    },

    transactions: {
      type: Array,
      default:[]
    },
    items:{
      type: Array,
      default:[]
    },
    
    step: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
function validate1(value, message) {
  if (validator.isEmpty(value)) throw new Error(message);
}
module.exports = mongoose.model("Enquiry", enquirySchema);


