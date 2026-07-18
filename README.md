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
node.js:the newest update
mongodb:run it locally on ur machine
npm or yarn: to install the packages (but i used npm)


APO ENDPOINTS:
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
 

CLONE GITHUB LINK:
https://github.com/mairenewperson-cmd/e-commerce-api-project
