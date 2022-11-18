const express = require("express");
const bcrypt = require("bcryptjs");
const {
  registeration,
  setField,
  getField,
  formPage,
} = require("../module/user/user.controller");
const upload = require("../helper/upload");

const router = express.Router();

router.get("/", formPage);

router.get( "/create-account", registeration );

router.post("/modifyformvalue",

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
]),setField);


router.get("/get-field", getField);
module.exports = router;
