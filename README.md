Projet API NODE JS CSIA AL B3

Faire une API en Node JS, Express JS, Mongo DB qui gère les hotel

Endpoints:
    - /users
    - /hotels
    - /rooms
    - /bookings
    - /authentification

TOKEN:
    header-text: x-access-token
    header-value : token (authentification login)

USERS :
    - options : { name: string, firstname: string, email: string, password: string, isAdmin: boolean }
    - params : id
    POST
        - https://api.exemple.com/user
    GET
        - https://api.exemple.com/user
        - https://api.exemple.com/user/idUser
    PUT
        - https://api.exemple.com/user/idUser
    DELETE
        - https://api.exemple.com/user/idUser
        
LOGIN :
    - option : { eamail: string, password: string }
    - Retourne = Token pour pouvoir acceder a endpoint ou le token est demandé

HOTEL : 
    - option : ( name: String, address: String, rate: Number, rooms: Number, furnitures: Array, location: JavaScriptObjet or Array)

    POST
        - https://api.exemple.com/hotels (Add hotel)
    GET
        - https://api.exemple.com/hotels
        - https://api.exemple.com/hotels/idHotel 
    PUT
        - https://api.exemple.com/hotels/idHotel
    DELETE
        - https://api.exemple.com/hotels/idHotel 

ROOM : 
    - option : ( hotel: IdHotel, number: Number, floor: Numer, beds: Number, furnitures: Array, price: Number)

    POST
        - https://api.exemple.com/rooms
    GET
        - https://api.exemple.com/rooms
        - https://api.exemple.com/rooms/idRoom
        - https://api.exemple.com/rooms/h/idHotel (Get All rooms of a Hotel by idHotel)
    PUT
        - https://api.exemple.com/rooms/idRoom
    DELETE
        - https://api.exemple.com/rooms/idRoom

BOOKING : 
    - option : ( rooms: Array, dateArrival: 'YYYY-MM-DD', dateDeparture: 'YYYY-MM-DD', price: Number,
    comment: String, user: IdUser)

    POST
        - https://api.exemple.com/bookings
    GET
        - https://api.exemple.com/bookings
        - https://api.exemple.com/bookings/idBooking
    PUT
        - https://api.exemple.com/bookings/idBooking
    DELETE
        - https://api.exemple.com/bookings/idBooking