const {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  getLoggedUser,
} = require("../controllers/user.controllers");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const userRouter = express.Router();

userRouter.route("/").get(getAll).post(create);

userRouter.route("/me").get(getLoggedUser);

userRouter.route("/:id").get(getOne).delete(verifyJWT, remove).put(update);

userRouter.route("/login").post(login);

module.exports = userRouter;
