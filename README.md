                             *my e-commerce project*

this is my backend API project for an e-commerce website. It's built to handle things like looking at products, putting items in a shopping cart, and making orders.

backend:node.js and express.js
database:mongodb and mongoose


FEATURES:explaining api|
                       v
category api:for creating and getting differents product categories
products api:shows u all the products thats available
cart api:adding stuff in te cart and managing the user items
order api: processes the checkout when someone to buy something

PREREQUISITES:
node.js:v24.15.0
mongodb:run it locally on ur machine
i use npm to install the packages 

ENVIRONMENT VARIABLES:
NODE_ENV=development
This tells Node what mode the app is running in.Setting it to 'development' means the app knows we're still 
building and testing things locally, so it will give us more detailed error messages if something breaks.

PORT=5000
This is the "channel" or port number where our local backend server lives. When you run the server, it will listen on this port, meaning you'll access the API in 
your browser or Postman using http://localhost:5000.

MONGO_URI=mongodb://localhost:27017/testdb
This is the direct link (the connection string) that Mongoose uses to talk to your database. It points to your local MongoDB server (localhost:27017) 
and tells it to save everything inside a database called testdb.



API ENDPOINTS:
categories
GET /api/category - Gets all the categories.
POST /api/category - Adds a new category.

products
GET /api/products - Gets a list of all products.
GET /api/products/:id - Gets the details for just one product.
POST /api/products - Creates a new product.

cart
GET /api/cart - Sees what is currently inside the user's cart.
POST /api/cart - Adds an item to the cart or changes the quantity.
DELETE /api/cart/:itemId - Deletes an item out of the cart.

orders
POST /api/orders - Places a new order (checkout).
GET /api/orders - Shows the user's order history.

 
PROJECT STRUCTURE:
config/ & db: These folders handle our background setup. They store the settings and 
connection logic needed to link our application straight to MongoDB.
controllers: This is the "brain" folder. It holds all the actual logic and code 
functions that run when someone triggers our API (like fetching data or adding an item to a cart).
models: These are our database blueprints. They tell MongoDB exactly how our data 
collections (like products or users) must be structured.
routes: This folder acts like a traffic cop. It maps out our API endpoints and directs incoming
network requests to the correct controller functions.
middleware/ & utils: These are helper toolboxes. They contain custom tools and error handlers



CLONE GITHUB LINK:
https://github.com/mairenewperson-cmd/e-commerce-api-project
