const express = require("express");

const brandController = require("../controller/Brand");
const router = express.Router();

router
  .post("/", brandController.createBrand)
  .get("/", brandController.fetchBrands)

  exports.router=router