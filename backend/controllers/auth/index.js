const express = require("express");

const authMiddleware = require("../../middleware/check-auth.js");
const controller = require("./authController.js");
const { check } = require("express-validator/check");

const router = express.Router();

router.post("/login", controller.login);

router.post("/register", check("email").isEmail(), controller.register);

module.exports = router;
