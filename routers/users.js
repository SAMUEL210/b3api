var express = require("express");
var router = express.Router();
var userModel = require("../models/user");
var { encrypt } = require('../utilities/crypto')
var { validate } = require('email-validator')


/* https://api.monsuperhotel.com/users*/
router.post("/", async(request, response) => {
    let { body } = request;
    body.password = encrypt(body.password);
    try {
        var user = new userModel(body);
        await user.save();
        response.status(200).send({ user });
    } catch (e) {
        response.status(409).send({ error: e.message });
    }
});

/* https://api.monsuperhotel.com/users*/
router.get("/", async(request, response) => {
    var users = await userModel.find({}); // == "SELECT * from users"
    response.json({ users });
});

/* https://api.monsuperhotel.com/users/59bfd752z */
router.get("/:id", async(request, response) => {
    var user = await userModel.findOne({ _id: request.params.id });
    response.json({ user });
});

/* https://api.monsuperhotel.com/users/59bfd752z*/
router.put("/:id", async(request, response) => {
    let { body } = request;
    var verif = await userModel.findOne({ email: body.email })
    if (validate(body.email)) {
        if (verif) response.json({ result: 'UserEmailAlreadyExist' })
        else {
            body.password = encrypt(body.password);
            var user = await userModel.findOneAndUpdate({ _id: request.params.id },
                body, { new: true }
            );
            response.json(user);
        }
    } else response.json({ result: "EmailNotValid" })

});

/* https://api.monsuperhotel.com/users/59bfd752z*/
router.delete("/:id", async(request, response) => {
    var u = await userModel.findOne({ _id: request.params.id })
    if (u) {
        var user = await userModel.findOneAndRemove({ _id: request.params.id });
        response.status(200).send({ result: 'Success' });
    } else {
        response.status(400).send({ result: 'UserNotExist' })
    }
});

module.exports = router;