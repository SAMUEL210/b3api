const mongoose = require("mongoose");
var { validate } = require('email-validator')
const moment = require('moment')

// Tous les Models pour éviter les probleme de dépendance circulaire
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

var hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    rooms: {
        type: Number,
        required: true
    },
    furnitures: {
        type: Array,
        required: true
    },
    location: {
        type: Object,
        required: true
    }
})

var roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    furnitures: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const bookingSchema = new mongoose.Schema({
    rooms: {
        type: Array,
        required: true
    },
    dateArrival: {
        type: String,
        required: true
    },
    dateDeparture: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

//Tous les hooks

userSchema.pre("save", async function(next) {
    if (validate(this.email)) {
        let user = await userModel.findOne({ email: this.email });
        if (user) next(Error("UTILISATEUR_EXIST"));
        else next();
    } else {
        next(Error("EMAIL_PAS_VALIDE"));
    }
});

hotelSchema.pre("save", async function(next) {
    try {
        let hotelsAdr = await hotelModel.findOne({ address: this.address })
        if (!hotelsAdr)
            next()
        else next(Error('HotelAtThisAdressExist'))
    } catch (e) {
        next(Error(e))
    }
});

roomSchema.pre("save", async function(next) {
    var hotel = await hotelModel.findOne({ _id: this.hotel })
    if (hotel) {
        var rooms = await roomModel.find({ hotel: this.hotel })
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].number == this.number) next(Error('ThisRoomExistInThisHotel'))
        }
        next()
    } else next(Error('HotelNotExist'))
})

hotelSchema.post('findOneAndDelete', async function(doc) {
    await roomModel.deleteMany({ hotel: doc._id })
})

bookingSchema.pre('save', async function(next) {
    let user = await userModel.findOne({ _id: this.user })
    if (user) {
        let price = 0
        for (let i = 0; i < this.rooms.length; i++) {
            let room = await roomModel.findOne({ _id: this.rooms[i] })
            if (!room) next(Error('RoomNotExist'))
            else price += room.price
        }
        let arrival = moment(this.dateArrival, 'YYYY-MM-DD')
        let departure = moment(this.dateDeparture, 'YYYY-MM-DD')
        this.dateArrival = arrival
        this.dateDeparture = departure
        let duration = departure.diff(arrival, 'days')
        if (duration < 0) next(Error('DateNotValid'))
        this.price = price * duration
        next()
    } else next(Error('UserNotExist'))
})

var userModel = mongoose.model("user", userSchema);
var hotelModel = mongoose.model('hotel', hotelSchema)
var roomModel = mongoose.model('room', roomSchema)
var bookingModel = mongoose.model('booking', bookingSchema)

module.exports = {
    userModel: userModel,
    hotelModel: hotelModel,
    roomModel: roomModel,
    bookingModel: bookingModel
}