var express = require("express");
var router = express.Router();
var userModel = require("../models/user");
var { encrypt } = require('../utilities/crypto')
var { validate } = require('email-validator')
var { checkToken } = require('../utilities/token')


/* https://api.monsuperhotel.com/users*/
router.post("/", checkToken, async(request, response) => {
    let { body } = request;
    body.password = encrypt(body.password);
    try {
        var user = new userModel(body);
        await user.save();
        response.send({ user });
    } catch (e) {
        response.send({ error: e.message });
    }
});

/* https://api.monsuperhotel.com/users*/
router.get("/", checkToken, async(request, response) => {
    var users = await userModel.find({}); // == "SELECT * from users"
    response.json({ users });
});

/* https://api.monsuperhotel.com/users/59bfd752z */
router.get("/:id", checkToken, async(request, response) => {
    var user = await userModel.findOne({ _id: request.params.id });
    response.json({ user });
});

/* https://api.monsuperhotel.com/users/59bfd752z*/
router.put("/:id", checkToken, async(request, response) => {
    let { body } = request;
    let dejaEmail = false;
    if (validate(body.email)) {
        var users = await userModel.find({})
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id != request.params.id) {
                if (users[i].email == body.email) {
                    dejaEmail = true;
                }
            }
        }
        if (dejaEmail == false) {
            body.password = encrypt(body.password);
            var user = await userModel.findOneAndUpdate({ _id: request.params.id },
                body, { new: true }
            );
            response.send({ result: user });
        } else response.send({ result: "UserEmailAlreadyExist" })
    } else response.send({ result: "EmailNotValid" })

});

/* https://api.monsuperhotel.com/users/59bfd752z*/
router.delete("/:id", checkToken, async(request, response) => {
    var u = await userModel.findOne({ _id: request.params.id })
    if (u) {
        var user = await userModel.findOneAndRemove({ _id: request.params.id });
        responsesend({ result: 'Success' });
    } else response.send({ result: 'UserNotExist' })
});

module.exports = router;