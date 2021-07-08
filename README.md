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
        Exemples : /users/user_id (to get a user by his id)...
        
LOGIN :
    - option : { eamail: string, password: string }