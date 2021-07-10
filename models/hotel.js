var mongoose = require('mongoose')
const roomModel = require('./room')

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

hotelSchema.post('findOneAndDelete', async function(doc) {
    await roomModel.deleteMany({ hotel: doc._id })
})


var hotelModel = mongoose.model('hotel', hotelSchema)

module.exports = hotelModel