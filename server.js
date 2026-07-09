const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.');
require('dotenv').config();
const app = express();
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartroute');
const categoryRoutes = require('./routes/categoryroute');
const { globalErrorHandler, AppError } = require('./middleware/errorhandler');
const orderRoutes = require("./routes/orderroute");
const errorHandler = require('./middleware/errorHandler');
const mongoSanitize = require('express-mongo-sanitize');


app.use('/api/cart', cartRoutes);

// Load environment config
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(mongoSanitize());
app.use(mongoSanitize());

// Mount Routing Files
app.use('/api/categories', categoryroute);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartroute);
app.use('/api/orders', orderroute);


app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

// Error Handler
app.use(errorHandler);

// Connect to DB & start server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

