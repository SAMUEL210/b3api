var express = require('express')
var router = express.Router()
var { roomModel } = require('../models/models')
var { checkToken } = require('../utilities/token')

/* https://api.monsuperhotel.com/rooms*/
router.post('/', checkToken, async(request, response) => {
    let { body } = request
    try {
        var room = new roomModel(body)
        await room.save()
        response.send({ room })
    } catch (e) {
        response.send({ error: e.message })
    }
})

/* https://api.monsuperhotel.com/rooms/59bfd752z */
router.get('/:id', checkToken, async(request, response) => {
    var room = await roomModel.findOne({ _id: request.params.id })
    response.json({ room })
})

/* https://api.monsuperhotel.com/rooms/h/59bfd752z */
router.get('/h/:id', checkToken, async(request, response) => {
    var Hotelrooms = await roomModel.find({ hotel: request.params.id })
    response.send({ Hotelrooms })
})

/* https://api.monsuperhotel.com/rooms*/
router.get('/', checkToken, async(request, response) => {
    var rooms = await roomModel.find({}) // == "SELECT * from bookings"
    response.send({ rooms })
})

/* https://api.monsuperhotel.com/rooms/59bfd752z*/
router.put('/:id', checkToken, async(request, response) => {
    let { body } = request;
    let dejaNumChambre = false;
    var numChambre = await roomModel.find({})
    for (let i = 0; i < numChambre.length; i++) {
        if (numChambre[i]._id != request.params.id) {
            if (numChambre[i].number == body.number && numChambre[i].floor == body.floor && numChambre[i].hotel == body.hotel) {
                dejaNumChambre = true;
            }
        }
    }
    if (dejaNumChambre) response.send({ result: "RoomNumberAlreadyExist" })
    else {
        var room = await roomModel.findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })
        response.send(room)
    }
})

/* https://api.monsuperhotel.com/rooms/59bfd752z*/
router.delete('/:id', checkToken, async(request, response) => {
    var r = await roomModel.findOne({ _id: request.params.id })
    if (r) {
        await roomModel.findOneAndRemove({ _id: request.params.id })
        response.send({ result: "Succes" })
    } else response.send({ result: "RoomNotExist" })
})

module.exports = router