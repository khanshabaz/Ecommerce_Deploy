const express = require("express");

const cartController = require("../controller/Cart");
const router = express.Router();

router
  .post("/", cartController.addToCart)
  .get("/", cartController.fetchCartByUser)
  .patch("/:id", cartController.updateCart)
  .delete("/:id", cartController.deleteFromCart);

  exports.router=router