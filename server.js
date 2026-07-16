const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const productroutes = require('./routes/productRoutes.js');
const categorytroutes = require('./routes/categoryroute.js');
const cartroutes = require('./routes/cartroute.js');
const orderroutes = require('./routes/orderroute.js');
const { globalErrorHandler, AppError } = require('./middleware/errorhandler.js');

dotenv.config();
const app = express();

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(express.json()); 

app.use('/api/category', categorytroutes);
app.use('/api/products', productroutes);
app.use('/api/order', orderroutes);
app.use('/api/cart', cartroutes);

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();