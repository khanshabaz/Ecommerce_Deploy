const express = require("express");

const paymentController = require("../controller/payment");
const router = express.Router();
const passport = require("passport");

router
  .post("/",passport.authenticate('jwt'),  paymentController.createPaymentLink)
  // .get("/", passport.authenticate('jwt'),  paymentController.updatePaymentInformation)

  exports.router=router