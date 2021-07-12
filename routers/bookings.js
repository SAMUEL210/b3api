const express = require('express')
const router = express.Router()
const { bookingModel, roomModel } = require('../models/models')
const { checkToken } = require('../utilities/token')
const moment = require('moment')

/* https://api.monsuperhotel.com/bookings*/
router.post('/', checkToken, async(request, response) => {
    let { body } = request
    try {
        var booking = new bookingModel(body)
        await booking.save()
        response.send({ booking })
    } catch (e) {
        response.send({ error: e.message })
    }
})

/* https://api.monsuperhotel.com/bookings/59bfd752z */
router.get('/:id', checkToken, async(request, response) => {
    var booking = await bookingModel.findOne({ _id: request.params.id })
    response.send({ booking })
})

/* https://api.monsuperhotel.com/bookings*/
router.get('/', checkToken, async(request, response) => {
    var bookings = await bookingModel.find({})
    response.send({ bookings })
})

/* https://api.monsuperhotel.com/bookings/59bfd752z*/
router.put('/:id', checkToken, async(request, response) => {
    var b = await bookingModel.findOne({ _id: request.params.id })
    request.body.user = b.user // Empecher changement de l'utilisateur qui a fait la réservation
    let price = 0
    for (let i = 0; i < request.body.rooms.length; i++) {
        let room = await roomModel.findOne({ _id: request.body.rooms[i] })
        if (!room) response.send('RoomNotExist')
        else price += room.price
    }
    let arrival = moment(request.body.dateArrival, 'YYYY-MM-DD')
    let departure = moment(request.body.dateDeparture, 'YYYY-MM-DD')
    request.body.dateArrival = arrival
    request.body.dateDeparture = departure
    let duration = departure.diff(arrival, 'days')
    if (duration < 0) response.send('DateNotValid')
    request.body.price = price * duration
    var booking = await bookingModel.findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })
    response.send(booking)

})

/* https://api.monsuperhotel.com/bookings/59bfd752z*/
router.delete('/:id', checkToken, async(request, response) => {
    var booking = await bookingModel.findOneAndRemove({ _id: request.params.id })
    response.send()
})

module.exports = router