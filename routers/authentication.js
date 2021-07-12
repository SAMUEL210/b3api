const express = require('express')
const router = express.Router()
const { userModel } = require('../models/models')
const { createToken } = require('../utilities/token')
var { decrypt } = require("../utilities/crypto");

router.post("/", async(req, rep) => {
    var user = await userModel.findOne({ email: req.body.email });

    if (user) {
        if (decrypt(user.password) == req.body.password) {
            const token = createToken(user);
            //rep.header("Authorization", token);
            rep.status(200).send({ token: token });
        } else rep.send({ result: "PasswordNotCorrect" });
    } else rep.send({ result: "UserNotExist" });
});

module.exports = router