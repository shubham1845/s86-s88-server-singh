const express = require("express");
const { verify } = require("../auth");

const userController = require("../controllers/user");

const router = express.Router();
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
// Route for retrieving user details
router.get("/details", verify, userController.getProfile);

module.exports = router;
