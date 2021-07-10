var express = require('express')
var router = express.Router()
var hotelModel = require('../models/hotel')
var { checkToken } = require('../utilities/token')

/* https://api.monsuperhotel.com/hotels*/
router.post('/', checkToken, async(request, response) => {
    let { body } = request
    try {
        var hotel = new hotelModel(body)
        await hotel.save()
        response.send({ hotel })
    } catch (e) {
        response.status(409).send({ error: e.message });
    }

})

/* https://api.monsuperhotel.com/hotels/59bfd752z */
router.get('/:id', checkToken, async(request, response) => {
    var hotel = await hotelModel.findOne({ _id: request.params.id })
    response.json({ hotel })
})

/* https://api.monsuperhotel.com/hotels*/
router.get('/', checkToken, async(request, response) => {
    var hotels = await hotelModel.find({}) // == "SELECT * from users"
    response.json({ hotels })
})

/* https://api.monsuperhotel.com/hotels/59bfd752z*/
router.put('/:id', checkToken, async(request, response) => {
    let { body } = request;
    let dejaAjAdress = false;
    var address = await hotelModel.find({})
    for (let i = 0; i < address.length; i++) {
        if (address[i]._id != request.params.id) {
            if (address[i].address == body.address) {
                dejaAjAdress = true;
            }
        }
    }
    if (dejaAjAdress) response.send({ resuult: 'HotelAtThisAdressExist' })
    else {
        var hotel = await hotelModel.findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })
        response.json(hotel)
    }
})

/* https://api.monsuperhotel.com/hotels/59bfd752z*/
router.delete('/:id', checkToken, async(request, response) => {
    var h = await hotelModel.findOne({ _id: request.params.id })
    if (h) {
        await hotelModel.findOneAndDelete({ _id: request.params.id })
        response.send({ result: 'Success' })
    } else response.send({ result: 'HotelNotExist' })

})

module.exports = router