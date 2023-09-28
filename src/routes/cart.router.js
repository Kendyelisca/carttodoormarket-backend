// Import middleware and routes
const verifyJWT = require("../utils/verifyJWT");
const {
  getAll,
  create,
  getOne,
  remove,
  update,
} = require("../controllers/cart.controllers");
const express = require("express");

const cartRouter = express.Router();

// Apply the verifyJWT middleware before protected routes
cartRouter.use(verifyJWT);

cartRouter.route("/").get(getAll).post(create);
cartRouter.route("/:id").get(getOne).delete(remove).put(update);

module.exports = cartRouter;
