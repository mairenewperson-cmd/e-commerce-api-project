require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/connect'); 
const Order = require('./models/order');     
const Product = require('./models/product');
const Category = require('./models/category');

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully.');

    console.log('Clearing existing data...');
    const orderDel = await Order.deleteMany({});
    console.log(`Deleted ${orderDel.deletedCount} orders.`);

    const productDel = await Product.deleteMany({});
    console.log(`Deleted ${productDel.deletedCount} products.`);

    const categoryDel = await Category.deleteMany({});
    console.log(`Deleted ${categoryDel.deletedCount} categories.`);

    console.log('--- Cleanup Successful! Proceeding to Seed ---');

    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Gadgets, computers, and devices' },
      { name: 'Clothing', description: 'Apparel, shoes, and accessories' },
      { name: 'Home & Living', description: 'Furniture, lights, and decor' }
    ]);

    const [electronics, clothing, homeLiving] = categories;

    const productsToInsert = [
      {
        name: 'iPhone 14',
        description: 'Latest model flagship smartphone.',
        price: 799,
        stock: 10,
        category: electronics._id
      },
      {
        name: 'Dell Laptop',
        description: 'High performance productivity laptop.',
        price: 999,
        stock: 7,
        category: electronics._id
      },
      {
        name: 'Men T-Shirt',
        description: '100% cotton premium casual shirt.',
        price: 19,
        stock: 25,
        category: clothing._id
      },
      {
        name: 'Blue Jeans',
        description: 'Classic denim slim fit jeans.',
        price: 49,
        stock: 15,
        category: clothing._id
      },
      {
        name: 'Sofa',
        description: 'Comfortable 3-seater living room couch.',
        price: 299,
        stock: 5,
        category: homeLiving._id
      },
      {
        name: 'Table Lamp',
        description: 'Modern bedside desk lamp with warm LED light.',
        price: 29,
        stock: 20,
        category: homeLiving._id
      }
    ];

    const insertedProducts = await Product.insertMany(productsToInsert);

    console.log('\n=========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Inserted Categories: ${categories.length}`);
    console.log(`Inserted Products  : ${insertedProducts.length}`);
    console.log('=========================================');

  } catch (err) {
    console.error('❌ Error during seeding process:', err);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
  }
};

seedDB();
