var mongoose = require('mongoose')
const hotelModel = require("../models/hotel")


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

roomSchema.pre("save", async function(next) {
    var hotel = await hotelModel.findOne({ _id: this.hotel })
    if (!hotel) next(Error('HotelNotExist'))
    else next()
})

var roomModel = mongoose.model('room', roomSchema)

module.exports = roomModel