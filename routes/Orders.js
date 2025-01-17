const express = require("express");

const orderController = require("../controller/Order");
const router = express.Router();

router
  .post("/", orderController.createOrder)
  .get("/own", orderController.fetchOrderByUser)
  .patch("/:id", orderController.updateOrder)
  .get('/', orderController.fetchAllOrders)

  exports.router=router