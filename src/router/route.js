const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController")



router.post("/users", userController.createUser)
router.post("/login", userController.loginUser)

router.get("/getuser", userController.getuser)

module.exports = router;