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
express 5
i use npm to install the packages 


ENVIRONMENT VARIABLES:
1)NODE_ENV=development
This tells Node what mode the app is running in.Setting it to 'development' means the app knows we're still 
building and testing things locally, so it will give us more detailed error messages if something breaks.

2)PORT=5000
This is the "channel" or port number where our local backend server lives. When you run the server, it will listen on this port, meaning you'll access the API in 
your browser or Postman using http://localhost:5000.

3)MONGO_URI=mongodb://localhost:27017/testdb
This is the direct link (the connection string) that Mongoose uses to talk to your database. It points to your local MongoDB server (localhost:27017) 
and tells it to save everything inside a database called testdb.

INSTALLATION STEPS:
1-npm create packages (npm init -y)
2-install the required packages (npm install express mongoose dotenv express-mongo-sanitize express-validator)

 API Endpoints

The API is structured around four main resources: Products, Categories, Cart, and Orders.

 Products
Manage inventory and product details.

| GET | /api/product | Fetch all products |
| GET| /api/product/:id | Fetch a single product by ID |
| POST | /api/product/:categoryid | Create a new product under a specific category |
| PATCH| /api/product/:productid | Update an existing product's details |
| DELETE | /api/product/:productid | Remove a product from inventory |
---
Category
Organize products into groups.
|GET | /api/category| Fetch all categories |
| GET | /api/category/:id | Fetch a single category by ID |
| POST | /api/category | Create a new category |
| PATCH |/api/category/:id | Update a category's name/details |
| DELETE| /api/category/:id | Remove a category |
---
Cart
Manage user shopping carts.
| GET| /api/cart | View the current user's cart items |
| POST | /api/cart/items | Add an item to the cart |
| PATCH | /api/cart/items/:productid | Update the quantity of a specific item in the cart |
| DELETE | /api/cart/items/:productid | Remove a specific item from the cart |
| DELETE | /api/cart | Clear the entire cart |
---
 Order
Handle checkout and order tracking.
| POST | /api/order | Place a new order (Checkout) |
| GET| /api/order | Fetch order history |
|GET | /api/order/:id | Fetch specific order details by ID |
| PATCH | /api/order/:id/status | Update order fulfillment status (e.g., Pending, Shipped) |




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
