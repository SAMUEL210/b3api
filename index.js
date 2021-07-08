var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors')
require('dotenv').config()

var routerUsers = require('./routers/users')
var routerHotels = require('./routers/hotels')
var routerRooms = require('./routers/rooms')
var routerBookings = require('./routers/bookings')
var routerAuthentication = require('./routers/authentication')

mongoose.Promise = Promise
mongoose.connect(process.env.bd_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

var db = mongoose.connection
db.on('error', console.error.bind(console, "connection error: "))
db.once('open', () => console.log('status :', db.states[db._readyState]))

var app = express()
app.use(express.json())
app.use(cors({ origin: '*', exposedHeaders: 'authorization' }))

app.use('/users', routerUsers)
app.use('/hotels', routerHotels)
app.use('/rooms', routerRooms)
app.use('/bookings', routerBookings)
app.use('/login', routerAuthentication)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on', PORT)
})