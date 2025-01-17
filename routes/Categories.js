const express = require("express");

const categoryController = require("../controller/Category");
const router = express.Router();

router
  .post("/", categoryController.createCategory)
  .get("/", categoryController.fetchCategories)


  exports.router=router