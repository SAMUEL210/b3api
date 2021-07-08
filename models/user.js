const mongoose = require("mongoose");
var { validate } = require('email-validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        iv: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            require: true,
        },
    },
    isAdmin: {
        type: Boolean,
        required: false,
    },
});

userSchema.pre("save", async function(next) {
    if (validate(this.email)) {
        let user = await userModel.findOne({ email: this.email });
        if (user) next(Error("UTILISATEUR_EXIST"));
        else next();
    } else {
        next(Error("EMAIL_PAS_VALIDE"));
    }
});

var userModel = mongoose.model("user", userSchema);

module.exports = userModel;